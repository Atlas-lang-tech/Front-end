import { $API } from '@/api'

export interface VerifyEmailParams {
  token: string
}

export const verifyEmail = async (params: VerifyEmailParams) => {
  return $API.post(
    '/auth/verify-email',
    {
      token: params.token,
    },
    {},
  )
}
