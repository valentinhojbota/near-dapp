import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  margin: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`
export const NftCard = styled.div`
  background: white;
  min-width: 200px;
  max-width: 400px;
  width: 20vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  margin: 10px 5px;
  padding: 10px;
`
export const NftImage = styled.div`
  height: 18vw;
  width: 18vw;
  min-width: 200px;
  min-height: 200px;
  max-width: 400px;
  max-height: 400px;
  border-radius: 10px;
  background: gray;
  background-image: url(${props => props.imgUrl});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
export const NftOwner = styled.div`
  margin: 10px;
  padding: 10px;
  border: 2px solid gold;
  border-radius: 10px;
`

export const NftPrice = styled.div`
  margin-left: auto;
`
