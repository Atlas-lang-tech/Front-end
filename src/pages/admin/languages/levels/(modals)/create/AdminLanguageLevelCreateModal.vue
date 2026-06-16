<script setup lang="ts">
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelCreate } from '@/api/languages/level/create/useLanguageLevelCreate'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { toTypedSchema } from '@vee-validate/valibot'
import { PlusIcon } from 'lucide-vue-next'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// emits
// ---------------------
const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
	languageId: v.number('Language is required'),
})

// ---------------------
// api
// ---------------------
const addLanguageLevel = useLanguageLevelCreate()
const languages = useLanguageGetAll()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, setFieldValue, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: '',
		languageId: undefined,
	},
})

// ---------------------
// fields
// ---------------------
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: languageId, errorMessage: languageError } =
	useField<number>('languageId')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await addLanguageLevel.mutateAsync({
			name: values.name,
			languageId: values.languageId,
		})

		toast.success('Language level added successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while adding language level')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Level
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Language Level</DialogTitle>
				<DialogDescription> Add a new language level. </DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Name</Label>
					<Input v-model="name" placeholder="Enter language level name.." />
					<p class="text-red-500 text-sm">{{ nameError }}</p>
				</div>

				<div class="mt-2">
					<Label>Language</Label>

					<Select
						:model-value="languageId"
						@update:model-value="
							val =>
								setFieldValue(
									'languageId',
									val === null ? undefined : Number(val),
								)
						"
					>
						<SelectTrigger>
							<SelectValue placeholder="Select language" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem
								v-for="language in languages.data.value?.data"
								:key="language.id"
								:value="language.id"
							>
								{{ language.name }}
							</SelectItem>
						</SelectContent>
					</Select>

					<p class="text-red-500 text-sm">{{ languageError }}</p>
				</div>

				<DialogFooter class="mt-4">
					<Button :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Create' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
