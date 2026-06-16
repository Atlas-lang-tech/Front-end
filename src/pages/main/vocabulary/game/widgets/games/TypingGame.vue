<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import type { Word } from '@/types/vocabulary'
import { ref } from 'vue'
import { checkTyping } from '../../study-answer-check'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	word: Word
}>()

const emit = defineEmits<{
	done: [correct: boolean]
}>()

// ---------------------
// state
// ---------------------
const input = ref('')
const answered = ref(false)
const correct = ref(false)

const check = () => {
	if (answered.value || !input.value.trim()) return
	correct.value = checkTyping(input.value, props.word.translation)
	answered.value = true
}
</script>

<template>
	<div class="flex flex-col gap-6">
		<div class="text-center">
			<p class="text-sm text-muted-foreground mb-1">Type the translation</p>
			<h2 class="text-3xl font-bold">{{ word.word }}</h2>
			<p v-if="word.transcription" class="text-muted-foreground mt-1">
				[{{ word.transcription }}]
			</p>
		</div>

		<form @submit.prevent="check">
			<Input
				v-model="input"
				:disabled="answered"
				placeholder="Your answer.."
				class="text-center text-lg"
			/>
		</form>

		<div
			v-if="answered"
			class="rounded-xl p-4 text-center font-medium"
			:class="
				correct
					? 'bg-status-success/10 text-status-success'
					: 'bg-destructive/10 text-destructive'
			"
		>
			<template v-if="correct">Correct!</template>
			<template v-else>
				Correct answer:
				<span class="font-bold">{{ word.translation }}</span>
			</template>
		</div>

		<div class="flex justify-end">
			<Button v-if="!answered" :disabled="!input.trim()" @click="check">
				Check
			</Button>
			<Button v-else @click="emit('done', correct)">Continue</Button>
		</div>
	</div>
</template>
