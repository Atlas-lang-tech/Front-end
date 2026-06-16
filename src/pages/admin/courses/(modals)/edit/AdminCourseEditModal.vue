<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseEdit } from '@/api/courses/edit/useCourseEdit'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetByLanguageId } from '@/api/languages/level/get/AllByLanguageId/useLanguageLevelGetByLanguageId'

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
import type { Course } from '@/types/course'
import { PencilIcon } from 'lucide-vue-next'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{ data: Course }>()
const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Title is required')),
	cid: v.pipe(v.string(), v.trim(), v.minLength(1, 'CID is required')),
	description: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, 'Description is required'),
	),
	icon: v.pipe(v.string(), v.trim(), v.minLength(1, 'Icon is required')),

	languageId: v.number('Language is required'),
	languageLvlId: v.number('Language level is required'),
	categoryId: v.nullish(v.number()),
})

// ---------------------
// api
// ---------------------
const editCourse = useCourseEdit()
const languages = useLanguageGetAll()
const categories = useCategoryGetAll()

// ---------------------
// form
// ---------------------
const { handleSubmit, setValues, setFieldValue, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		title: props.data.title,
		cid: props.data.cid,
		description: props.data.description,
		icon: props.data.icon,
		languageId: props.data.languageId,
		languageLvlId: props.data.languageLvlId,
		categoryId: props.data.categoryId,
	},
})

// ---------------------
// fields
// ---------------------
const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: cid, errorMessage: cidError } = useField<string>('cid')
const { value: description, errorMessage: descriptionError } =
	useField<string>('description')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

const { value: languageId, errorMessage: languageError } =
	useField<number>('languageId')
const { value: languageLevelId, errorMessage: levelError } =
	useField<number>('languageLvlId')
const { value: categoryId } = useField<number | null | undefined>('categoryId')

// ---------------------
// dialog state
// ---------------------
const isOpen = defineModel<boolean>('open')

// ---------------------
// dependent query (language levels)
// ---------------------
const languageLevels = useLanguageLevelGetByLanguageId(languageId)

// ---------------------
// sync props → form on open
// ---------------------
watch(isOpen, open => {
	if (open) {
		setValues({
			title: props.data.title,
			cid: props.data.cid,
			description: props.data.description,
			icon: props.data.icon,
			languageId: props.data.languageId,
			languageLvlId: props.data.languageLvlId,
			categoryId: props.data.categoryId,
		})
		languageLevels.refetch()
	}
})

// ---------------------
// handlers
// ---------------------
const onLanguageChange = (val: unknown) => {
	const id = val === null ? undefined : Number(val)
	setFieldValue('languageId', id as number)
	setFieldValue('languageLvlId', undefined as unknown as number)
	if (id) languageLevels.refetch()
}

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	console.log('Course edited successfully')
	try {
		await editCourse.mutateAsync({
			id: Number(props.data.id),
			title: values.title,
			cid: values.cid,
			description: values.description,
			icon: values.icon,
			languageId: values.languageId,
			languageLvlId: values.languageLvlId,
			categoryId: values.categoryId ?? undefined,
		})

		toast.success('Course edited successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while editing course')
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
				<DialogTitle>Edit Course</DialogTitle>
				<DialogDescription>
					Here you can edit the course details.
				</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-2">
				<div class="grid grid-cols-2 gap-5">
					<!-- LEFT COLUMN -->
					<div>
						<div>
							<Label>Title</Label>
							<Input v-model="title" placeholder="Enter course title.." />
							<p class="text-red-500 text-sm">{{ titleError }}</p>
						</div>

						<div class="mt-2">
							<Label>CID</Label>
							<Input v-model="cid" placeholder="Enter course CID.." />
							<p class="text-red-500 text-sm">{{ cidError }}</p>
						</div>

						<div class="mt-2">
							<Label>Icon</Label>
							<Input v-model="icon" placeholder="Enter course icon.." />
							<p class="text-red-500 text-sm">{{ iconError }}</p>
						</div>
					</div>

					<!-- RIGHT COLUMN -->
					<div>
						<div>
							<Label>Language</Label>
							<Select
								:model-value="languageId"
								@update:model-value="onLanguageChange"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select language" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="l in languages.data.value?.data"
										:key="l.id"
										:value="l.id"
									>
										{{ l.name }}
									</SelectItem>
								</SelectContent>
							</Select>
							<p class="text-red-500 text-sm">{{ languageError }}</p>
						</div>

						<div class="mt-2">
							<Label>Language Level</Label>
							<Select
								:model-value="languageLevelId"
								:disabled="!languageId"
								@update:model-value="
									val =>
										setFieldValue(
											'languageLvlId',
											val === null ? undefined : Number(val),
										)
								"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select language level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="l in languageLevels.data.value?.data"
										:key="l.id"
										:value="l.id"
									>
										{{ l.name }}
									</SelectItem>
								</SelectContent>
							</Select>
							<p class="text-red-500 text-sm">{{ levelError }}</p>
						</div>

						<div class="mt-2">
							<Label>Category</Label>
							<Select
								:model-value="categoryId"
								@update:model-value="
									val =>
										setFieldValue(
											'categoryId',
											val === null ? undefined : Number(val),
										)
								"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="c in categories.data.value?.data"
										:key="c.id"
										:value="c.id"
									>
										{{ c.name }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div class="mt-2">
					<Label>Description</Label>
					<textarea
						v-model="description"
						rows="4"
						placeholder="Enter course description.."
						class="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
					/>
					<p class="text-red-500 text-sm">{{ descriptionError }}</p>
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
