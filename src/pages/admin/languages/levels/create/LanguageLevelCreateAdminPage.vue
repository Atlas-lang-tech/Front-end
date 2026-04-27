<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'

import { toast } from 'vue-sonner'

import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelCreate } from '@/api/languages/level/create/useLanguageLevelCreate'

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
	} catch (e) {
		toast.error('Error while adding language level')
	}
})
</script>

<template>
	<main class="w-full h-full flex justify-center items-center">
		<Card class="p-5">
			<div class="text-2xl font-bold">Add new language level</div>

			<form @submit="onSubmit" class="w-full">
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

				<Button
					type="submit"
					class="w-full mt-5"
					size="sm"
					:disabled="isSubmitting"
				>
					Save
				</Button>
			</form>
		</Card>
	</main>
</template>
