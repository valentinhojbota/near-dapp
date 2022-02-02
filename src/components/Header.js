import React from 'react'

import { Container, AccountContainer, UserText, BalanceText, Button } from './styles/Header'

const Header = ({ account, logout }) => {
  return (
    <Container>
      <AccountContainer>
        <BalanceText>Balance: {account?.walletConnection?.balance || 0} N</BalanceText>
        <UserText>{account?.accountId}</UserText>
      </AccountContainer>
      <Button onClick={logout}>logout</Button>
    </Container>
  )
}

export default Header
