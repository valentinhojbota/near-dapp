# near-dapp

This project contains a NFT Rust contract and a React dapp, that allows a user to create their own NFT with just an image or gif link. [Click here](http://near-dapp.s3-website-us-east-1.amazonaws.com) to see how it works on the testnet.

### Scripts
```sh
yarn test:contract // Run the contract tests
yarn build:contract // Build the contract
yarn deploy:contract // Build the contract and deploy the contract on the testnet 
yarn test // Run the frontend tests
yarn start // Start the localhost:1234
yarn build // Build the React app
```

## React

The frontend is made in React, the connection to the smart contract is made with [near -api-js](https://docs.near.org/docs/develop/front-end/near-api-js) and tested with [jest](https://jestjs.io/ro/docs/getting-started). 

Other dependencies used:
- formik
- react-loader-spinner
- styled-components
- yup
- prettier

## Contract

The Smart Contract is made in Rust, that implement a basic NonFungibleToken using near_sdk. This provides methods for minting, displaying and transferring NFTs, also contains a suite of tests.
