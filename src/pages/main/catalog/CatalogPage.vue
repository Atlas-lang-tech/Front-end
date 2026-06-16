<script setup lang="ts">
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll.ts'
import { useCourseGetAll } from '@/api/courses/get/all/useCourseGetAll.ts'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll.ts'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll.ts'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { Skeleton } from '@/shared/ui/skeleton'
import { computed, ref } from 'vue'
import CourseCard from './widgets/CourseCard.vue'

// ---------------------
// data
// ---------------------
const { data: catalogLanguages } = useLanguageGetAll()
const { data: catalogLevels } = useLanguageLevelGetAll()
const { data: catalogCategories } = useCategoryGetAll()
const { data: catalogCourses, asyncStatus, state } = useCourseGetAll()

// ---------------------
// filters
// ---------------------

const ALL = 'all'

const languageId = ref(ALL)
const levelId = ref(ALL)
const categoryId = ref(ALL)

const languageMap = computed(
	() => new Map(catalogLanguages.value?.data.map(l => [l.id, l])),
)
const levelMap = computed(
	() => new Map(catalogLevels.value?.data.map(l => [l.id, l])),
)
const categoryMap = computed(
	() => new Map(catalogCategories.value?.data.map(c => [c.id, c])),
)

const levelOptions = computed(() => {
	const levels = catalogLevels.value?.data ?? []
	if (languageId.value === ALL) return levels
	return levels.filter(l => l.languageId === Number(languageId.value))
})

const onLanguageChange = () => {
	levelId.value = ALL
}

const resetFilters = () => {
	languageId.value = ALL
	levelId.value = ALL
	categoryId.value = ALL
}

const hasActiveFilters = computed(
	() =>
		languageId.value !== ALL ||
		levelId.value !== ALL ||
		categoryId.value !== ALL,
)

// ---------------------
// list
// ---------------------

const courses = computed(() =>
	(catalogCourses.value?.data ?? [])
		.filter(
			c =>
				languageId.value === ALL || c.languageId === Number(languageId.value),
		)
		.filter(
			c => levelId.value === ALL || c.languageLvlId === Number(levelId.value),
		)
		.filter(
			c =>
				categoryId.value === ALL || c.categoryId === Number(categoryId.value),
		)
		.map(c => {
			const language = languageMap.value.get(c.languageId)
			const level = levelMap.value.get(c.languageLvlId)
			const category = c.categoryId
				? categoryMap.value.get(c.categoryId)
				: undefined

			return {
				...c,
				languageName: language?.name ?? '',
				levelName: level?.name ?? '',
				categoryName: category?.name,
			}
		}),
)
</script>

<template>
	<div class="max-w-7xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold">Course catalog</h1>
			<p class="text-muted-foreground mt-1">
				Pick a language, level and category to find your course.
			</p>
		</div>

		<!-- filters -->
		<div
			class="flex flex-col sm:flex-row sm:items-end gap-4 mb-8 pb-6 border-b border-border"
		>
			<div class="flex flex-col gap-1.5">
				<span class="text-xs font-medium text-muted">Language</span>
				<Select v-model="languageId" @update:model-value="onLanguageChange">
					<SelectTrigger class="w-full sm:w-48">
						<SelectValue placeholder="All languages" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem :value="ALL">All languages</SelectItem>
						<SelectItem
							v-for="language in catalogLanguages?.data"
							:key="language.id"
							:value="String(language.id)"
						>
							{{ language.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div class="flex flex-col gap-1.5">
				<span class="text-xs font-medium text-muted">Level</span>
				<Select v-model="levelId">
					<SelectTrigger class="w-full sm:w-48">
						<SelectValue placeholder="All levels" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem :value="ALL">All levels</SelectItem>
						<SelectItem
							v-for="level in levelOptions"
							:key="level.id"
							:value="String(level.id)"
						>
							{{ level.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div class="flex flex-col gap-1.5">
				<span class="text-xs font-medium text-muted">Category</span>
				<Select v-model="categoryId">
					<SelectTrigger class="w-full sm:w-48">
						<SelectValue placeholder="All categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem :value="ALL">All categories</SelectItem>
						<SelectItem
							v-for="category in catalogCategories?.data"
							:key="category.id"
							:value="String(category.id)"
						>
							{{ category.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<button
				v-if="hasActiveFilters"
				class="text-sm text-primary hover:underline sm:ml-auto sm:mb-2.5"
				@click="resetFilters"
			>
				Reset filters
			</button>
		</div>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-56 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading courses
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- results -->
		<div
			v-else-if="courses.length"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<CourseCard
				v-for="course in courses"
				:key="course.id"
				:id="course.id"
				:title="course.title"
				:description="course.description"
				:icon="course.icon"
				:language-name="course.languageName"
				:level-name="course.levelName"
				:category-name="course.categoryName"
			/>
		</div>

		<!-- empty -->
		<div
			v-else
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No courses found</p>
			<p class="text-muted text-sm mt-1">
				Try changing or resetting the filters.
			</p>
		</div>
	</div>
</template>
