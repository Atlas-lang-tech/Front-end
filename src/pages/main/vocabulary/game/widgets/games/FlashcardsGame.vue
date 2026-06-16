<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import type { Word } from '@/types/vocabulary'
import { ref } from 'vue'

// ---------------------
// props / emits
// ---------------------
defineProps<{
	word: Word
}>()

const emit = defineEmits<{
	done: [correct: boolean]
}>()

// ---------------------
// state
// ---------------------
const flipped = ref(false)
</script>

<template>
	<div class="flex flex-col items-center gap-6">
		<button
			type="button"
			class="w-full min-h-56 rounded-2xl border-2 border-border bg-card-secondary flex flex-col items-center justify-center gap-2 p-8 text-center transition-all duration-150 hover:border-primary/40"
			@click="flipped = !flipped"
		>
			<template v-if="!flipped">
				<span class="text-3xl font-bold">{{ word.word }}</span>
				<span v-if="word.transcription" class="text-muted-foreground">
					[{{ word.transcription }}]
				</span>
				<span class="text-xs text-muted mt-4">Tap to reveal</span>
			</template>
			<template v-else>
				<span class="text-3xl font-bold text-primary">
					{{ word.translation }}
				</span>
				<span v-if="word.example" class="text-muted-foreground mt-2 italic">
					{{ word.example }}
				</span>
			</template>
		</button>

		<div v-if="flipped" class="flex items-center gap-3 w-full">
			<Button
				variant="destructive"
				class="flex-1"
				@click="emit('done', false)"
			>
				I didn't know
			</Button>
			<Button class="flex-1" @click="emit('done', true)">I knew it</Button>
		</div>
		<p v-else class="text-sm text-muted">Flip the card to rate yourself.</p>
	</div>
</template>
