const nearAPI = require('near-api-js')
const getConfig = require('../src/config.js')
const testUtils = require('./testUtils')

const {
  Account,
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI

const { connection, initContract, getAccount, contract } = testUtils

const { GAS, contractName } = getConfig()

describe('deploy contract ' + contractName, () => {
  let vali // bob, bobPublicKey, bobAccountId, bobTokenId;

  const metadata = 'https://upload.wikimedia.org/wikipedia/commons/2/24/NFT_Icon.png'

  beforeAll(() =>
    getAccount('valih.testnet').then(user => {
      vali = user
      return initContract(vali.accountId)
    })
  )

  test('contract hash', () =>
    new Account(connection, contractName)
      .state()
      .then(state => expect(state.code_hash).not.toEqual('11111111111111111111111111111111')))

  test('check create owner', () =>
    contract
      .mint_token({
        args: {
          owner_id: vali.accountId,
          metadata,
        },
        gas: GAS,
        amount: parseNearAmount('0.001'),
      })
      .then(token_id =>
        contract.get_token_data({
          token_id,
        })
      )
      .then(token_data => {
        expect(token_data.owner_id).toEqual(vali.accountId)
        expect(token_data.metadata).toEqual(metadata)
      }))
})
