<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import type { Word } from '@/types/vocabulary'
import { ref } from 'vue'
import { buildChoices } from '../../study-answer-check'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	word: Word
	pool: Word[]
}>()

const emit = defineEmits<{
	done: [correct: boolean]
}>()

// ---------------------
// state
// ---------------------
const options = ref<string[]>(buildChoices(props.word, props.pool))
const selected = ref<string | null>(null)
const answered = ref(false)

const choose = (option: string) => {
	if (answered.value) return
	selected.value = option
	answered.value = true
}

const isCorrect = (option: string) => option === props.word.translation
</script>

<template>
	<div class="flex flex-col gap-6">
		<div class="text-center">
			<p class="text-sm text-muted-foreground mb-1">Translate</p>
			<h2 class="text-3xl font-bold">{{ word.word }}</h2>
			<p v-if="word.transcription" class="text-muted-foreground mt-1">
				[{{ word.transcription }}]
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<button
				v-for="option in options"
				:key="option"
				type="button"
				class="rounded-xl border-2 px-4 py-4 text-left font-medium transition-all duration-150"
				:class="[
					!answered && 'border-border hover:border-primary/40 bg-card',
					answered && isCorrect(option)
						? 'border-status-success bg-status-success/10 text-status-success'
						: '',
					answered && !isCorrect(option) && selected === option
						? 'border-destructive bg-destructive/10 text-destructive'
						: '',
					answered && !isCorrect(option) && selected !== option
						? 'border-border opacity-60'
						: '',
				]"
				@click="choose(option)"
			>
				{{ option }}
			</button>
		</div>

		<div v-if="answered" class="flex justify-end">
			<Button @click="emit('done', selected === word.translation)">
				Continue
			</Button>
		</div>
	</div>
</template>
