import { $API } from '@/api'
import type { User } from '@/types/user'

export interface EditUserRoleParams {
	id: string
	role: User['role']
}

export const editUserRole = async ({ id, role }: EditUserRoleParams) => {
	return $API.patch(`/auth/users/${id}/role`, { role })
}
