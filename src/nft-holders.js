require("dotenv").config();
const axios = require("axios");
const _ = require("lodash");
const fs = require("fs");

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const nftCollections = require("../config/nft-collections.json");
const getHolders = async (collection_id) => {
  const query = `query GetNftHolders($collection_id: String, $limit: Int, $offset: Int) {
        current_token_ownerships_v2(
            where: {current_token_data: {collection_id: {_eq: $collection_id}}, amount: {_gt: "0"}}
            limit: $limit
            offset: $offset
        ) {
            owner_address
            token_data_id
        }
    }`;
  let limit = 50;
  let offset = 0;

  let owners = {};

  do {
    const variables = {
      collection_id: collection_id,
      limit,
      offset,
    };
    const graphqlQuery = { query, variables };
    const data = await axios.post(GRAPHQL_ENDPOINT, graphqlQuery);
    let items = data.data.data.current_token_ownerships_v2;
    console.log(`Found ${items.length} items`);
    if (items.length == 0) break;
    _.forEach(items, (item) => {
      if (_.has(owners, item.owner_address)) {
        owners[item.owner_address] += 1;
      } else {
        owners[item.owner_address] = 1;
      }
    });

    offset += limit;
  } while (true);

  return owners;
};

const main = async () => {
  for (let i = 0; i < nftCollections.length; i++) {
    const collection = nftCollections[i];
    console.log("Downloading " + collection.name);
    const owners = await getHolders(collection.id);
    await fs.writeFileSync(`./data/${collection.name}.json`, JSON.stringify(owners, null, 4));
  }
};

main();
