import React, { useState, useEffect } from 'react'
import * as nearAPI from 'near-api-js'

import getConfig from './config'

import { Header, Loading, Login, MintForm, Gallery } from './components'

import { getWallet, getContract } from './utils/near'

const { contractName, GAS } = getConfig()

export const {
  utils: {
    format: { formatNearAmount, parseNearAmount },
  },
} = nearAPI

const App = () => {
  const [wallet, setWallet] = useState(null)
  const [contractAccount, setContractAccount] = useState(null)
  const [account, setAccount] = useState(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState([])

  const initNear = async () => {
    const { wallet: newWallet, contractAccount: newContractAccount } = await getWallet()

    newWallet.signIn = async () => {
      await newWallet.requestSignIn(contractName, 'Blah Blah')
      await setIsSignedIn(true)
    }

    const signOut = newWallet.signOut
    newWallet.signOut = async () => {
      await signOut.call(newWallet)
      await setWallet(null)
      await setContractAccount(null)
      await setAccount(null)
      await setIsSignedIn(false)
    }

    let newAccount = null
    if (newWallet.isSignedIn()) {
      newAccount = newWallet.account()
      newWallet.balance = formatNearAmount((await newWallet.account().getAccountBalance()).available, 2)
    }

    await setWallet(newWallet)
    await setContractAccount(newContractAccount)
    await setAccount(newAccount)
    await setIsSignedIn(newWallet.isSignedIn())
  }

  const loadItems = async () => {
    if (!account) {
      return
    }
    const contract = getContract(account)
    const num_tokens = await contract.get_num_tokens()
    const newItems = []
    for (let i = 1; i <= num_tokens; i++) {
      const data = await contract.get_token_data({
        token_id: i,
      })
      newItems.push({
        ...data,
        token_id: i,
      })
    }
    newItems.reverse()
    setItems(newItems)
  }

  useEffect(async () => {
    await initNear()
    await setIsLoading(false)
  }, [])

  useEffect(async () => {
    await setIsLoading(true)
    await loadItems()
    await setIsLoading(false)
  }, [account])

  const onSubmit = async ({ imgUrl }) => {
    if (!account) {
      return setIsSignedIn(false)
    }
    await setIsLoading(true)
    const contract = getContract(account)
    await contract.mint_token({
      args: {
        metadata: imgUrl,
        owner_id: account.accountId,
      },
      gas: GAS,
      amount: parseNearAmount('0.001'),
    })
    await loadItems()
    await setIsLoading(false)
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className="dashboard">
      {!isSignedIn && <Login login={wallet?.signIn} />}
      <Header account={account} logout={wallet?.signOut} />
      <MintForm onSubmit={onSubmit} />
      <Gallery items={items} />
    </div>
  )
}

export default App
