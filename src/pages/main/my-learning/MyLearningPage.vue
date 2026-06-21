<script setup lang="ts">
import { useProducts } from '@/api/billing/products/get/all/useProducts.ts'
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll.ts'
import { useCourseGetAll } from '@/api/courses/get/all/useCourseGetAll.ts'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll.ts'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll.ts'
import { $PAGES } from '@/app/configs/pages.config'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { useBillingStore } from '@/stores/billing.store'
import type { Course } from '@/types/course'
import { computed } from 'vue'
import CourseCard from '../catalog/widgets/CourseCard.vue'

// ---------------------
// data
// ---------------------
const { data: catalogLanguages } = useLanguageGetAll()
const { data: catalogLevels } = useLanguageLevelGetAll()
const { data: catalogCategories } = useCategoryGetAll()
const { data: catalogCourses, asyncStatus, state } = useCourseGetAll()
const { data: catalogProducts } = useProducts()

const billingStore = useBillingStore()

// ---------------------
// maps
// ---------------------

const languageMap = computed(
	() => new Map(catalogLanguages.value?.data.map(l => [l.id, l])),
)
const levelMap = computed(
	() => new Map(catalogLevels.value?.data.map(l => [l.id, l])),
)
const categoryMap = computed(
	() => new Map(catalogCategories.value?.data.map(c => [c.id, c])),
)
const productMap = computed(
	() => new Map(catalogProducts.value?.data.map(p => [p.courseId, p])),
)

// ---------------------
// list
// ---------------------

const courses = computed(() =>
	(catalogCourses.value?.data ?? [])
		.filter(c => billingStore.canAccessCourse(c as Course))
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
				product: productMap.value.get(Number(c.id)),
			}
		}),
)
</script>

<template>
	<div class="max-w-7xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold">My Learning</h1>
			<p class="text-muted-foreground mt-1">
				Courses you have access to. Pick one up where you left off.
			</p>
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
				:is-free="course.isFree"
				:product="course.product"
			/>
		</div>

		<!-- empty -->
		<div
			v-else
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No courses yet</p>
			<p class="text-muted text-sm mt-1">
				Browse the catalog to find courses to start learning.
			</p>
			<RouterLink :to="$PAGES.main.catalog" class="inline-block mt-4">
				<Button>Browse catalog</Button>
			</RouterLink>
		</div>
	</div>
</template>
