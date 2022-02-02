import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import { Container, Title } from './styles/MintForm'

export default ({ onSubmit }) => {
  const submitSchema = Yup.object().shape({
    imgUrl: Yup.string()
      .matches(/((https?):\/\/)?(www.)*$/, 'Enter correct url!')
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
            <Field name="imgUrl" />
            {errors.imgUrl && touched.imgUrl ? <div>{errors.imgUrl}</div> : null}
            <button type="submit">MINT</button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
