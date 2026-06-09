<script setup lang="ts">
import { useLessonGetByCourse } from '@/api/lessons/get/byCourseId/useLessonGetByCourse'
import { useLessonReorder } from '@/api/lessons/reorder/useLessonReorder'
import { $PAGES } from '@/app/configs/pages.config'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Lesson } from '@/types/lesson'
import { ArrowRightIcon, GripVerticalIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import draggable from 'vuedraggable'
import AdminLessonCreateModal from './(modals)/AdminLessonCreateModal.vue'
import AdminLessonDeleteModal from './(modals)/AdminLessonDeleteModal.vue'
import AdminLessonEditModal from './(modals)/AdminLessonEditModal.vue'

// ---------------------
// route
// ---------------------
const route = useRoute()
const courseId = computed(() => Number(route.params.courseId))

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useLessonGetByCourse(courseId)
const reorder = useLessonReorder()

// ---------------------
// local draggable list
// ---------------------
const items = ref<Lesson[]>([])

watch(
	() => state.value.data?.data,
	data => {
		items.value = data ? [...data] : []
	},
	{ immediate: true },
)

const onReorder = async () => {
	try {
		await reorder.mutateAsync({
			courseId: courseId.value,
			lessonIds: items.value.map(l => l.id),
		})
		toast.success('Order saved')
		refetch()
	} catch (e) {
		toast.error('Failed to save order')
		refetch()
	}
}
</script>

<template>
	<div class="flex flex-col items-center w-full h-full">
		<div class="flex items-center justify-between w-full mb-6">
			<div>
				<h1 class="text-3xl font-bold">Lessons</h1>
				<p class="text-muted text-sm mt-1">
					Drag lessons by the handle to reorder them.
				</p>
			</div>
			<AdminLessonCreateModal :course-id="courseId" @success="refetch" />
		</div>

		<div class="w-full">
			<!-- loading -->
			<div v-if="asyncStatus === 'loading'" class="flex flex-col gap-3">
				<Skeleton v-for="i in 6" :key="i" class="h-16 w-full rounded-lg" />
			</div>

			<!-- error -->
			<div
				v-else-if="state.status === 'error'"
				class="bg-card border border-destructive p-12 text-center rounded-xl"
			>
				<p class="text-destructive font-semibold text-lg">
					Error loading lessons
				</p>
				<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
			</div>

			<!-- success -->
			<div v-else-if="state.status === 'success'" class="w-full">
				<!-- empty -->
				<div
					v-if="items.length === 0"
					class="bg-card border border-border p-12 text-center rounded-xl"
				>
					<p class="text-foreground font-semibold text-lg">No lessons yet</p>
					<p class="text-muted text-sm mt-1">
						Create your first lesson to get started.
					</p>
				</div>

				<!-- draggable list -->
				<draggable
					v-else
					v-model="items"
					item-key="id"
					handle=".drag-handle"
					:animation="200"
					ghost-class="opacity-40"
					class="flex flex-col gap-3"
					@end="onReorder"
				>
					<template #item="{ element: lesson, index }">
						<Card class="p-4 flex items-center gap-4">
							<button
								class="drag-handle cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors"
								aria-label="Drag to reorder"
							>
								<GripVerticalIcon class="size-5" />
							</button>

							<Badge variant="outline">{{ index + 1 }}</Badge>

							<div class="flex-1 min-w-0">
								<p class="font-semibold truncate">{{ lesson.title }}</p>
								<p class="text-muted text-sm truncate">
									{{ lesson.description }}
								</p>
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<AdminLessonEditModal :lesson="lesson" @success="refetch" />
								<AdminLessonDeleteModal
									:id="lesson.id"
									:name="lesson.title"
									@success="refetch"
								/>
								<RouterLink
									:to="$PAGES.admin.course.lesson(courseId, lesson.id)"
								>
									<Button size="sm" class="gap-1.5">
										Open
										<ArrowRightIcon class="size-3" />
									</Button>
								</RouterLink>
							</div>
						</Card>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>
