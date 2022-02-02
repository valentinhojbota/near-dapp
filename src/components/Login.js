import React from 'react'

import { Container, Title, Button } from './styles/Login'

export default ({ login }) => {
  return (
    <Container>
      <Title>Connect your near wallet and mint your oun NFTs</Title>
      <Button onClick={login}>Login</Button>
    </Container>
  )
}
