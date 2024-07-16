# Aptos Indexer Queries

This repository contains some useful queries/scripts to get data from Aptos Indexer API.

#### Prepare environment
```
npm i
cp .env.example .env
mkdir data
```

### 1. List holders of a collection
This script is to get list of holders of a collection and the number of NFT they hold. You need to prepare the list of NFT collections (collection_name + collection_id) in the file config/nft-collections.json.

List of the holders will be written to the file data/{collection_name}.json.

```
node src/nft-holders.js
```