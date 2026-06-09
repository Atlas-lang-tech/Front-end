<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'

import { watch } from 'vue'
import { toast } from 'vue-sonner'

import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseCreate } from '@/api/courses/create/useCourseCreate'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetByLanguageId } from '@/api/languages/level/get/AllByLanguageId/useLanguageLevelGetByLanguageId'

// ---------------------
// Validation schema (Valibot)
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
	languageLevelId: v.number('Language level is required'),

	categoryId: v.optional(v.number()),
})

// ---------------------
// API
// ---------------------
const addCourse = useCourseCreate()
const languages = useLanguageGetAll()
const categories = useCategoryGetAll()

// ---------------------
// Form
// ---------------------
const { handleSubmit, resetForm, setFieldValue, isSubmitting } =
	useForm({
		validationSchema: toTypedSchema(schema),
		initialValues: {
			title: '',
			cid: '',
			description: '',
			icon: '',
			languageId: undefined,
			languageLevelId: undefined,
			categoryId: undefined,
		},
	})

// ---------------------
// Fields
// ---------------------
const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: cid, errorMessage: cidError } = useField<string>('cid')
const { value: description, errorMessage: descriptionError } =
	useField<string>('description')
const { value: icon, errorMessage: iconError } = useField<string>('icon')

const { value: languageId, errorMessage: languageError } =
	useField<number>('languageId')
const { value: languageLevelId, errorMessage: levelError } =
	useField<number>('languageLevelId')
const { value: categoryId } = useField<number | undefined>('categoryId')

// ---------------------
// Dependent query (language levels)
// ---------------------
const languageLevels = useLanguageLevelGetByLanguageId(languageId)

watch(languageId, () => {
	if (languageId.value) {
		languageLevels.refetch()
		setFieldValue('languageLevelId', undefined)
	}
})

// ---------------------
// Submit
// ---------------------
const onSubmit = handleSubmit(async formValues => {
	try {
		await addCourse.mutateAsync({
			title: formValues.title,
			cid: formValues.cid,
			description: formValues.description,
			icon: formValues.icon,
			languageId: formValues.languageId,
			languageLvlId: formValues.languageLevelId,
			categoryId: formValues.categoryId,
		})

		toast.success('Course added successfully')
		resetForm()
	} catch (e) {
		toast.error('Error while adding course')
	}
})
</script>

<template>
	<main class="w-full h-full flex justify-center items-center">
		<Card class="p-5">
			<div class="text-2xl font-bold">Add new Course</div>

			<form @submit="onSubmit" class="w-full">
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
							<Label>Description</Label>
							<Input
								v-model="description"
								placeholder="Enter course description.."
							/>
							<p class="text-red-500 text-sm">{{ descriptionError }}</p>
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
								@update:model-value="
									val =>
										setFieldValue(
											'languageId',
											val === null ? undefined : Number(val),
										)
								"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select language" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="language in languages.data.value?.data"
										:key="language.id"
										:value="language.id"
									>
										{{ language.name }}
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
											'languageLevelId',
											val === null ? undefined : Number(val),
										)
								"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select language level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="level in languageLevels.data.value?.data"
										:key="level.id"
										:value="level.id"
									>
										{{ level.name }}
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
										v-for="category in categories.data.value?.data"
										:key="category.id"
										:value="category.id"
									>
										{{ category.name }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Button
					type="submit"
					class="w-full mt-5"
					size="sm"
					:disabled="isSubmitting"
				>
					Save
				</Button>
			</form>
		</Card>
	</main>
</template>
