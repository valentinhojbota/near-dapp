const contractName = 'valih.testnet'

module.exports = function geConfig() {
  let config = {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    contractName,
  }

  if (process.env.REACT_APP_ENV !== undefined) {
    config = {
      ...config,
      GAS: '3000000000000',
      DEFAULT_NEW_ACCOUNT_AMOUNT: '10',
      contractMethods: {
        changeMethods: ['new', 'mint_token', 'nft_transfer'],
        viewMethods: ['get_token_data', 'get_num_tokens'],
      },
    }
  }

  return config
}
