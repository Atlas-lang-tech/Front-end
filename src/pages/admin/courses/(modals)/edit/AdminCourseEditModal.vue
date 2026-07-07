<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { useSetProductPrice } from '@/api/billing/admin/setProductPrice/useSetProductPrice'
import { useProduct } from '@/api/billing/products/get/byCourseId/useProduct'
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseEdit } from '@/api/courses/edit/useCourseEdit'
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
	nativeLanguageId: v.nullish(v.number()),
	languageLvlId: v.number('Language level is required'),
	categoryId: v.nullish(v.number()),
})

// ---------------------
// api
// ---------------------
const editCourse = useCourseEdit()
const setProductPrice = useSetProductPrice()
const languages = useLanguageGetAll()
const categories = useCategoryGetAll()

// ---------------------
// pricing
// ---------------------
const courseId = computed(() => Number(props.data.id))
const { data: productData, refetch: refetchProduct } = useProduct(courseId)

const isFree = ref(props.data.isFree)
const price = ref<number | undefined>(undefined)
const isVisible = ref(props.data.isVisible)

watch(
	() => productData.value?.data,
	product => {
		if (product?.priceCents != null) {
			price.value = product.priceCents / 100
		}
	},
)

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
		nativeLanguageId: props.data.nativeLanguageId,
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
const { value: nativeLanguageId } =
	useField<number | null | undefined>('nativeLanguageId')
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
			nativeLanguageId: props.data.nativeLanguageId,
			languageLvlId: props.data.languageLvlId,
			categoryId: props.data.categoryId,
		})
		isFree.value = props.data.isFree
		isVisible.value = props.data.isVisible
		languageLevels.refetch()
		refetchProduct()
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
	try {
		await editCourse.mutateAsync({
			id: Number(props.data.id),
			title: values.title,
			cid: values.cid,
			description: values.description,
			icon: values.icon,
			isFree: isFree.value,
			isVisible: isVisible.value,
			languageId: values.languageId,
			nativeLanguageId: values.nativeLanguageId ?? undefined,
			languageLvlId: values.languageLvlId,
			categoryId: values.categoryId ?? undefined,
		})

		if (!isFree.value && price.value !== undefined) {
			await setProductPrice.mutateAsync({
				courseId: Number(props.data.id),
				priceCents: Math.round(price.value * 100),
				currency: 'USD',
				isActive: true,
			})
		}

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
										v-for="l in languages.data.value?.data"
										:key="l.id"
										:value="l.id"
									>
										{{ l.name }}
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
						{{ isSubmitting ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
