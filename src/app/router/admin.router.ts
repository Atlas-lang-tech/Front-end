import CategoryAdminPage from '@/pages/admin/categories/CategoryAdminPage.vue'
import CategoryAddAdminPage from '@/pages/admin/categories/add/CategoryAddAdminPage.vue'
import CoursesAdminPage from '@/pages/admin/courses/CoursesAdminPage.vue'
import CoursesCreateAdminPage from '@/pages/admin/courses/create/CoursesCreateAdminPage.vue'
import DashboardAdminPage from '@/pages/admin/dashboard/DashboardAdminPage.vue'
import LanguagesAdminPage from '@/pages/admin/languages/LanguagesAdminPage.vue'
import LanguageCreateAdminPage from '@/pages/admin/languages/create/LanguageCreateAdminPage.vue'
import LanguageLevelsAdminPage from '@/pages/admin/languages/levels/LanguageLevelsAdminPage.vue'
import LanguageLevelCreateAdminPage from '@/pages/admin/languages/levels/create/LanguageLevelCreateAdminPage.vue'

// admin.router.ts
import { h } from 'vue'
import { RouterView } from 'vue-router'

const pass = { render: () => h(RouterView) }

export const adminRoutes = [
	{ path: 'dashboard', component: DashboardAdminPage },

	{
		path: 'categories',
		component: pass,
		meta: { breadcrumb: 'Categories' },
		children: [
			{ path: '', component: CategoryAdminPage, meta: { breadcrumb: false } },
			{
				path: 'create',
				component: CategoryAddAdminPage,
				meta: { breadcrumb: 'Create' },
			},
		],
	},

	{
		path: 'languages',
		component: pass,
		meta: { breadcrumb: 'Languages' },
		children: [
			{ path: '', component: LanguagesAdminPage, meta: { breadcrumb: false } },
			{
				path: 'create',
				component: LanguageCreateAdminPage,
				meta: { breadcrumb: 'Create' },
			},
			{
				path: 'levels',
				component: pass,
				meta: { breadcrumb: 'Levels' },
				children: [
					{
						path: '',
						component: LanguageLevelsAdminPage,
						meta: { breadcrumb: false },
					},
					{
						path: 'create',
						component: LanguageLevelCreateAdminPage,
						meta: { breadcrumb: 'Create' },
					},
				],
			},
		],
	},

	{
		path: 'courses',
		component: pass,
		meta: { breadcrumb: 'Courses' },
		children: [
			{ path: '', component: CoursesAdminPage, meta: { breadcrumb: false } },
			{
				path: 'create',
				component: CoursesCreateAdminPage,
				meta: { breadcrumb: 'Create' },
			},
		],
	},
]
