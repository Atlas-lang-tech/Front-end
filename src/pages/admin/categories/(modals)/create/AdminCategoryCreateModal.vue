<script setup lang="ts">
import { useCategoryCreate } from '@/api/categories/create/useCategryCreate'
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
})

// ---------------------
// api
// ---------------------
const addCategory = useCategoryCreate()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: '',
	},
})

// ---------------------
// field
// ---------------------
const { value: name, errorMessage } = useField<string>('name')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await addCategory.mutateAsync({
			name: values.name,
		})

		toast.success('Category added successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while adding category')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Category
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Category</DialogTitle>
				<DialogDescription> Add a new category. </DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Name</Label>
					<Input v-model="name" placeholder="Enter category name.." />
					<p class="text-red-500 text-sm">{{ errorMessage }}</p>
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
