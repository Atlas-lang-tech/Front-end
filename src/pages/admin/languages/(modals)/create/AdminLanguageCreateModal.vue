<script setup lang="ts">
import { useLanguageCreate } from '@/api/languages/create/useLanguageCreate'
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
	code: v.pipe(v.string(), v.trim(), v.minLength(1, 'Code is required')),
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
	},
})

// ---------------------
// fields
// ---------------------
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: code, errorMessage: codeError } = useField<string>('code')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await addLanguage.mutateAsync({
			name: values.name,
			code: values.code,
		})

		toast.success('Language added successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while adding language')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Language
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Language</DialogTitle>
				<DialogDescription> Add a new language. </DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
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

				<DialogFooter class="mt-4">
					<Button :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Create' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
