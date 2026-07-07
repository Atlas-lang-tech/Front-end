<script setup lang="ts">
import { useSetProductPrice } from '@/api/billing/admin/setProductPrice/useSetProductPrice'
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseCreate } from '@/api/courses/create/useCourseCreate'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetByLanguageId } from '@/api/languages/level/get/AllByLanguageId/useLanguageLevelGetByLanguageId'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { toTypedSchema } from '@vee-validate/valibot'
import { PlusIcon } from 'lucide-vue-next'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// emits
// ---------------------
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
	nativeLanguageId: v.optional(v.number()),
	languageLevelId: v.number('Language level is required'),

	categoryId: v.optional(v.number()),
})

// ---------------------
// api
// ---------------------
const addCourse = useCourseCreate()
const setProductPrice = useSetProductPrice()
const languages = useLanguageGetAll()
const categories = useCategoryGetAll()

// ---------------------
// pricing
// ---------------------
const isFree = ref(true)
const price = ref<number | undefined>(undefined)
const isVisible = ref(true)

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, setFieldValue, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		title: '',
		cid: '',
		description: '',
		icon: '',
		languageId: undefined,
		nativeLanguageId: undefined,
		languageLevelId: undefined,
		categoryId: undefined,
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
const { value: nativeLanguageId } =
	useField<number | undefined>('nativeLanguageId')
const { value: languageLevelId, errorMessage: levelError } =
	useField<number>('languageLevelId')
const { value: categoryId } = useField<number | undefined>('categoryId')

const isOpen = ref(false)

// ---------------------
// dependent query (language levels)
// ---------------------
const languageLevels = useLanguageLevelGetByLanguageId(languageId)

watch(languageId, () => {
	if (languageId.value) {
		languageLevels.refetch()
		setFieldValue('languageLevelId', undefined)
	}
})

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async formValues => {
	try {
		const res = await addCourse.mutateAsync({
			title: formValues.title,
			cid: formValues.cid,
			description: formValues.description,
			icon: formValues.icon,
			isFree: isFree.value,
			isVisible: isVisible.value,
			languageId: formValues.languageId,
			nativeLanguageId: formValues.nativeLanguageId,
			languageLvlId: formValues.languageLevelId,
			categoryId: formValues.categoryId,
		})

		if (!isFree.value && price.value !== undefined) {
			const newCourseId = Number((res as any)?.data?.data?.id)
			if (newCourseId) {
				await setProductPrice.mutateAsync({
					courseId: newCourseId,
					priceCents: Math.round(price.value * 100),
					currency: 'USD',
					isActive: true,
				})
			}
		}

		toast.success('Course added successfully')
		resetForm()
		isFree.value = true
		price.value = undefined
		isVisible.value = true
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while adding course')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Course
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Course</DialogTitle>
				<DialogDescription> Add a new course. </DialogDescription>
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
							<IconPicker v-model="icon" placeholder="Pick an icon" />
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
							<Label>Original Language</Label>
							<Select
								:model-value="nativeLanguageId"
								@update:model-value="
									val =>
										setFieldValue(
											'nativeLanguageId',
											val === null ? undefined : Number(val),
										)
								"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select original language" />
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

				<div class="grid grid-cols-2 gap-5 mt-2">
					<div>
						<Label>Access</Label>
						<Select
							:model-value="isFree ? 'free' : 'paid'"
							@update:model-value="val => (isFree = val === 'free')"
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="free">Free</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div v-if="!isFree">
						<Label>Price (USD)</Label>
						<Input
							v-model.number="price"
							type="number"
							min="0"
							step="0.01"
							placeholder="9.99"
						/>
					</div>
				</div>

				<div class="mt-2">
					<Label>Visibility</Label>
					<Select
						:model-value="isVisible ? 'visible' : 'hidden'"
						@update:model-value="val => (isVisible = val === 'visible')"
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="visible">Visible</SelectItem>
							<SelectItem value="hidden">Hidden</SelectItem>
						</SelectContent>
					</Select>
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
