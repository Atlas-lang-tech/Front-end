<script setup lang="ts">
import { useDictionaryEdit } from '@/api/vocabulary/dictionaries/edit/useDictionaryEdit'
import { useUserStore } from '@/stores/user.store'
import { IconPicker } from '@/components/IconPicker'
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
import { PencilIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	title: string
	icon: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// store
// ---------------------
const { user } = storeToRefs(useUserStore())

// ---------------------
// schema
// ---------------------
const schema = v.object({
	title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Title is required')),
	icon: v.pipe(v.string(), v.trim(), v.minLength(1, 'Icon is required')),
})

// ---------------------
// api
// ---------------------
const editDictionary = useDictionaryEdit()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		title: props.title,
		icon: props.icon,
	},
})

// ---------------------
// fields
// ---------------------
const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

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
			title: val.title,
			icon: val.icon,
		})
	},
	{ immediate: true, deep: true },
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	if (!user.value?.id) {
		toast.error('You must be logged in')
		return
	}

	try {
		await editDictionary.mutateAsync({
			id: props.id,
			userId: user.value.id,
			title: values.title,
			icon: values.icon,
		})

		toast.success('Dictionary updated successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while updating dictionary')
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
				<DialogTitle>Edit Dictionary</DialogTitle>
				<DialogDescription>
					Here you can edit the dictionary details.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Title</Label>
					<Input v-model="title" placeholder="Enter dictionary title.." />
					<p class="text-red-500 text-sm">{{ titleError }}</p>
				</div>

				<div class="mt-2">
					<Label>Icon</Label>
					<IconPicker v-model="icon" placeholder="Pick an icon" />
					<p class="text-red-500 text-sm">{{ iconError }}</p>
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
