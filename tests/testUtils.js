const fs = require('fs')
const BN = require('bn.js')
const nearAPI = require('near-api-js')
const getConfig = require('../config')

const { nodeUrl, networkId, contractMethods, contractName, DEFAULT_NEW_ACCOUNT_AMOUNT } = getConfig(true)
const {
  keyStores: { InMemoryKeyStore },
  Near,
  Account,
  Contract,
  KeyPair,
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI

const credentials = JSON.parse(
  fs.readFileSync(`${process.env.HOME}/.near-credentials/${networkId}/${contractName}.json`)
)
const keyStore = new InMemoryKeyStore()
keyStore.setKey(networkId, contractName, KeyPair.fromString(credentials.private_key))
const near = new Near({
  networkId,
  nodeUrl,
  deps: { keyStore },
})
const { connection } = near
const contractAccount = new Account(connection, contractName)
contractAccount.addAccessKey = publicKey =>
  contractAccount.addKey(publicKey, contractName, contractMethods.changeMethods, parseNearAmount('0.1'))
const contract = new Contract(contractAccount, contractName, contractMethods)

/********************************
Internal Helpers
********************************/
async function createAccount(accountId, fundingAmount = DEFAULT_NEW_ACCOUNT_AMOUNT) {
  const contractAccount = new Account(connection, contractName)
  const newKeyPair = KeyPair.fromRandom('ed25519')
  await contractAccount.createAccount(accountId, newKeyPair.publicKey, new BN(parseNearAmount(fundingAmount)))
  keyStore.setKey(networkId, accountId, newKeyPair)
  return new nearAPI.Account(connection, accountId)
}

function generateUniqueString(account) {
  return `${(Math.random() + 1).toString(36).substring(7)}.${account}.testnet`
}

/********************************
Exports
********************************/

async function initContract() {
  try {
    await contract.new({ args: { owner_id: contractName } })
  } catch (e) {
    if (!/The contract has already been initialized/.test(e.toString())) {
      throw e
    }
  }
  return { contract, contractName }
}

async function getAccount(accountId, fundingAmount = DEFAULT_NEW_ACCOUNT_AMOUNT) {
  accountId = accountId || generateUniqueString('valih')
  const account = await new nearAPI.Account(connection, accountId)
  try {
    await account.state()
    return account
  } catch (e) {
    if (!/does not exist/.test(e.toString())) {
      throw e
    }
  }
  return createAccount(accountId, fundingAmount)
}

module.exports = {
  connection,
  contract,
  initContract,
  getAccount,
}
