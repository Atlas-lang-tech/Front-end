import { $API } from '@/api'
import type { AuthResponse } from '@/types/auth'

export interface RegistrationParams {
	email: string
	username: string
	password: string
}

export const registration = async (
	params: RegistrationParams,
): Promise<AuthResponse> => {
	return $API.post(
		'/auth/register',
		{
			email: params.email,
			username: params.username,
			password: params.password,
		},
		{},
	)
}
