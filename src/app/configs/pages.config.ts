export const $PAGES = {
	main: {
		index: '/',
		catalog: '/catalog',
		course: (courseId: string | number) => `/catalog/${courseId}`,
		lesson: (courseId: string | number, lessonId: string | number) =>
			`/catalog/${courseId}/lesson/${lessonId}`,
		myLearning: '/my-learning',
		profile: '/profile',
		vocabulary: '/vocabulary',
		vocabularyStudy: (dictionaryId: string | number) =>
			`/vocabulary/${dictionaryId}`,
		vocabularyGame: (dictionaryId: string | number, mode: string) =>
			`/vocabulary/${dictionaryId}/play/${mode}`,
	},

	user: {
		profile: '/user/profile',
		settings: '/user/settings',
		pricing: '/user/pricing',
		vocabulary: '/user/vocabulary',
		vocabularyDetail: (dictionaryId: string | number) =>
			`/user/vocabulary/${dictionaryId}`,
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
		plans: {
			list: '/admin/plans',
		},
		categories: {
			list: '/admin/categories',
		},
		language: {
			list: '/admin/languages',
			languageLevel: {
				list: '/admin/languages/levels',
			},
		},
		course: {
			list: '/admin/courses',
			lessons: (courseId: string | number) =>
				`/admin/courses/${courseId}/lessons`,
			lesson: (courseId: string | number, lessonId: string | number) =>
				`/admin/courses/${courseId}/lessons/${lessonId}`,
		},
	},
}
