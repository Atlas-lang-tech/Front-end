import { useMutation } from '@pinia/colada'
import { registration, type RegistrationParams } from '.'

export const useRegistration = () => {
	return useMutation({
		mutation: (params: RegistrationParams) => registration(params),
	})
}
