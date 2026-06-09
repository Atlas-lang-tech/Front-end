<script setup lang="ts">
import { useLessonEdit } from '@/api/lessons/edit/useLessonEdit'
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
import type { Lesson } from '@/types/lesson'
import { toTypedSchema } from '@vee-validate/valibot'
import { PencilIcon } from 'lucide-vue-next'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{ lesson: Lesson }>()
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
const editLesson = useLessonEdit()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		cid: props.lesson.cid,
		title: props.lesson.title,
		description: props.lesson.description ?? '',
		icon: props.lesson.icon ?? '',
	},
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

watch(
	() => props.lesson,
	val => {
		setValues({
			cid: val.cid,
			title: val.title,
			description: val.description ?? '',
			icon: val.icon ?? '',
		})
	},
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editLesson.mutateAsync({
			id: props.lesson.id,
			courseId: props.lesson.courseId,
			cid: values.cid,
			title: values.title,
			description: values.description,
			icon: values.icon,
		})
		toast.success('Lesson updated')
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while updating lesson')
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
				<DialogTitle>Edit Lesson</DialogTitle>
				<DialogDescription> Update the lesson details. </DialogDescription>
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
						{{ isSubmitting ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
