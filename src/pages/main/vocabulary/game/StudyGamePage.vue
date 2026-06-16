<script setup lang="ts">
import { useStudyAnswer } from '@/api/vocabulary/study/answer/useStudyAnswer'
import { useStudySession } from '@/api/vocabulary/study/session/useStudySession'
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudyPlayer } from './useStudyPlayer'
import { GAME_MODES, type GameMode } from './study-player.types'
import StudyProgressBar from './widgets/StudyProgressBar.vue'
import StudyResultScreen from './widgets/StudyResultScreen.vue'
import ClozeGame from './widgets/games/ClozeGame.vue'
import FlashcardsGame from './widgets/games/FlashcardsGame.vue'
import MatchingGame from './widgets/games/MatchingGame.vue'
import MultipleChoiceGame from './widgets/games/MultipleChoiceGame.vue'
import TypingGame from './widgets/games/TypingGame.vue'

// ---------------------
// route
// ---------------------
const route = useRoute()
const router = useRouter()

const dictionaryId = computed(() => Number(route.params.dictionaryId))
const mode = computed(() => String(route.params.mode) as GameMode)
const isMatching = computed(() => mode.value === 'matching')

const gameTitle = computed(
	() => GAME_MODES.find(g => g.mode === mode.value)?.title ?? 'Study',
)

// ---------------------
// api
// ---------------------
const { state, asyncStatus } = useStudySession(dictionaryId)
const studyAnswer = useStudyAnswer()

const pool = computed(() => state.value.data?.data ?? [])

// ---------------------
// player (single / mixed)
// ---------------------
const {
	currentTask,
	total,
	completed,
	correctCount,
	finished,
	buildQueue,
	record,
	mergeWord,
} = useStudyPlayer(pool, mode)

watch(
	() => [state.value.status, mode.value, pool.value.length],
	() => {
		if (state.value.status === 'success' && !isMatching.value) {
			buildQueue()
		}
	},
	{ immediate: true },
)

// ---------------------
// matching state
// ---------------------
const matchingKey = ref(0)
const matchingFinished = ref(false)
const matchingResult = ref({ correct: 0, total: 0 })

// ---------------------
// answers
// ---------------------
const sendAnswer = async (wordId: number, correct: boolean) => {
	try {
		const updated = await studyAnswer.mutateAsync({ wordId, correct })
		mergeWord(updated.data)
	} catch (e) {
		// progress sync failures shouldn't interrupt the session
	}
}

const onDone = (correct: boolean) => {
	const word = currentTask.value?.word
	if (!word) return
	record(correct)
	void sendAnswer(word.id, correct)
}

const onMatchAnswer = (payload: { wordId: number; correct: boolean }) => {
	void sendAnswer(payload.wordId, payload.correct)
}

const onMatchComplete = (payload: { correct: number; total: number }) => {
	matchingResult.value = payload
	matchingFinished.value = true
}

// ---------------------
// result / controls
// ---------------------
const isFinished = computed(() =>
	isMatching.value ? matchingFinished.value : finished.value,
)
const resultCorrect = computed(() =>
	isMatching.value ? matchingResult.value.correct : correctCount.value,
)
const resultTotal = computed(() =>
	isMatching.value ? matchingResult.value.total : total.value,
)

const hasContent = computed(() =>
	isMatching.value ? pool.value.length > 0 : total.value > 0,
)

const retry = () => {
	if (isMatching.value) {
		matchingFinished.value = false
		matchingResult.value = { correct: 0, total: 0 }
		matchingKey.value += 1
	} else {
		buildQueue()
	}
}

const goBack = () => {
	router.push($PAGES.main.vocabularyStudy(dictionaryId.value))
}
</script>

<template>
	<div class="max-w-2xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<div class="flex items-center justify-between gap-4 mb-6">
			<h1 class="text-xl font-bold truncate">{{ gameTitle }}</h1>
			<Button variant="ghost" size="icon-sm" @click="goBack">
				<Icon name="x" :size="18" />
			</Button>
		</div>

		<!-- loading -->
		<div v-if="asyncStatus === 'loading' && state.status === 'pending'">
			<Skeleton class="h-3 w-full rounded-full mb-6" />
			<Skeleton class="h-64 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading session
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!hasContent"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">
				Nothing to study right now
			</p>
			<p class="text-muted text-sm mt-1">
				This game has no eligible words for today's pool.
			</p>
			<Button variant="ghost" class="mt-4" @click="goBack">Back to hub</Button>
		</div>

		<!-- result -->
		<StudyResultScreen
			v-else-if="isFinished"
			:correct="resultCorrect"
			:total="resultTotal"
			@retry="retry"
			@back="goBack"
		/>

		<!-- matching -->
		<MatchingGame
			v-else-if="isMatching"
			:key="matchingKey"
			:pool="pool"
			@answer="onMatchAnswer"
			@complete="onMatchComplete"
		/>

		<!-- single / mixed -->
		<template v-else-if="currentTask">
			<StudyProgressBar :current="completed" :total="total" />
			<Card class="p-8">
				<FlashcardsGame
					v-if="currentTask.type === 'flashcards'"
					:key="currentTask.word.id"
					:word="currentTask.word"
					@done="onDone"
				/>
				<MultipleChoiceGame
					v-else-if="currentTask.type === 'choice'"
					:key="currentTask.word.id"
					:word="currentTask.word"
					:pool="pool"
					@done="onDone"
				/>
				<TypingGame
					v-else-if="currentTask.type === 'typing'"
					:key="currentTask.word.id"
					:word="currentTask.word"
					@done="onDone"
				/>
				<ClozeGame
					v-else-if="currentTask.type === 'cloze'"
					:key="currentTask.word.id"
					:word="currentTask.word"
					@done="onDone"
				/>
			</Card>
		</template>
	</div>
</template>
