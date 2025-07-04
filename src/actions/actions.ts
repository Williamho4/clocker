'use server'

import { auth, ErrorCode } from '@/lib/auth'
import { signInSchema, signUpSchema } from '@/lib/validations'
import { APIError } from 'better-auth/api'

export const signUpUser = async (signUpData: unknown) => {
  const validatedData = signUpSchema.safeParse(signUpData)

  if (!validatedData.success) {
    return {
      error: 'Not valid form data',
    }
  }

  const { email, password, firstName, lastName } = validatedData.data

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
      },
    })

    return { error: null }
  } catch (error) {
    if (error instanceof APIError) {
      const errCode = error.body ? (error.body.code as ErrorCode) : 'UNKNOWN'
      switch (errCode) {
        case 'USER_ALREADY_EXISTS':
          return { error: 'Something went wrong, Please try again' }
        default:
          return { error: error.message }
      }
    }

    return { error: 'Internal server error' }
  }
}

export const signInUser = async (logInData: unknown) => {
  const validatedData = signInSchema.safeParse(logInData)

  if (!validatedData.success) {
    return {
      error: 'Not valid form data',
    }
  }

  try {
    await auth.api.signInEmail({
      body: {
        ...validatedData.data,
      },
    })

    return { error: null }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message }
    }

    console.log(error)

    return { error: 'Internal server error' }
  }
}
