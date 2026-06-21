import { useBillingStore } from '@/stores/billing.store'
import { useUserStore } from '@/stores/user.store'
import { useMutation } from '@pinia/colada'
import { login, type LoginParams } from '.'

export const useLogin = () => {
	return useMutation({
		mutation: (params: LoginParams) => login(params),
		onSuccess: data => {
			localStorage.setItem('accessToken', data.data.token.accessToken)
			const userStore = useUserStore()
			userStore.setUser(data.data.user)

			const billingStore = useBillingStore()
			billingStore.loadSubscription()
			billingStore.loadPurchases()
			billingStore.loadPlans()
		},
	})
}
