<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'

import { useCategoryEdit } from '@/api/categories/edit/useCategoryEdit'
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
import { PencilIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// Props / emits
// ---------------------
const props = defineProps<{
	id: number
	name: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// Dialog state
// ---------------------
const isOpen = ref(false)

// ---------------------
// Validation schema
// ---------------------
const schema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
})

// ---------------------
// Form setup
// ---------------------
const editCategory = useCategoryEdit()

const { handleSubmit, resetForm, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: props.name,
	},
})

// Field binding
const { value: name, errorMessage } = useField<string>('name')

// ---------------------
// Sync props -> form (important for edit case)
// ---------------------
watch(
	() => props.name,
	val => {
		setValues({ name: val })
	},
)

// Also reset when dialog opens
watch(isOpen, open => {
	if (open) {
		setValues({ name: props.name })
	}
})

// ---------------------
// Submit handler
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editCategory.mutateAsync({
			id: props.id,
			name: values.name,
		})

		toast.success('Category edited successfully')

		isOpen.value = false
		emit('success')
		resetForm()
	} catch (e) {
		toast.error('Error while editing category')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				size="sm"
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-secondary/40 text-secondary bg-secondary/5 hover:bg-secondary/10 transition-all duration-150 cursor-pointer"
			>
				<PencilIcon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle class="text-h font-bold tracking-tight text-xl">
					Edit Category
				</DialogTitle>
				<DialogDescription>
					Here you can edit the category details.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit">
				<div class="py-4">
					<div>
						<Label for="name" class="mb-5 font-semibold">Name</Label>

						<Input
							id="name"
							name="name"
							v-model="name"
							placeholder="Enter category name.."
						/>

						<!-- Validation error -->
						<p class="text-red-500 text-sm mt-1">
							{{ errorMessage }}
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
