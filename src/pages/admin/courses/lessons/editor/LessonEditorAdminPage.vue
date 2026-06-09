<script setup lang="ts">
import type { BlockItem } from '@/api/blocks/sync'
import { useBlockSync } from '@/api/blocks/sync/useBlockSync'
import { useBlockGetByLesson } from '@/api/blocks/get/byLessonId/useBlockGetByLesson'
import { useLessonGetById } from '@/api/lessons/get/byId/useLessonGetById'
import { $PAGES } from '@/app/configs/pages.config'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Block, BlockContent, BlockType } from '@/types/block'
import {
	ArrowLeftIcon,
	GripVerticalIcon,
	RotateCcwIcon,
	SaveIcon,
	Trash2Icon,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import draggable from 'vuedraggable'
import { BLOCK_TYPE_LABELS, blockPreview } from './block-types'
import AdminBlockFormModal from './(modals)/AdminBlockFormModal.vue'

interface DraftBlock {
	_key: string
	id?: number
	type: BlockType
	title: string
	content: BlockContent
}

interface BlockFormValue {
	type: BlockType
	title: string
	content: BlockContent
}

// ---------------------
// route
// ---------------------
const route = useRoute()
const courseId = computed(() => Number(route.params.courseId))
const lessonId = computed(() => Number(route.params.lessonId))

// ---------------------
// api
// ---------------------
const lessonQuery = useLessonGetById(lessonId)
const lesson = computed(() => lessonQuery.state.value.data?.data)

const { state, asyncStatus, refetch } = useBlockGetByLesson(lessonId)
const sync = useBlockSync()

// ---------------------
// draft
// ---------------------
const uid = () =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2)

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const toDraft = (b: Block): DraftBlock => ({
	_key: uid(),
	id: b.id,
	type: b.type,
	title: b.title ?? '',
	content: clone(b.content),
})

const draft = ref<DraftBlock[]>([])

watch(
	() => state.value.data?.data,
	data => {
		draft.value = data ? data.map(toDraft) : []
	},
	{ immediate: true },
)

const serverSnapshot = computed(() =>
	JSON.stringify(
		(state.value.data?.data ?? []).map(b => ({
			id: b.id,
			type: b.type,
			title: b.title ?? '',
			content: b.content,
		})),
	),
)

const draftSnapshot = computed(() =>
	JSON.stringify(
		draft.value.map(b => ({
			id: b.id,
			type: b.type,
			title: b.title,
			content: b.content,
		})),
	),
)

const isDirty = computed(() => serverSnapshot.value !== draftSnapshot.value)

// ---------------------
// draft mutations
// ---------------------
const onAdd = (value: BlockFormValue) => {
	draft.value.push({
		_key: uid(),
		type: value.type,
		title: value.title,
		content: value.content,
	})
}

const onEdit = (key: string, value: BlockFormValue) => {
	const item = draft.value.find(b => b._key === key)
	if (item) {
		item.type = value.type
		item.title = value.title
		item.content = value.content
	}
}

const onRemove = (key: string) => {
	draft.value = draft.value.filter(b => b._key !== key)
}

const onDiscard = () => {
	const data = state.value.data?.data
	draft.value = data ? data.map(toDraft) : []
}

// ---------------------
// save (sync)
// ---------------------
const onSave = async () => {
	try {
		const blocks: BlockItem[] = draft.value.map(b => ({
			...(b.id ? { id: b.id } : {}),
			type: b.type,
			...(b.title ? { title: b.title } : {}),
			content: b.content,
		}))
		await sync.mutateAsync({ lessonId: lessonId.value, blocks })
		toast.success('Blocks saved')
		refetch()
	} catch (e) {
		toast.error('Failed to save blocks')
	}
}
</script>

<template>
	<div class="flex flex-col items-center w-full h-full">
		<div class="flex items-center justify-between w-full mb-6">
			<div class="flex items-center gap-3 min-w-0">
				<RouterLink :to="$PAGES.admin.course.lessons(courseId)">
					<Button
						size="icon-sm"
						variant="ghost"
						class="shrink-0"
						aria-label="Back to lessons"
					>
						<ArrowLeftIcon class="size-4" />
					</Button>
				</RouterLink>
				<div class="min-w-0">
					<h1 class="text-3xl font-bold truncate">
						{{ lesson?.title ?? 'Lesson' }}
					</h1>
					<p class="text-muted text-sm mt-1">
						Drag blocks to reorder. Changes are saved on
						<span class="font-semibold">Save</span>.
					</p>
				</div>
			</div>

			<div class="flex items-center gap-2 shrink-0">
				<Button
					v-if="isDirty"
					variant="ghost"
					class="gap-1.5"
					@click="onDiscard"
				>
					<RotateCcwIcon class="size-4" />
					Discard
				</Button>
				<Button
					variant="secondary"
					class="gap-1.5"
					:disabled="!isDirty || sync.isLoading.value"
					@click="onSave"
				>
					<SaveIcon class="size-4" />
					{{ sync.isLoading.value ? 'Saving...' : 'Save' }}
				</Button>
				<AdminBlockFormModal @submit="onAdd" />
			</div>
		</div>

		<div class="w-full">
			<!-- loading -->
			<div v-if="asyncStatus === 'loading'" class="flex flex-col gap-3">
				<Skeleton v-for="i in 5" :key="i" class="h-16 w-full rounded-lg" />
			</div>

			<!-- error -->
			<div
				v-else-if="state.status === 'error'"
				class="bg-card border border-destructive p-12 text-center rounded-xl"
			>
				<p class="text-destructive font-semibold text-lg">
					Error loading blocks
				</p>
				<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
			</div>

			<!-- success -->
			<div v-else-if="state.status === 'success'" class="w-full">
				<!-- empty -->
				<div
					v-if="draft.length === 0"
					class="bg-card border border-border p-12 text-center rounded-xl"
				>
					<p class="text-foreground font-semibold text-lg">No blocks yet</p>
					<p class="text-muted text-sm mt-1">
						Add your first content block to this lesson.
					</p>
				</div>

				<!-- draggable list -->
				<draggable
					v-else
					v-model="draft"
					item-key="_key"
					handle=".drag-handle"
					:animation="200"
					ghost-class="opacity-40"
					class="flex flex-col gap-3"
				>
					<template #item="{ element: block, index }">
						<Card class="p-4 flex items-center gap-4">
							<button
								class="drag-handle cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors"
								aria-label="Drag to reorder"
							>
								<GripVerticalIcon class="size-5" />
							</button>

							<Badge variant="outline">{{ index + 1 }}</Badge>

							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<Badge variant="secondary">
										{{ BLOCK_TYPE_LABELS[(block as DraftBlock).type] }}
									</Badge>
									<span
										v-if="(block as DraftBlock).title"
										class="text-sm font-semibold truncate"
									>
										{{ (block as DraftBlock).title }}
									</span>
								</div>
								<p class="text-muted text-sm truncate">
									{{
										blockPreview(block as unknown as Block) || '—'
									}}
								</p>
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<AdminBlockFormModal
									:block="block as DraftBlock"
									@submit="val => onEdit((block as DraftBlock)._key, val)"
								/>
								<Button
									size="sm"
									class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-destructive/40 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all duration-150 cursor-pointer"
									@click="onRemove((block as DraftBlock)._key)"
								>
									<Trash2Icon class="size-3" />
								</Button>
							</div>
						</Card>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>
