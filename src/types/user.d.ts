export interface User {
	id: string
	username: string
	email: string
	role: 'ADMIN' | 'USER' | 'MODERATOR'
	planCode?: string
	emailVerified?: boolean
}
