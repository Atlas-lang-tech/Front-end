<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import type { LessonResult } from '../lesson-player.types'
import { computed } from 'vue'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	result: LessonResult
	hasNextLesson: boolean
}>()

const emit = defineEmits<{
	back: []
	next: []
	retry: []
	review: []
}>()

// ---------------------
// mistakes
// ---------------------

const hasMistakes = computed(
	() => props.result.incorrectCount + props.result.unansweredCount > 0,
)
</script>

<template>
	<Card class="max-w-xl mx-auto p-8 text-center">
		<!-- markdown-only lesson -->
		<template v-if="result.totalInteractive === 0">
			<div
				class="mx-auto flex items-center justify-center size-16 rounded-full bg-status-success/10 text-status-success mb-4"
			>
				<Icon name="check" :size="32" />
			</div>
			<h2 class="text-2xl font-bold">Lesson completed</h2>
			<p class="text-muted-foreground mt-1">
				You have read through all the material.
			</p>
		</template>

		<!-- scored lesson -->
		<template v-else>
			<p class="text-sm font-medium text-muted uppercase tracking-wide">
				Your result
			</p>
			<p
				class="text-6xl font-bold mt-2"
				:class="result.passed ? 'text-status-success' : 'text-status-error'"
			>
				{{ result.scorePercent }}%
			</p>
			<h2 class="text-2xl font-bold mt-3">
				{{ result.passed ? 'Lesson passed' : 'Lesson failed' }}
			</h2>
			<p v-if="!result.passed" class="text-muted-foreground mt-1">
				You need at least 75% correct answers to pass. Try again!
			</p>

			<div class="flex items-center justify-center gap-6 mt-6">
				<div class="flex flex-col items-center">
					<span class="text-xl font-bold text-status-success">
						{{ result.correctCount }}
					</span>
					<span class="text-xs text-muted">Correct</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-xl font-bold text-status-error">
						{{ result.incorrectCount }}
					</span>
					<span class="text-xs text-muted">Incorrect</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-xl font-bold text-status-neutral">
						{{ result.unansweredCount }}
					</span>
					<span class="text-xs text-muted">Unanswered</span>
				</div>
			</div>
		</template>

		<div class="flex items-center justify-center gap-3 mt-8">
			<Button variant="ghost" @click="emit('back')">Back to lessons</Button>
			<Button v-if="!result.passed" @click="emit('retry')">
				<Icon name="rotate-ccw" :size="16" />
				Retry lesson
			</Button>
			<Button v-else-if="hasNextLesson" @click="emit('next')">
				Next lesson
				<Icon name="arrow-right" :size="16" />
			</Button>
		</div>

		<div v-if="hasMistakes" class="flex justify-center mt-3">
			<Button variant="link" @click="emit('review')">
				<Icon name="list-checks" :size="16" />
				Review mistakes
			</Button>
		</div>
	</Card>
</template>
