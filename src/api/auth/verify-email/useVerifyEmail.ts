import { useMutation } from '@pinia/colada'
import { verifyEmail, type VerifyEmailParams } from '.'

export const useVerifyEmail = () => {
  return useMutation({
    mutation: (params: VerifyEmailParams) => verifyEmail(params),
  })
}
