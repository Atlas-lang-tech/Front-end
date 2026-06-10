<script setup lang="ts">
import { useBlockGetByLesson } from '@/api/blocks/get/byLessonId/useBlockGetByLesson.ts'
import { useLessonGetByCourse } from '@/api/lessons/get/byCourseId/useLessonGetByCourse.ts'
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type {
	BuildSentenceContent,
	DialogueContent,
	MarkdownContent,
	MatchingContent,
	OneTrueChoiceContent,
} from '@/types/block'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLessonPlayer } from './useLessonPlayer.ts'
import LessonMistakesReview from './widgets/LessonMistakesReview.vue'
import LessonProgressBar from './widgets/LessonProgressBar.vue'
import LessonResultScreen from './widgets/LessonResultScreen.vue'
import BuildSentenceTask from './widgets/blocks/BuildSentenceTask.vue'
import ChoiceTask from './widgets/blocks/ChoiceTask.vue'
import DialogueTask from './widgets/blocks/DialogueTask.vue'
import MarkdownBlock from './widgets/blocks/MarkdownBlock.vue'
import MatchingTask from './widgets/blocks/MatchingTask.vue'
import TextAnswerTask from './widgets/blocks/TextAnswerTask.vue'

// ---------------------
// route
// ---------------------

const route = useRoute()
const router = useRouter()

const courseId = computed(() => Number(route.params.courseId))
const lessonId = computed(() => Number(route.params.lessonId))

// ---------------------
// api
// ---------------------

const { state, asyncStatus } = useBlockGetByLesson(lessonId)
const { state: lessonsState } = useLessonGetByCourse(courseId)

const blocks = computed(() => state.value.data?.data ?? [])

// ---------------------
// player
// ---------------------

const {
	phase,
	currentBlock,
	completedSteps,
	totalSteps,
	actionMode,
	result,
	mistakes,
	continueBlock,
	submit,
	skip,
	leaveUnanswered,
	restart,
} = useLessonPlayer(blocks, { lessonId, courseId })

const showMistakes = ref(false)

const onSecondary = () => {
	if (phase.value === 'review') leaveUnanswered()
	else skip()
}

const onRetry = () => {
	showMistakes.value = false
	restart()
}

const isTextTask = computed(() =>
	[
		'FILL_IN_BLANK',
		'MANUAL_ANSWER',
		'TRANSLATION',
		'REPHRASING',
		'ERROR_CORRECTION',
	].includes(currentBlock.value?.type ?? ''),
)

// ---------------------
// navigation
// ---------------------

const lessons = computed(() =>
	[...(lessonsState.value.data?.data ?? [])].sort((a, b) => a.order - b.order),
)

const currentLesson = computed(() =>
	lessons.value.find(lesson => lesson.id === lessonId.value),
)

const nextLesson = computed(() => {
	const current = currentLesson.value
	if (!current) return undefined
	return lessons.value.find(lesson => lesson.order > current.order)
})

const goBack = () => {
	router.push($PAGES.main.course(courseId.value))
}

const goNext = () => {
	if (!nextLesson.value) return
	router.push($PAGES.main.lesson(courseId.value, nextLesson.value.id))
}

watch(lessonId, () => {
	showMistakes.value = false
	restart()
})
</script>

<template>
	<div class="max-w-3xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<div class="flex items-center justify-between gap-4 mb-6">
			<h1 class="text-xl font-bold truncate">
				{{ currentLesson?.title ?? 'Lesson' }}
			</h1>
			<RouterLink :to="$PAGES.main.course(courseId)">
				<Button variant="ghost" size="icon-sm">
					<Icon name="x" :size="18" />
				</Button>
			</RouterLink>
		</div>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading' && state.status === 'pending'"
			class="flex flex-col gap-4"
		>
			<Skeleton class="h-3 w-full rounded-full" />
			<Skeleton class="h-64 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading lesson
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!blocks.length"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">
				This lesson has no content yet
			</p>
			<p class="text-muted text-sm mt-1">Check back later.</p>
			<Button variant="ghost" class="mt-4" @click="goBack">
				Back to lessons
			</Button>
		</div>

		<!-- player -->
		<template v-else>
			<!-- mistakes review -->
			<LessonMistakesReview
				v-if="phase === 'results' && showMistakes"
				:mistakes="mistakes"
				@close="showMistakes = false"
			/>

			<!-- results -->
			<LessonResultScreen
				v-else-if="phase === 'results' && result"
				:result="result"
				:has-next-lesson="!!nextLesson"
				@back="goBack"
				@next="goNext"
				@retry="onRetry"
				@review="showMistakes = true"
			/>

			<!-- current block -->
			<template v-else-if="currentBlock">
				<LessonProgressBar
					:current="completedSteps"
					:total="totalSteps"
					:phase="phase"
				/>

				<Card class="p-8">
					<MarkdownBlock
						v-if="currentBlock.type === 'MARKDOWN'"
						:key="currentBlock.id"
						:content="currentBlock.content as MarkdownContent"
						:title="currentBlock.title"
						@continue="continueBlock"
					/>

					<ChoiceTask
						v-else-if="currentBlock.type === 'ONE_TRUE_CHOICE'"
						:key="currentBlock.id"
						:content="currentBlock.content as OneTrueChoiceContent"
						:title="currentBlock.title"
						:mode="actionMode"
						@submit="submit"
						@secondary="onSecondary"
					/>

					<TextAnswerTask
						v-else-if="isTextTask"
						:key="currentBlock.id"
						:block="currentBlock"
						:mode="actionMode"
						@submit="submit"
						@secondary="onSecondary"
					/>

					<BuildSentenceTask
						v-else-if="currentBlock.type === 'BUILD_SENTENCE'"
						:key="currentBlock.id"
						:content="currentBlock.content as BuildSentenceContent"
						:title="currentBlock.title"
						:mode="actionMode"
						@submit="submit"
						@secondary="onSecondary"
					/>

					<MatchingTask
						v-else-if="currentBlock.type === 'MATCHING'"
						:key="currentBlock.id"
						:content="currentBlock.content as MatchingContent"
						:title="currentBlock.title"
						:mode="actionMode"
						@submit="submit"
						@secondary="onSecondary"
					/>

					<DialogueTask
						v-else-if="currentBlock.type === 'DIALOGUE'"
						:key="currentBlock.id"
						:content="currentBlock.content as DialogueContent"
						:title="currentBlock.title"
						:mode="actionMode"
						@submit="submit"
						@secondary="onSecondary"
					/>
				</Card>
			</template>
		</template>
	</div>
</template>
