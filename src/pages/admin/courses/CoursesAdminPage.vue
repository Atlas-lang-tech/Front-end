<script setup lang="ts">
import { useCourseGetAll } from '@/api/courses/get/all/useCourseGetAll'
import { $PAGES } from '@/app/configs/pages.config'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui/table'
import { computed, ref } from 'vue'
import AdminCourseDeleteModal from './(modals)/delete/AdminCourseDeleteModal.vue'
import AdminCourseEditModal from './(modals)/edit/AdminCourseEditModal.vue'

const { state, asyncStatus, refetch } = useCourseGetAll()

const PER_PAGE = 8
const page = ref(1)

const courses = computed(() => state.value.data?.data ?? [])
const totalPages = computed(() => Math.ceil(courses.value.length / PER_PAGE))

const paginated = computed(() => {
	const start = (page.value - 1) * PER_PAGE
	return courses.value.slice(start, start + PER_PAGE)
})

const rangeLabel = computed(() => {
	const start = (page.value - 1) * PER_PAGE + 1
	const end = Math.min(page.value * PER_PAGE, courses.value.length)
	return `${start}–${end} of ${courses.value.length}`
})
</script>

<template>
	<div class="flex flex-col items-center w-full h-full">
		<div class="flex flex-col items-center justify-between w-full mb-4">
			<div class="flex items-center justify-between w-full mb-4">
				<h1 class="text-3xl font-bold">Courses</h1>
				<RouterLink :to="$PAGES.admin.course.create">
					<Button>New Course</Button>
				</RouterLink>
			</div>
			<div class="flex items-center justify-between w-full">
				<AdminStatsCard
					title="Total Courses"
					:value="courses.length"
					icon="calculator"
					color="purple"
				/>
			</div>
		</div>
		<div class="flex flex-col items-center w-full h-full">
			<!-- Skeleton -->
			<div v-if="asyncStatus === 'loading'" class="w-full">
				<div class="p-4 space-y-3">
					<Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
				</div>
			</div>

			<!-- Error -->
			<div
				v-else-if="state.status === 'error'"
				class="bg-card border border-destructive p-12 text-center rounded-xl"
			>
				<p class="text-destructive font-semibold text-lg">Error loading data</p>
				<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
			</div>

			<!-- Table -->
			<div v-else-if="state.status === 'success'" class="w-full">
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-36"> ID </TableHead>
								<TableHead> Title </TableHead>
								<TableHead> CID </TableHead>
								<TableHead> Description </TableHead>
								<TableHead> Icon </TableHead>
								<TableHead> Language ID </TableHead>
								<TableHead> Level ID </TableHead>
								<TableHead> Category ID </TableHead>
								<TableHead class="text-right w-52"> Actions </TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow v-for="course in paginated" :key="course.id">
								<TableCell>
									<Badge variant="outline"> #{{ course.id }} </Badge>
								</TableCell>
								<TableCell>
									{{ course.title }}
								</TableCell>
								<TableCell>
									{{ course.cid }}
								</TableCell>
								<TableCell>
									{{ course.description }}
								</TableCell>
								<TableCell>
									{{ course.icon }}
								</TableCell>
								<TableCell>
									{{ course.languageId }}
								</TableCell>
								<TableCell>
									{{ course.languageLvlId }}
								</TableCell>
								<TableCell>
									{{ course.categoryId || 'N/A' }}
								</TableCell>
								<TableCell>
									<div class="flex items-center justify-end gap-2">
										<AdminCourseEditModal :data="course" @success="refetch" />
										<AdminCourseDeleteModal
											:id="Number(course.id)"
											:name="course.title"
											@success="refetch"
										/>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<div
						class="flex items-center justify-between px-5 py-3 border-t border-border"
					>
						<span class="text-sm text-muted">
							{{ rangeLabel }}
						</span>
						<div class="flex gap-1">
							<Button
								size="sm"
								variant="ghost"
								:disabled="page === 1"
								@click="page--"
							>
								←
							</Button>
							<Button
								v-for="p in totalPages"
								:key="p"
								size="sm"
								@click="page = p"
								:variant="p === page ? 'default' : 'ghost'"
							>
								{{ p }}
							</Button>
							<Button
								size="sm"
								variant="ghost"
								:disabled="page === totalPages"
								@click="page++"
							>
								→
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>
