import ForgotPasswordPage from '@/pages/auth/forgot-password/ForgotPasswordPage.vue'
import LoginPage from '@/pages/auth/login/LoginPage.vue'
import RegistrationPage from '@/pages/auth/registration/RegistrationPage.vue'
import ResetPasswordPage from '@/pages/auth/reset-password/ResetPasswordPage.vue'
import VerifyEmailPage from '@/pages/auth/verify-email/VerifyEmailPage.vue'

export const authRoutes = [
	{ path: 'login', component: LoginPage },
	{ path: 'registration', component: RegistrationPage },
	{ path: 'forgot-password', component: ForgotPasswordPage },
	{ path: 'reset-password', component: ResetPasswordPage },
	{ path: 'verify-email', component: VerifyEmailPage },
]
