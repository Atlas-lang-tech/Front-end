import { $PAGES } from '@/app/configs/pages.config'
import AdminLayout from '@/layout/AdminLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'
import { useUserStore } from '@/stores/user.store'
import type { User } from '@/types/user'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin.router'
import { authRoutes } from './auth.router'
import { mainRoutes } from './main.router'
import { userRoutes } from './user.router'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/user', component: UserLayout, children: userRoutes },
		{
			path: '/admin',
			component: AdminLayout,
			children: adminRoutes,
			meta: { roles: ['ADMIN', 'MODERATOR'] satisfies User['role'][] },
		},
		{
			path: '/auth',
			component: AuthLayout,
			children: authRoutes,
			meta: { public: true },
		},
		{ path: '/', component: MainLayout, children: mainRoutes },
	],
})

router.beforeEach(to => {
	const isAuthenticated = !!localStorage.getItem('accessToken')

	if (!to.meta.public && !isAuthenticated) {
		return { path: $PAGES.auth.login, query: { redirect: to.fullPath } }
	}

	if (to.meta.public && isAuthenticated) {
		return { path: $PAGES.main.index }
	}

	const matchedWithRoles = to.matched.filter(record => record.meta.roles)

	if (matchedWithRoles.length) {
		const { user } = useUserStore()

		const allowed = matchedWithRoles.every(record =>
			(record.meta.roles as User['role'][]).includes(user?.role as User['role']),
		)

		if (!user || !allowed) {
			return { path: $PAGES.main.index }
		}
	}
})
