import React from 'react'
import { BallTriangle } from 'react-loader-spinner'

import { Container } from './styles/Loading'

export default () => {
  return (
    <Container>
      <BallTriangle color="#00BFFF" height={220} width={220} />
    </Container>
  )
}
