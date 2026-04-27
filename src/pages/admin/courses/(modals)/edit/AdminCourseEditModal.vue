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
	title: v.pipe(v.string(), v.trim(), v.minLength(1)),
	cid: v.pipe(v.string(), v.trim(), v.minLength(1)),
	description: v.pipe(v.string(), v.trim(), v.minLength(1)),
	icon: v.pipe(v.string(), v.trim(), v.minLength(1)),

	languageId: v.number(),
	languageLvlId: v.number(),
	categoryId: v.optional(v.number()),
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
const { handleSubmit, setValues, isSubmitting } = useForm({
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
const { value: title } = useField<string>('title')
const { value: cid } = useField<string>('cid')
const { value: description } = useField<string>('description')
const { value: icon } = useField<string>('icon')

const { value: languageId } = useField<number>('languageId')
const { value: languageLvlId } = useField<number>('languageLvlId')
const { value: categoryId } = useField<number | undefined>('categoryId')

// ---------------------
// dialog state
// ---------------------
const isOpen = defineModel<boolean>('open')

// ---------------------
// dependent query
// ---------------------
const languageLevels = useLanguageLevelGetByLanguageId(languageId)

// reset levels when language changes
watch(languageId, () => {
	setValues({ languageLvlId: undefined as any })
	languageLevels.refetch()
})

// ---------------------
// sync props → form (edit safety)
// ---------------------
watch(
	() => props.data,
	val => {
		setValues({
			title: val.title,
			cid: val.cid,
			description: val.description,
			icon: val.icon,
			languageId: val.languageId,
			languageLvlId: val.languageLvlId,
			categoryId: val.categoryId,
		})
	},
)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await editCourse.mutateAsync({
			id: Number(props.data.id),
			...values,
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

			<form @submit="onSubmit" class="p-4">
				<div class="grid grid-cols-2 gap-5">
					<!-- LEFT -->
					<div>
						<Input v-model="title" placeholder="Title" />
						<Input v-model="cid" class="mt-2" placeholder="CID" />
						<Input
							v-model="description"
							class="mt-2"
							placeholder="Description"
						/>
						<Input v-model="icon" class="mt-2" placeholder="Icon" />
					</div>

					<!-- RIGHT -->
					<div class="flex flex-col gap-2">
						<Select v-model="languageId">
							<SelectTrigger>
								<SelectValue placeholder="Language" />
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

						<Select v-model="languageLvlId" class="mt-2">
							<SelectTrigger>
								<SelectValue placeholder="Level" />
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

						<Select v-model="categoryId" class="mt-2">
							<SelectTrigger>
								<SelectValue placeholder="Category" />
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

				<DialogFooter class="mt-4">
					<Button type="submit" :disabled="isSubmitting"> Save Changes </Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
