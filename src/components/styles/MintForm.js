import styled from 'styled-components'
import { Field } from 'formik'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.h1`
  color: white;
  max-width: 80%;
  text-align: center;
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 80vw;
`

export const StyledField = styled(Field)`
  padding: 15px;
  flex:1;
  border: 2px solid #2554c7;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
`

export const SubmitButton = styled.button`
  padding: 15px;
  border: 2px solid #2554c7;
  border-left: 0px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
`

export const ErrorContainer = styled.div`
  color: red;
`