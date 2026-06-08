export const $PAGES = {
	main: {
		index: '/',
		catalog: '/catalog',
		myLearning: '/my-learning',
		profile: '/profile',
	},

	auth: {
		login: '/auth/login',
		register: '/auth/registration',
		forgotPassword: '/auth/forgot-password',
		resetPassword: '/auth/reset-password',
		verifyEmail: '/auth/verify-email',
	},

	admin: {
		dashboard: '/admin/dashboard',
		categories: {
			list: '/admin/categories',
			create: '/admin/categories/create',
		},
		language: {
			list: '/admin/languages',
			create: '/admin/languages/create',
			languageLevel: {
				list: '/admin/languages/levels',
				create: '/admin/languages/levels/create',
			},
		},
		course: {
			list: '/admin/courses',
			create: '/admin/courses/create',
		},
	},
}
