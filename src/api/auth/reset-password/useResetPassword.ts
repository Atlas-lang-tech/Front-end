import { useMutation } from '@pinia/colada'
import { resetPassword, type ResetPasswordParams } from '.'

export const useResetPassword = () => {
  return useMutation({
    mutation: (params: ResetPasswordParams) => resetPassword(params),
  })
}
