<script setup lang="ts">
import { useProduct } from '@/api/billing/products/get/byCourseId/useProduct.ts'
import { useCourseGetById } from '@/api/courses/get/byId/useCourseGetById.ts'
import { useLessonGetByCourse } from '@/api/lessons/get/byCourseId/useLessonGetByCourse.ts'
import { $PAGES } from '@/app/configs/pages.config'
import CourseIcon from '@/components/course/CourseIcon.vue'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { useBillingStore } from '@/stores/billing.store'
import type { Course } from '@/types/course'
import { formatPriceCents } from '@/utils/price'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CoursePurchaseModal from '../(modals)/purchase/CoursePurchaseModal.vue'
import { isLessonLocked } from './lesson-locking.ts'
import LessonCard from './widgets/LessonCard.vue'

// ---------------------
// route
// ---------------------

const route = useRoute()
const courseId = computed(() => Number(route.params.courseId))

// ---------------------
// api
// ---------------------

const { data: courseData } = useCourseGetById({
	id: String(route.params.courseId),
})
const { state, asyncStatus } = useLessonGetByCourse(courseId)
const { data: productData } = useProduct(courseId)

// ---------------------
// lessons
// ---------------------

const course = computed(() => courseData.value?.data)
const lessons = computed(() =>
	[...(state.value.data?.data ?? [])].sort((a, b) => a.order - b.order),
)

// ---------------------
// access
// ---------------------

const billingStore = useBillingStore()
const product = computed(() => productData.value?.data)

const hasAccess = computed(() =>
	course.value ? billingStore.canAccessCourse(course.value as Course) : false,
)

const priceLabel = computed(() =>
	course.value?.isFree
		? 'Free'
		: formatPriceCents(product.value?.priceCents, product.value?.currency),
)

const purchaseOpen = ref(false)
</script>

<template>
	<div class="max-w-6xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<RouterLink
			:to="$PAGES.main.catalog"
			class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
		>
			<Icon name="arrow-left" :size="16" />
			Back to catalog
		</RouterLink>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- lessons -->
			<div class="order-2 lg:order-1 lg:col-span-2">
				<h2 class="text-lg font-bold mb-4">Lessons</h2>

				<!-- loading -->
				<div v-if="asyncStatus === 'loading'" class="flex flex-col gap-3">
					<Skeleton v-for="i in 5" :key="i" class="h-20 w-full rounded-xl" />
				</div>

				<!-- error -->
				<div
					v-else-if="state.status === 'error'"
					class="bg-card border border-destructive p-12 text-center rounded-xl"
				>
					<p class="text-destructive font-semibold text-lg">
						Error loading lessons
					</p>
					<p class="text-muted text-sm mt-1">
						Please try refreshing the page.
					</p>
				</div>

				<!-- success -->
				<div v-else-if="lessons.length" class="flex flex-col gap-3">
					<LessonCard
						v-for="(lesson, index) in lessons"
						:key="lesson.id"
						:lesson="lesson"
						:index="index"
						:locked="isLessonLocked(lesson, lessons)"
					/>
				</div>

				<!-- empty -->
				<div
					v-else
					class="bg-card border border-border p-12 text-center rounded-xl"
				>
					<p class="text-foreground font-semibold text-lg">
						No lessons in this course yet
					</p>
					<p class="text-muted text-sm mt-1">Check back later.</p>
				</div>
			</div>

			<!-- course description -->
			<aside class="order-1 lg:order-2">
				<Card class="p-6 lg:sticky lg:top-8">
					<template v-if="course">
						<div
							class="flex items-center justify-center size-16 rounded-2xl bg-card-secondary text-primary mb-4"
						>
							<CourseIcon :name="course.icon" :size="32" />
						</div>
						<h1 class="text-2xl font-bold">{{ course.title }}</h1>
						<p
							v-if="lessons.length"
							class="text-sm text-muted mt-1 flex items-center gap-1.5"
						>
							<Icon name="book-open" :size="14" />
							{{ lessons.length }}
							{{ lessons.length === 1 ? 'lesson' : 'lessons' }}
						</p>
						<p
							class="text-sm text-muted-foreground mt-4 leading-relaxed whitespace-pre-line"
						>
							{{ course.description }}
						</p>

						<div class="mt-6 pt-6 border-t border-border">
							<template v-if="hasAccess">
								<Badge variant="success" class="mb-3">
									{{ course.isFree ? 'Free access' : 'You own this course' }}
								</Badge>
								<p class="text-sm text-muted-foreground">
									Open any lesson on the left to start learning.
								</p>
							</template>

							<template v-else>
								<div class="flex items-center justify-between mb-3">
									<span class="text-sm text-muted-foreground">Price</span>
									<span class="text-xl font-bold text-primary">
										{{ priceLabel }}
									</span>
								</div>
								<Button class="w-full" @click="purchaseOpen = true">
									Buy this course
								</Button>
							</template>
						</div>
					</template>

					<template v-else>
						<Skeleton class="size-16 rounded-2xl mb-4" />
						<Skeleton class="h-7 w-3/4 rounded-lg" />
						<Skeleton class="h-4 w-1/3 rounded-lg mt-2" />
						<Skeleton class="h-20 w-full rounded-lg mt-4" />
					</template>
				</Card>
			</aside>
		</div>

		<CoursePurchaseModal
			v-if="course"
			v-model:open="purchaseOpen"
			:course-id="courseId"
			:title="course.title"
			:product="product"
		/>
	</div>
</template>
