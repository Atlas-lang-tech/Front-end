import { useMutation } from '@pinia/colada'
import { forgotPassword, type ForgotPasswordParams } from '.'

export const useForgotPassword = () => {
  return useMutation({
    mutation: (params: ForgotPasswordParams) => forgotPassword(params),
  })
}
