<script setup lang="ts">
import type { OneTrueChoiceContent } from '@/types/block'
import { ref } from 'vue'
import type { BlockAnswer, TaskActionMode } from '../../lesson-player.types'
import TaskActions from './TaskActions.vue'

// ---------------------
// props / emits
// ---------------------

defineProps<{
	content: OneTrueChoiceContent
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

const selected = ref<string | null>(null)

const onSubmit = () => {
	if (selected.value === null) return
	emit('submit', { kind: 'choice', selected: selected.value })
}
</script>

<template>
	<div>
		<p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
			Choose the correct answer
		</p>
		<h2 class="text-2xl font-bold mb-6">
			{{ title || content.question }}
		</h2>
		<p v-if="title" class="text-lg mb-6">{{ content.question }}</p>

		<div class="flex flex-col gap-3">
			<button
				v-for="option in content.options"
				:key="option"
				type="button"
				class="w-full text-left px-5 py-4 rounded-xl border-2 transition-colors bg-card"
				:class="
					selected === option
						? 'border-primary text-primary font-semibold'
						: 'border-border hover:border-muted'
				"
				@click="selected = option"
			>
				{{ option }}
			</button>
		</div>

		<TaskActions
			:can-submit="selected !== null"
			:mode="mode"
			@submit="onSubmit"
			@secondary="emit('secondary')"
		/>
	</div>
</template>
