<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

import { useLanguageLevelEdit } from '@/api/languages/level/edit/uselanguageLevelEdit'

import { Button } from '@/shared/ui/button'

import { Input } from '@/shared/ui/input'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	name: string
}>()

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
const editLanguageLevel = useLanguageLevelEdit()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: props.name,
	},
})

// ---------------------
// field
// ---------------------
const { value: name, errorMessage } = useField<string>('name')

// ---------------------
// dialog state
// ---------------------
const isOpen = defineModel<boolean>('open')

// ---------------------
// sync props → form
// ---------------------
watch(
	() => props.name,
	val => {
		setValues({ name: val })
	},
	{ immediate: true },
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editLanguageLevel.mutateAsync({
			id: props.id,
			name: values.name,
		})

		toast.success('Language level edited successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while editing language level')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button size="sm" class="p-3 rounded-xl">
				<PencilIcon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>Edit language level</DialogTitle>
				<DialogDescription>
					Here you can edit the language level details.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Name</Label>
					<Input v-model="name" placeholder="Enter language level name.." />
					<p class="text-red-500 text-sm">{{ errorMessage }}</p>
				</div>

				<DialogFooter class="mt-4">
					<Button :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
