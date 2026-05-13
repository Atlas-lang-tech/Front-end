import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
	'user',
	() => {
		const user = ref<User | null>(null)
		const isAuthenticated = ref(false)

		const setUser = (userData: User) => {
			user.value = userData
			isAuthenticated.value = true
		}

		const clearUser = () => {
			user.value = null
			isAuthenticated.value = false
		}

		return { user, isAuthenticated, setUser, clearUser }
	},
	{
		persist: true,
	},
)
