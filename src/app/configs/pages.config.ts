export const $PAGES = {
	main: {
		index: '/',
		catalog: '/catalog',
		course: (courseId: string | number) => `/catalog/${courseId}`,
		lesson: (courseId: string | number, lessonId: string | number) =>
			`/catalog/${courseId}/lesson/${lessonId}`,
		myLearning: '/my-learning',
		profile: '/profile',
	},

	user: {
		profile: '/user/profile',
		settings: '/user/settings',
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
		users: {
			list: '/admin/users',
		},
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
			lessons: (courseId: string | number) =>
				`/admin/courses/${courseId}/lessons`,
			lesson: (courseId: string | number, lessonId: string | number) =>
				`/admin/courses/${courseId}/lessons/${lessonId}`,
		},
	},
}
