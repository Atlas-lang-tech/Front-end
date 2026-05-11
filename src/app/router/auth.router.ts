import LoginPage from '@/pages/auth/login/LoginPage.vue'
import RegistrationPage from '@/pages/auth/registration/RegistrationPage.vue'

export const authRoutes = [
	{ path: 'login', component: LoginPage },
	{ path: 'registration', component: RegistrationPage },
]
