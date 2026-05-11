import AdminLayout from '@/layout/AdminLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin.router'
import { authRoutes } from './auth.router'
import { userRoutes } from './user.router'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/user', component: UserLayout, children: userRoutes },
		{ path: '/admin', component: AdminLayout, children: adminRoutes },
		{ path: '/auth', component: AuthLayout, children: authRoutes },
	],
})
