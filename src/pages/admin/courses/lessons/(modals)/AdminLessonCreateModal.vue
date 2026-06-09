<script setup lang="ts">
import { useLessonCreate } from '@/api/lessons/create/useLessonCreate'
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
// props / emits
// ---------------------
const props = defineProps<{ courseId: number }>()
const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	cid: v.pipe(v.string(), v.trim(), v.minLength(1, 'CID is required')),
	title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Title is required')),
	description: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, 'Description is required'),
	),
	icon: v.pipe(v.string(), v.trim(), v.minLength(1, 'Icon is required')),
})

// ---------------------
// api
// ---------------------
const createLesson = useLessonCreate()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: { cid: '', title: '', description: '', icon: '' },
})

// ---------------------
// fields
// ---------------------
const { value: cid, errorMessage: cidError } = useField<string>('cid')
const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: description, errorMessage: descriptionError } =
	useField<string>('description')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await createLesson.mutateAsync({
			courseId: props.courseId,
			cid: values.cid,
			title: values.title,
			description: values.description,
			icon: values.icon,
		})
		toast.success('Lesson created')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while creating lesson')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				Add Lesson
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Lesson</DialogTitle>
				<DialogDescription>
					Add a new lesson to this course.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="flex flex-col gap-4 py-2">
				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-2">
						<Label>Title</Label>
						<Input v-model="title" placeholder="Lesson title..." />
						<p class="text-red-500 text-sm">{{ titleError }}</p>
					</div>
					<div class="flex flex-col gap-2">
						<Label>CID (slug)</Label>
						<Input v-model="cid" placeholder="intro-greetings" />
						<p class="text-red-500 text-sm">{{ cidError }}</p>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<Label>Icon</Label>
					<Input v-model="icon" placeholder="hello.png" />
					<p class="text-red-500 text-sm">{{ iconError }}</p>
				</div>

				<div class="flex flex-col gap-2">
					<Label>Description</Label>
					<textarea
						v-model="description"
						rows="3"
						placeholder="Short description..."
						class="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
					/>
					<p class="text-red-500 text-sm">{{ descriptionError }}</p>
				</div>

				<DialogFooter>
					<Button type="submit" :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Create' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
