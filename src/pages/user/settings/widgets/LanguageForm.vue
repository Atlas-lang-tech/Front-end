<script setup lang="ts">
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { usePreferencesStore } from '@/stores/preferences.store'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// store
// ---------------------

const preferences = usePreferencesStore()
const { nativeLanguageId } = storeToRefs(preferences)

// ---------------------
// api
// ---------------------

const { data: languages } = useLanguageGetAll()

// ---------------------
// local state
// ---------------------

const ALL = 'all'

const selected = ref<string>(
	nativeLanguageId.value != null ? String(nativeLanguageId.value) : ALL,
)

watch(nativeLanguageId, value => {
	selected.value = value != null ? String(value) : ALL
})

// ---------------------
// submit
// ---------------------

const onSave = () => {
	preferences.setNativeLanguageId(
		selected.value === ALL ? null : Number(selected.value),
	)
	toast.success('Language preference saved')
}
</script>

<template>
	<Card class="p-6">
		<div class="mb-5">
			<h2 class="text-lg font-bold">Course language</h2>
			<p class="text-sm text-muted-foreground">
				Pick your native language to see courses explained in it
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<div>
				<Label>My language</Label>
				<Select v-model="selected">
					<SelectTrigger class="w-full">
						<SelectValue placeholder="All languages" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem :value="ALL">All languages</SelectItem>
						<SelectItem
							v-for="language in languages?.data"
							:key="language.id"
							:value="String(language.id)"
						>
							{{ language.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Button size="sm" class="self-end" @click="onSave">Save changes</Button>
		</div>
	</Card>
</template>
