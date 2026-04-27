<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

import { useLanguageEdit } from '@/api/languages/edit/useLanguageEdit'
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
import { PencilIcon } from 'lucide-vue-next'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	name: string
	code: string
	icon: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
	code: v.pipe(v.string(), v.trim(), v.minLength(1, 'Code is required')),
	icon: v.pipe(v.string(), v.trim(), v.minLength(1, 'Icon is required')),
})

// ---------------------
// api
// ---------------------
const editLanguage = useLanguageEdit()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		name: props.name,
		code: props.code,
		icon: props.icon,
	},
})

// ---------------------
// fields
// ---------------------
const { value: name } = useField<string>('name')
const { value: code } = useField<string>('code')
const { value: icon } = useField<string>('icon')

// ---------------------
// dialog state
// ---------------------
const isOpen = defineModel<boolean>('open')

// ---------------------
// sync props → form
// ---------------------
watch(
	() => props,
	val => {
		setValues({
			name: val.name,
			code: val.code,
			icon: val.icon,
		})
	},
	{ immediate: true },
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editLanguage.mutateAsync({
			id: props.id,
			...values,
		})

		toast.success('Language edited successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while editing language')
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
				<DialogTitle>Edit language</DialogTitle>
				<DialogDescription>
					Here you can edit the language details.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Name</Label>
					<Input v-model="name" placeholder="Enter language name.." />
				</div>

				<div class="mt-2">
					<Label>Code</Label>
					<Input v-model="code" placeholder="Enter language code.." />
				</div>

				<div class="mt-2">
					<Label>Icon</Label>
					<Input v-model="icon" placeholder="Enter language icon.." />
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
