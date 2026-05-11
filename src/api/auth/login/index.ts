import { $API } from '@/api'
import type { AuthResponse } from '@/types/auth'
import type { NotFetchResponse } from '@astralis-os/notfetch'

export interface LoginParams {
	email: string
	password: string
}

export const login = async (
	params: LoginParams,
): Promise<NotFetchResponse<AuthResponse>> => {
	return $API.post(
		'/auth/login',
		{
			email: params.email,
			password: params.password,
		},
		{},
	)
}
