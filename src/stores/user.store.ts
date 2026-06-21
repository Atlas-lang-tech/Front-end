import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
	'user',
	() => {
		const user = ref<User | null>(null)
		const isAuthenticated = ref(false)

		const isAdmin = computed(() => user.value?.role === 'ADMIN')

		const setUser = (userData: User) => {
			user.value = userData
			isAuthenticated.value = true
		}

		const clearUser = () => {
			user.value = null
			isAuthenticated.value = false
		}

		return { user, isAuthenticated, isAdmin, setUser, clearUser }
	},
	{
		persist: true,
	},
)
