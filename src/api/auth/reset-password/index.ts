import { $API } from '@/api'

export interface ResetPasswordParams {
  token: string
  newPassword: string
}

export const resetPassword = async (params: ResetPasswordParams) => {
  return $API.post(
    '/auth/reset-password',
    {
      token: params.token,
      newPassword: params.newPassword,
    },
    {},
  )
}
