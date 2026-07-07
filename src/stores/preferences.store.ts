import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore(
	'preferences',
	() => {
		const nativeLanguageId = ref<number | null>(null)

		const setNativeLanguageId = (id: number | null) => {
			nativeLanguageId.value = id
		}

		return { nativeLanguageId, setNativeLanguageId }
	},
	{
		persist: true,
	},
)
