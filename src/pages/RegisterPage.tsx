import { useState } from 'react'

import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { postUser } from '@/lib/client/endpoints/user.endpoint'
import tokenService from '@/services/TokenService'

interface RegiterForm {
  username: string
  email: string
  password: string
}

const RegisterPage = () => {
  const { handleSubmit, register } = useForm<RegiterForm>({})

  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()

  const { mutate } = useMutation(postUser, {
    onSuccess: (data) => {
      setErrorMessages([])
      tokenService.set(data.user.token)
      navigate('/')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrorMessages(
            Object.entries(error.response.data.errors).map(([key, value]) => `${key} ${value}`)
          )
        }
      }
    },
  })

  const submit = async (data: RegiterForm) => {
    mutate({
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    })
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <a href="">Have an account?</a>
              </p>

              {errorMessages.length !== 0 && (
                <ul className="error-messages">
                  {errorMessages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit(submit)}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    {...register('username')}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default RegisterPage
