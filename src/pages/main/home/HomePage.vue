<script setup lang="ts">
// ---------------------
// data
// ---------------------

import { useCourseGetAll } from '@/api/courses/get/all/useCourseGetAll.ts'
import { useMyProgress } from '@/api/courses/get/myProgress/useMyProgress.ts'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll.ts'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll.ts'
import { $PAGES } from '@/app/configs/pages.config'
import {
	dashboardStats,
	newsFeed,
	todaySchedule,
} from '@/app/data/main/DashboardData'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { useBillingStore } from '@/stores/billing.store'
import { useUserStore } from '@/stores/user.store'
import type { Course } from '@/types/course'
import { computed } from 'vue'
import GreetingHero from './widgets/GreetingHero.vue'
import NewsItem from './widgets/NewsItem.vue'
import StatCard from './widgets/StatCard.vue'

// ---------------------
// greeting
// ---------------------

const userStore = useUserStore()

const name = computed(() => userStore.user?.username ?? 'there')

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return 'Good morning'
	if (hour < 18) return 'Good afternoon'
	return 'Good evening'
})

const wish = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return 'A fresh day, a fresh chance to learn something new.'
	if (hour < 18) return 'Keep the momentum going — one more lesson today?'
	return 'Wind down with a quick lesson before the day ends.'
})

const today = computed(() =>
	new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date()),
)

// ---------------------
// api
// ---------------------

const { data: catalogCourses } = useCourseGetAll()
const { data: catalogLanguages } = useLanguageGetAll()
const { data: catalogLevels } = useLanguageLevelGetAll()

const billingStore = useBillingStore()

// ---------------------
// maps
// ---------------------

const languageMap = computed(
	() => new Map((catalogLanguages.value?.data ?? []).map(l => [l.id, l])),
)
const levelMap = computed(
	() => new Map((catalogLevels.value?.data ?? []).map(l => [l.id, l])),
)

// ---------------------
// accessible courses + progress
// ---------------------

const accessibleCourses = computed(() =>
	(catalogCourses.value?.data ?? []).filter(c =>
		billingStore.canAccessCourse(c as Course),
	),
)
const accessibleCourseIds = computed(() =>
	accessibleCourses.value.map(c => Number(c.id)),
)

const { data: progressData, asyncStatus: progressStatus } =
	useMyProgress(accessibleCourseIds)

const progressByCourse = computed(
	() => new Map((progressData.value ?? []).map(p => [p.courseId, p])),
)

const isLoading = computed(
	() => !catalogCourses.value || progressStatus.value === 'loading',
)

// ---------------------
// derived stats
// ---------------------

const inProgressCount = computed(
	() =>
		(progressData.value ?? []).filter(
			p => p.completed > 0 && p.completed < p.total,
		).length,
)
const completedCount = computed(
	() =>
		(progressData.value ?? []).filter(
			p => p.total > 0 && p.completed === p.total,
		).length,
)

const stats = computed(() => [
	dashboardStats[0],
	{
		id: 2,
		title: 'In progress',
		value: String(inProgressCount.value),
		icon: 'book-open',
		color: 'orange' as const,
	},
	{
		id: 3,
		title: 'Completed',
		value: String(completedCount.value),
		icon: 'circle-check',
		color: 'green' as const,
	},
	dashboardStats[3],
])

// ---------------------
// continue learning
// ---------------------

const continueCourse = computed(() => {
	const candidates = accessibleCourses.value.map(course => ({
		course,
		progress: progressByCourse.value.get(Number(course.id)),
	}))

	const picked =
		candidates.find(
			c =>
				c.progress &&
				c.progress.completed > 0 &&
				c.progress.completed < c.progress.total,
		) ??
		candidates.find(
			c => !c.progress || c.progress.completed < c.progress.total,
		) ??
		candidates[0]

	if (!picked) return null

	const total = picked.progress?.total ?? 0
	const completed = picked.progress?.completed ?? 0

	return {
		id: picked.course.id,
		title: picked.course.title,
		language: languageMap.value.get(picked.course.languageId)?.name ?? '',
		level: levelMap.value.get(picked.course.languageLvlId)?.name ?? '',
		icon: picked.course.icon || 'book-marked',
		progress: total > 0 ? Math.round((completed / total) * 100) : 0,
		lessonsLeft: Math.max(0, total - completed),
	}
})
</script>

