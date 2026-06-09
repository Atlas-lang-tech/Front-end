import { $API } from '@/api'
import type { User } from '@/types/user'

export const getAllUsers = async (): Promise<User[]> => {
	const response = await $API.get<User[]>('/auth/users', {})
	return response.data
}
