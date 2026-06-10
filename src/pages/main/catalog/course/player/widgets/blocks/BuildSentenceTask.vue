<script setup lang="ts">
import type { BuildSentenceContent } from '@/types/block'
import { computed, ref } from 'vue'
import type { BlockAnswer, TaskActionMode } from '../../lesson-player.types'
import TaskActions from './TaskActions.vue'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	content: BuildSentenceContent
	title: string | null
	mode: TaskActionMode
}>()

const emit = defineEmits<{
	submit: [answer: BlockAnswer]
	secondary: []
}>()

// ---------------------
// answer
// ---------------------

const picked = ref<number[]>([])

const available = computed(() =>
	props.content.words
		.map((word, index) => ({ word, index }))
		.filter(({ index }) => !picked.value.includes(index)),
)

const pick = (index: number) => {
	picked.value = [...picked.value, index]
}

const unpick = (index: number) => {
	picked.value = picked.value.filter(i => i !== index)
}

const canSubmit = computed(
	() => picked.value.length === props.content.words.length,
)

const onSubmit = () => {
	if (!canSubmit.value) return
	emit('submit', { kind: 'build-sentence', wordIndexes: picked.value })
}
</script>

<template>
	<div>
		<p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
			Build the sentence from the words
		</p>
		<h2 v-if="title" class="text-2xl font-bold mb-4">{{ title }}</h2>

		<div
			class="min-h-16 flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border bg-card mb-6"
		>
			<p v-if="!picked.length" class="text-muted text-sm">
				Tap the words below to build your sentence
			</p>
			<button
				v-for="index in picked"
				:key="index"
				type="button"
				class="px-3.5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
				@click="unpick(index)"
			>
				{{ content.words[index] }}
			</button>
		</div>

		<div class="flex flex-wrap gap-2">
			<button
				v-for="{ word, index } in available"
				:key="index"
				type="button"
				class="px-3.5 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary"
				@click="pick(index)"
			>
				{{ word }}
			</button>
		</div>

		<TaskActions
			:can-submit="canSubmit"
			:mode="mode"
			@submit="onSubmit"
			@secondary="emit('secondary')"
		/>
	</div>
</template>
