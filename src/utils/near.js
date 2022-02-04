import getConfig from '../config'
import * as nearAPI from 'near-api-js'

export const { GAS, networkId, nodeUrl, walletUrl, nameSuffix, contractName, contractMethods, accessKeyMethods } =
  getConfig()

const { Account, Contract } = nearAPI

export function formatAccountId(accountId, len = 16) {
  if (accountId.length > len) {
    return accountId.substr(0, len - 3) + '...'
  }
  return accountId
}

export function getContract(account, methods = contractMethods) {
  return new Contract(account, contractName, { ...methods })
}

export const getWallet = async () => {
  const near = await nearAPI.connect({
    networkId,
    nodeUrl,
    walletUrl,
    deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() },
  })
  const wallet = new nearAPI.WalletAccount(near)
  const contractAccount = new Account(near.connection, contractName)
  return { near, wallet, contractAccount }
}
