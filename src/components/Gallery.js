import React from 'react'

import { Container, NftCard, NftImage, NftOwner, NftPrice } from './styles/Gallery'

export default ({ items }) => {
  return (
    <Container>
      {items.map(({ metadata: imgUrl, token_id: id, owner_id: ownerId, price }) => {
        return (
          <NftCard key={`nft-card-${id}`}>
            <NftImage imgUrl={imgUrl}></NftImage>
            <NftOwner>{ownerId}</NftOwner>
            <NftPrice>{price} N</NftPrice>
          </NftCard>
        )
      })}
    </Container>
  )
}
