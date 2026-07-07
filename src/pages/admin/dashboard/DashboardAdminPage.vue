<script setup lang="ts">
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseGetAll } from '@/api/courses/get/all/useCourseGetAll'
import { useProgressStats } from '@/api/courses/get/progressStats/useProgressStats'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll'
import { useUserGetAll } from '@/api/users/get/all/useUserGetAll'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import { Skeleton } from '@/shared/ui/skeleton'
import type { User } from '@/types/user'
import { computed } from 'vue'
import DashboardActivityChart from './widgets/DashboardActivityChart.vue'
import DashboardBarList from './widgets/DashboardBarList.vue'
import DashboardRoleBreakdown from './widgets/DashboardRoleBreakdown.vue'

// ---------------------
// api
// ---------------------
const usersQuery = useUserGetAll()
const coursesQuery = useCourseGetAll()
const languagesQuery = useLanguageGetAll()
const categoriesQuery = useCategoryGetAll()
const levelsQuery = useLanguageLevelGetAll()
const statsQuery = useProgressStats()

// ---------------------
// data
// ---------------------
const users = computed(() => usersQuery.state.value.data ?? [])
const courses = computed(() => coursesQuery.state.value.data?.data ?? [])
const languages = computed(() => languagesQuery.state.value.data?.data ?? [])
const categories = computed(() => categoriesQuery.state.value.data?.data ?? [])
const levels = computed(() => levelsQuery.state.value.data?.data ?? [])

// ---------------------
// derived
// ---------------------
const totalUsers = computed(() => users.value.length)
const totalCourses = computed(() => courses.value.length)
const totalLanguages = computed(() => languages.value.length)
const totalCategories = computed(() => categories.value.length)
const totalLevels = computed(() => levels.value.length)

const usersByRole = computed<Record<User['role'], number>>(() => {
	const acc: Record<User['role'], number> = { USER: 0, MODERATOR: 0, ADMIN: 0 }
	for (const user of users.value) acc[user.role]++
	return acc
})

const coursesByLanguage = computed(() =>
	languages.value.map(language => ({
		label: language.name,
		value: courses.value.filter(course => course.languageId === language.id)
			.length,
	})),
)

const coursesByCategory = computed(() =>
	categories.value.map(category => ({
		label: category.name,
		value: courses.value.filter(course => course.categoryId === category.id)
			.length,
	})),
)

// ---------------------
// progress insights
// ---------------------
const stats = computed(() => statsQuery.state.value.data?.data)

const topCourses = computed(() =>
	(stats.value?.topCourses ?? []).map(course => ({
		label: course.title,
		value: course.completions,
	})),
)

const dailyCompletions = computed(() =>
	(stats.value?.dailyCompletions ?? []).map(day => ({
		label: new Date(day.date).toLocaleDateString('en-US', {
			weekday: 'short',
		}),
		value: day.count,
	})),
)

// ---------------------
// states
// ---------------------
const isLoading = computed(() =>
	[
		usersQuery,
		coursesQuery,
		languagesQuery,
		categoriesQuery,
		levelsQuery,
		statsQuery,
	].some(query => query.asyncStatus.value === 'loading'),
)

const isError = computed(() =>
	[
		usersQuery,
		coursesQuery,
		languagesQuery,
		categoriesQuery,
		levelsQuery,
		statsQuery,
	].some(query => query.state.value.status === 'error'),
)
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<h1 class="text-3xl font-bold mb-6">Dashboard</h1>

		<!-- loading -->
		<div v-if="isLoading" class="space-y-3">
			<div class="flex flex-wrap gap-4">
				<Skeleton v-for="i in 4" :key="i" class="h-32 w-80 rounded-xl" />
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Skeleton v-for="i in 2" :key="i" class="h-56 w-full rounded-xl" />
			</div>
		</div>

		<!-- error -->
		<div
			v-else-if="isError"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">Error loading data</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- success -->
		<div v-else class="flex flex-col gap-8">
			<!-- real KPI -->
			<div class="flex flex-wrap gap-4">
				<AdminStatsCard
					title="Users"
					:value="totalUsers"
					icon="users"
					color="blue"
				/>
				<AdminStatsCard
					title="Courses"
					:value="totalCourses"
					icon="book"
					color="orange"
				/>
				<AdminStatsCard
					title="Languages"
					:value="totalLanguages"
					icon="languages"
					color="green"
				/>
				<AdminStatsCard
					title="Categories"
					:value="totalCategories"
					icon="chart-column-stacked"
					color="cyan"
				/>
			</div>

			<!-- real analytics -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<DashboardBarList
					title="Courses by language"
					:items="coursesByLanguage"
					color="bg-secondary"
				/>
				<DashboardRoleBreakdown
					:users-by-role="usersByRole"
					:total-levels="totalLevels"
				/>
			</div>

			<DashboardBarList
				title="Courses by category"
				:items="coursesByCategory"
				color="bg-accent"
			/>

			<!-- progress insights -->
			<div>
				<h2 class="text-xl font-bold mb-4">Learning insights</h2>

				<div class="flex flex-wrap gap-4 mb-4">
					<AdminStatsCard
						title="Active today"
						:value="stats?.activeToday ?? 0"
						icon="activity"
						color="green"
					/>
					<AdminStatsCard
						title="Completed (7d)"
						:value="stats?.completionsLast7d ?? 0"
						icon="circle-check"
						color="blue"
					/>
					<AdminStatsCard
						title="Active learners"
						:value="stats?.activeLearners ?? 0"
						icon="users"
						color="purple"
					/>
					<AdminStatsCard
						title="Total completions"
						:value="stats?.totalCompletions ?? 0"
						icon="trophy"
						color="orange"
					/>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<DashboardActivityChart
						title="Completions (last 7 days)"
						:items="dailyCompletions"
					/>
					<DashboardBarList
						title="Most completed courses"
						:items="topCourses"
						color="bg-status-success"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
