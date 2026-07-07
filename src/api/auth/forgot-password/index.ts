import { $API } from '@/api'

export interface ForgotPasswordParams {
  email: string
}

export const forgotPassword = async (params: ForgotPasswordParams) => {
  return $API.post(
    '/auth/forgot-password',
    {
      email: params.email,
    },
    {},
  )
}
