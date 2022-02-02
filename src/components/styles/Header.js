import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  min-height: 3rem;
  background: #3a3b3c;
  box-shadow: 0px -4px 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`

export const UserText = styled.span`
  font-size: 1rem;
  color: white;
`

export const BalanceText = styled.span`
  font-size: 1.6rem;
  color: white;
`

export const Button = styled.div`
  padding: 0.8rem;
  margin: 1rem;
  font-size: 1rem;
  width: fit-content;
  background-color: transparent;
  border: 2px solid #2554c7;
  border-radius: 7px;
  color: white;
`
