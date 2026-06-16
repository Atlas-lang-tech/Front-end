<script setup lang="ts">
import { useDictionaryCreate } from '@/api/vocabulary/dictionaries/create/useDictionaryCreate'
import { useUserStore } from '@/stores/user.store'
import Icon from '@/shared/icon.vue'
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
import { storeToRefs } from 'pinia'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { DICTIONARY_ICONS } from '../../dictionary-icons'

// ---------------------
// emits
// ---------------------
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
const addDictionary = useDictionaryCreate()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		title: '',
		icon: 'book',
	},
})

// ---------------------
// fields
// ---------------------
const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	if (!user.value?.id) {
		toast.error('You must be logged in')
		return
	}

	try {
		await addDictionary.mutateAsync({
			userId: user.value.id,
			title: values.title,
			icon: values.icon,
		})

		toast.success('Dictionary created successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while creating dictionary')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Dictionary
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Dictionary</DialogTitle>
				<DialogDescription>Create a new vocabulary dictionary.</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4">
				<div>
					<Label>Title</Label>
					<Input v-model="title" placeholder="Enter dictionary title.." />
					<p class="text-red-500 text-sm">{{ titleError }}</p>
				</div>

				<div class="mt-2">
					<Label>Icon</Label>
					<Select v-model="icon">
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Choose an icon" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="name in DICTIONARY_ICONS"
								:key="name"
								:value="name"
							>
								<span class="flex items-center gap-2">
									<Icon :name="name" :size="18" />
									{{ name }}
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
					<p class="text-red-500 text-sm">{{ iconError }}</p>
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
