import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertsStore = defineStore('user', () => {
	const user = ref(null)
	const isAuthenticated = ref(false)

	const setUser = (userData: any) => {
		user.value = userData
		isAuthenticated.value = true
	}

	const clearUser = () => {
		user.value = null
		isAuthenticated.value = false
	}

	return { user, isAuthenticated, setUser, clearUser }
})
