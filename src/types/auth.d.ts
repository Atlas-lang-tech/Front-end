import type { User } from './user'

export interface AuthResponse {
	token: {
		accessToken: string
	}
	user: User
}
