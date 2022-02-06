import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { Container, Title, FormRow, SubmitButton, StyledField, ErrorContainer } from './styles/MintForm'

export default ({ onSubmit }) => {
  const submitSchema = Yup.object().shape({
    imgUrl: Yup.string()
      .matches(/(https?:\/\/)[^\s]+/, 'Enter correct url!')
      .required('Image url is required'),
  })

  return (
    <Container>
      <Title>Create your own NFT just by adding the image url below</Title>
      <Formik
        initialValues={{
          imgUrl: '',
        }}
        validationSchema={submitSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <FormRow>
              <StyledField name="imgUrl" />
              <SubmitButton type="submit">MINT</SubmitButton>
            </FormRow>
            {errors.imgUrl && touched.imgUrl ? <ErrorContainer>{errors.imgUrl}</ErrorContainer> : null}
          </Form>
        )}
      </Formik>
    </Container>
  )
}
