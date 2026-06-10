<script setup lang="ts">
import { Input } from '@/shared/ui/input'
import type {
	Block,
	ErrorCorrectionContent,
	FillInBlankContent,
	ManualAnswerContent,
	RephrasingContent,
	TranslationContent,
} from '@/types/block'
import { computed, ref } from 'vue'
import type { BlockAnswer, TaskActionMode } from '../../lesson-player.types'
import TaskActions from './TaskActions.vue'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	block: Block
	mode: TaskActionMode
}>()

const emit = defineEmits<{
	submit: [answer: BlockAnswer]
	secondary: []
}>()

// ---------------------
// content
// ---------------------

type TextContent =
	| FillInBlankContent
	| ManualAnswerContent
	| TranslationContent
	| RephrasingContent
	| ErrorCorrectionContent

const content = computed(() => props.block.content as TextContent)

const instruction = computed(() => {
	switch (props.block.type) {
		case 'FILL_IN_BLANK':
			return 'Fill in the blank'
		case 'MANUAL_ANSWER':
			return 'Answer the question'
		case 'TRANSLATION':
			return `Translate to ${(content.value as TranslationContent).translateTo}`
		case 'REPHRASING':
			return 'Rephrase the sentence'
		case 'ERROR_CORRECTION':
			return 'Find and correct the error'
		default:
			return 'Type your answer'
	}
})

const errorText = computed(() =>
	props.block.type === 'ERROR_CORRECTION'
		? (content.value as ErrorCorrectionContent).errorText
		: null,
)

// ---------------------
// answer
// ---------------------

const text = ref('')

const canSubmit = computed(() => text.value.trim().length > 0)

const onSubmit = () => {
	if (!canSubmit.value) return
	emit('submit', { kind: 'text', text: text.value })
}
</script>

<template>
	<div>
		<p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
			{{ instruction }}
		</p>
		<h2 v-if="block.title" class="text-2xl font-bold mb-4">
			{{ block.title }}
		</h2>

		<div class="bg-card-secondary rounded-xl px-5 py-4 mb-6">
			<p class="text-lg leading-relaxed">{{ content.text }}</p>
			<p v-if="errorText" class="mt-2 text-status-error font-medium">
				{{ errorText }}
			</p>
		</div>

		<Input
			v-model="text"
			placeholder="Type your answer..."
			@keydown.enter="onSubmit"
		/>

		<TaskActions
			:can-submit="canSubmit"
			:mode="mode"
			@submit="onSubmit"
			@secondary="emit('secondary')"
		/>
	</div>
</template>