<template>
	<div class="max-w-7xl mx-auto w-full px-6 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- left -->
			<div class="lg:col-span-2 flex flex-col gap-6">
				<GreetingHero
					:greeting="greeting"
					:name="name"
					:wish="wish"
					:date="today"
				/>

				<!-- stats -->
				<div
					v-if="isLoading"
					class="grid grid-cols-2 lg:grid-cols-4 gap-4"
				>
					<Skeleton v-for="i in 4" :key="i" class="h-20 w-full rounded-xl" />
				</div>
				<div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						v-for="stat in stats"
						:key="stat.id"
						:title="stat.title"
						:value="stat.value"
						:icon="stat.icon"
						:color="stat.color"
					/>
				</div>

				<!-- continue learning -->
				<Card v-if="isLoading" class="p-5">
					<Skeleton class="h-20 w-full rounded-xl" />
				</Card>
				<Card v-else-if="continueCourse" class="p-5">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-bold">Continue learning</h2>
						<RouterLink :to="$PAGES.main.myLearning">
							<Button variant="link" size="sm">View all</Button>
						</RouterLink>
					</div>

					<div class="flex items-center gap-4">
						<div
							class="flex items-center justify-center size-14 rounded-xl bg-card-secondary text-primary shrink-0"
						>
							<Icon :name="continueCourse.icon" :size="26" />
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<h3 class="font-semibold truncate">
									{{ continueCourse.title }}
								</h3>
								<Badge v-if="continueCourse.level" variant="outline">
									{{ continueCourse.level }}
								</Badge>
							</div>
							<p class="text-sm text-muted-foreground">
								{{ continueCourse.language }} ·
								{{ continueCourse.lessonsLeft }} lessons left
							</p>
							<div class="flex items-center gap-3 mt-3">
								<div
									class="flex-1 h-2 rounded-full bg-card-secondary overflow-hidden"
								>
									<div
										class="h-full rounded-full bg-primary transition-all"
										:style="{ width: `${continueCourse.progress}%` }"
									/>
								</div>
								<span class="text-sm font-medium text-muted-foreground">
									{{ continueCourse.progress }}%
								</span>
							</div>
						</div>
						<RouterLink :to="$PAGES.main.course(continueCourse.id)">
							<Button class="shrink-0">Resume</Button>
						</RouterLink>
					</div>
				</Card>

				<!-- today schedule -->
				<Card class="p-5">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-bold">Today's schedule</h2>
						<Badge variant="secondary">{{ todaySchedule.length }} lessons</Badge>
					</div>

					<div class="flex flex-col">
						<div
							v-for="(item, i) in todaySchedule"
							:key="item.id"
							class="flex items-center gap-4 py-3"
							:class="{ 'border-t border-border': i > 0 }"
						>
							<div
								class="flex flex-col items-center justify-center text-center shrink-0 w-24 text-xs"
							>
								<span class="font-semibold text-foreground">
									{{ item.time.split(' — ')[0] }}
								</span>
								<span class="text-muted">{{ item.time.split(' — ')[1] }}</span>
							</div>
							<div class="w-px self-stretch bg-border" />
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-sm truncate">{{ item.title }}</h3>
								<p class="text-xs text-muted-foreground mt-0.5">
									{{ item.mentor }}
								</p>
							</div>
							<Badge variant="outline">{{ item.level }}</Badge>
						</div>
					</div>
				</Card>
			</div>

			<!-- right: news feed -->
			<div class="flex flex-col">
				<Card class="p-5">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-lg font-bold">What's new</h2>
						<Icon name="newspaper" :size="20" class="text-muted-foreground" />
					</div>
					<div class="flex flex-col divide-y divide-border">
						<NewsItem
							v-for="item in newsFeed"
							:key="item.id"
							:title="item.title"
							:excerpt="item.excerpt"
							:date="item.date"
							:tag="item.tag"
							:tag-variant="item.tagVariant"
						/>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>
