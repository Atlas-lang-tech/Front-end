<script setup lang="ts">
import { useDictionaryCreate } from '@/api/vocabulary/dictionaries/create/useDictionaryCreate'
import { $PAGES } from '@/app/configs/pages.config'
import { usePlanLimits } from '@/composables/usePlanLimits'
import { useUserStore } from '@/stores/user.store'
import { getApiError } from '@/utils/apiError'
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
import { PlusIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	currentCount?: number
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
const addDictionary = useDictionaryCreate()

// ---------------------
// plan limit
// ---------------------
const { maxDictionaries } = usePlanLimits()

const atLimit = computed(() => (props.currentCount ?? 0) >= maxDictionaries.value)

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

const router = useRouter()
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
		const { status, message } = getApiError(e)
		if (status === 403) {
			toast.error(message ?? 'Dictionary limit reached for your plan', {
				description: 'Upgrade your plan to create more dictionaries.',
				action: {
					label: 'Upgrade',
					onClick: () => router.push($PAGES.user.pricing),
				},
			})
		} else {
			toast.error('Error while creating dictionary')
		}
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				class="gap-1.5"
				:disabled="atLimit"
				:title="atLimit ? 'Upgrade your plan to add more dictionaries' : undefined"
			>
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
					<IconPicker v-model="icon" placeholder="Pick an icon" />
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
