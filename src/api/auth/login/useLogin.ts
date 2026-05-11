import { useMutation } from '@pinia/colada'
import { login, type LoginParams } from '.'

export const useLogin = () => {
	return useMutation({
		mutation: (params: LoginParams) => login(params),
		onSuccess: data => {
			console.log(data)
			localStorage.setItem('accessToken', data.data.accessToken)
		},
	})
}
