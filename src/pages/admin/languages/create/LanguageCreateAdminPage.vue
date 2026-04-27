<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'

import { useLanguageCreate } from '@/api/languages/create/useLanguageCreate'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { toast } from 'vue-sonner'

// ---------------------
// validation schema
// ---------------------
const schema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
	code: v.pipe(v.string(), v.trim(), v.minLength(1, 'Code is required')),
	icon: v.optional(v.string()),
})

// ---------------------
// api
// ---------------------
const addLanguage = useLanguageCreate()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: '',
		code: '',
		icon: '',
	},
})

// ---------------------
// fields
// ---------------------
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: code, errorMessage: codeError } = useField<string>('code')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await addLanguage.mutateAsync({
			name: values.name,
			code: values.code,
			icon: values.icon || '',
		})

		toast.success('Language added successfully')
		resetForm()
	} catch (e) {
		toast.error('Error while adding language')
	}
})
</script>

<template>
	<main class="w-full h-full flex justify-center items-center">
		<Card class="p-5">
			<div class="text-2xl font-bold">Add new language</div>

			<form @submit="onSubmit" class="w-full">
				<div>
					<Label>Name</Label>
					<Input v-model="name" placeholder="Enter language name.." />
					<p class="text-red-500 text-sm">{{ nameError }}</p>
				</div>

				<div class="mt-2">
					<Label>Code</Label>
					<Input v-model="code" placeholder="Enter language code.." />
					<p class="text-red-500 text-sm">{{ codeError }}</p>
				</div>

				<div class="mt-2">
					<Label>Icon</Label>
					<Input v-model="icon" placeholder="Enter language icon.." />
					<p class="text-red-500 text-sm">{{ iconError }}</p>
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
