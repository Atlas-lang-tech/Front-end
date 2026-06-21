import CategoryAdminPage from '@/pages/admin/categories/CategoryAdminPage.vue'
import CoursesAdminPage from '@/pages/admin/courses/CoursesAdminPage.vue'
import DashboardAdminPage from '@/pages/admin/dashboard/DashboardAdminPage.vue'
import LanguagesAdminPage from '@/pages/admin/languages/LanguagesAdminPage.vue'
import LanguageLevelsAdminPage from '@/pages/admin/languages/levels/LanguageLevelsAdminPage.vue'
import LessonsAdminPage from '@/pages/admin/courses/lessons/LessonsAdminPage.vue'
import LessonEditorAdminPage from '@/pages/admin/courses/lessons/editor/LessonEditorAdminPage.vue'
import PlansAdminPage from '@/pages/admin/plans/PlansAdminPage.vue'
import UsersAdminPage from '@/pages/admin/users/UsersAdminPage.vue'
import type { User } from '@/types/user'

// admin.router.ts
import { h } from 'vue'
import { RouterView } from 'vue-router'

const pass = { render: () => h(RouterView) }

export const adminRoutes = [
	{ path: 'dashboard', component: DashboardAdminPage },

	{
		path: 'users',
		component: UsersAdminPage,
		meta: { breadcrumb: 'Users', roles: ['ADMIN'] satisfies User['role'][] },
	},

	{
		path: 'categories',
		component: CategoryAdminPage,
		meta: { breadcrumb: 'Categories' },
	},

	{
		path: 'plans',
		component: PlansAdminPage,
		meta: { breadcrumb: 'Plans', roles: ['ADMIN'] satisfies User['role'][] },
	},

	{
		path: 'languages',
		component: pass,
		meta: { breadcrumb: 'Languages' },
		children: [
			{ path: '', component: LanguagesAdminPage, meta: { breadcrumb: false } },
			{
				path: 'levels',
				component: LanguageLevelsAdminPage,
				meta: { breadcrumb: 'Levels' },
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
				path: ':courseId/lessons',
				component: pass,
				meta: { breadcrumb: 'Lessons' },
				children: [
					{
						path: '',
						component: LessonsAdminPage,
						meta: { breadcrumb: false },
					},
					{
						path: ':lessonId',
						component: LessonEditorAdminPage,
						meta: { breadcrumb: 'Editor' },
					},
				],
			},
		],
	},
]
