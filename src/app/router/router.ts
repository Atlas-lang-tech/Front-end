import { $PAGES } from '@/app/configs/pages.config'
import AdminLayout from '@/layout/AdminLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin.router'
import { authRoutes } from './auth.router'
import { mainRoutes } from './main.router'
import { userRoutes } from './user.router'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/user', component: UserLayout, children: userRoutes },
		{ path: '/admin', component: AdminLayout, children: adminRoutes },
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
})
