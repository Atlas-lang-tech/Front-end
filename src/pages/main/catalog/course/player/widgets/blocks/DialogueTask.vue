<script setup lang="ts">
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import type { DialogueContent } from '@/types/block'
import { computed, ref } from 'vue'
import type { BlockAnswer, TaskActionMode } from '../../lesson-player.types'
import TaskActions from './TaskActions.vue'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	content: DialogueContent
	title: string | null
	mode: TaskActionMode
}>()

const emit = defineEmits<{
	submit: [answer: BlockAnswer]
	secondary: []
}>()

// ---------------------
// content
// ---------------------

const lines = computed(() => props.content.dialogue.map(line => String(line)))

// ---------------------
// answer
// ---------------------

const answers = ref<string[]>(props.content.questions.map(() => ''))

const canSubmit = computed(() =>
	answers.value.every(answer => answer.trim().length > 0),
)

const onSubmit = () => {
	if (!canSubmit.value) return
	emit('submit', { kind: 'dialogue', answers: answers.value })
}
</script>

<template>
	<div>
		<p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
			Read the dialogue and answer the questions
		</p>
		<h2 v-if="title" class="text-2xl font-bold mb-4">{{ title }}</h2>

		<div class="flex flex-col gap-2 mb-6">
			<div
				v-for="(line, index) in lines"
				:key="index"
				class="max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-relaxed"
				:class="
					index % 2 === 0
						? 'self-start bg-card-secondary rounded-bl-sm'
						: 'self-end bg-secondary/10 rounded-br-sm'
				"
			>
				{{ line }}
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div
				v-for="(question, index) in content.questions"
				:key="index"
				class="flex flex-col gap-1.5"
			>
				<Label>{{ question.question }}</Label>
				<Input v-model="answers[index]" placeholder="Type your answer..." />
			</div>
		</div>

		<TaskActions
			:can-submit="canSubmit"
			:mode="mode"
			@submit="onSubmit"
			@secondary="emit('secondary')"
		/>
	</div>
</template>
