<script setup lang="ts">
import { usePlans } from '@/api/billing/plans/get/all/usePlans'
import { useWordCreate } from '@/api/vocabulary/words/create/useWordCreate'
import { $PAGES } from '@/app/configs/pages.config'
import { useBillingStore } from '@/stores/billing.store'
import { getApiError } from '@/utils/apiError'
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	dictionaryId: number
	currentCount?: number
}>()

const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	word: v.pipe(v.string(), v.trim(), v.minLength(1, 'Word is required')),
	translation: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, 'Translation is required'),
	),
	transcription: v.optional(v.string()),
	example: v.optional(v.string()),
	description: v.optional(v.string()),
})

// ---------------------
// api
// ---------------------
const addWord = useWordCreate()

// ---------------------
// plan limit
// ---------------------
const billingStore = useBillingStore()
const { data: plansData } = usePlans()
const router = useRouter()

const maxWords = computed(() => {
	const plan = plansData.value?.data.find(
		p => p.code === billingStore.subscription?.planCode,
	)
	return plan?.maxWordsPerDict ?? 100
})

const atLimit = computed(() => (props.currentCount ?? 0) >= maxWords.value)

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		word: '',
		translation: '',
		transcription: '',
		example: '',
		description: '',
	},
})

// ---------------------
// fields
// ---------------------
const { value: word, errorMessage: wordError } = useField<string>('word')
const { value: translation, errorMessage: translationError } =
	useField<string>('translation')
const { value: transcription } = useField<string>('transcription')
const { value: example } = useField<string>('example')
const { value: description } = useField<string>('description')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await addWord.mutateAsync({
			dictionaryId: props.dictionaryId,
			word: values.word,
			translation: values.translation,
			transcription: values.transcription || undefined,
			example: values.example || undefined,
			description: values.description || undefined,
		})

		toast.success('Word added successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		const { status, message } = getApiError(e)
		if (status === 403) {
			toast.error(message ?? 'Word limit reached for your plan', {
				description: 'Upgrade your plan to add more words.',
				action: {
					label: 'Upgrade',
					onClick: () => router.push($PAGES.user.pricing),
				},
			})
		} else {
			toast.error('Error while adding word')
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
				:title="atLimit ? 'Upgrade your plan to add more words' : undefined"
			>
				<PlusIcon class="size-4" />
				New Word
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Word</DialogTitle>
				<DialogDescription>Add a new word to this dictionary.</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-4 max-h-[60vh] overflow-auto">
				<div>
					<Label>Word</Label>
					<Input v-model="word" placeholder="Enter word.." />
					<p class="text-red-500 text-sm">{{ wordError }}</p>
				</div>

				<div class="mt-2">
					<Label>Translation</Label>
					<Input v-model="translation" placeholder="Enter translation.." />
					<p class="text-red-500 text-sm">{{ translationError }}</p>
				</div>

				<div class="mt-2">
					<Label>Transcription</Label>
					<Input v-model="transcription" placeholder="Optional.." />
				</div>

				<div class="mt-2">
					<Label>Example</Label>
					<Input v-model="example" placeholder="Optional sentence.." />
				</div>

				<div class="mt-2">
					<Label>Description</Label>
					<Input v-model="description" placeholder="Optional note.." />
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
