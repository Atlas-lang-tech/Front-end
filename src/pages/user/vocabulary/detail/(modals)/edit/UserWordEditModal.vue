<script setup lang="ts">
import { useWordEdit } from '@/api/vocabulary/words/edit/useWordEdit'
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
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	word: string
	translation: string
	transcription: string | null
	example: string | null
	description: string | null
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
const editWord = useWordEdit()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		word: props.word,
		translation: props.translation,
		transcription: props.transcription ?? '',
		example: props.example ?? '',
		description: props.description ?? '',
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
			word: val.word,
			translation: val.translation,
			transcription: val.transcription ?? '',
			example: val.example ?? '',
			description: val.description ?? '',
		})
	},
	{ immediate: true, deep: true },
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editWord.mutateAsync({
			id: props.id,
			word: values.word,
			translation: values.translation,
			transcription: values.transcription || undefined,
			example: values.example || undefined,
			description: values.description || undefined,
		})

		toast.success('Word updated successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while updating word')
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
				<DialogTitle>Edit Word</DialogTitle>
				<DialogDescription>Here you can edit the word details.</DialogDescription>
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
						{{ isSubmitting ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
