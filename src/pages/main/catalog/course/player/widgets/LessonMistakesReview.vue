<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'
import { describeAnswer } from '../answer-display.ts'
import type { MistakeItem } from '../lesson-player.types'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	mistakes: MistakeItem[]
}>()

const emit = defineEmits<{
	close: []
}>()

// ---------------------
// review items
// ---------------------

const items = computed(() =>
	props.mistakes.map(({ record, block }) => ({
		blockId: record.blockId,
		unanswered: record.unanswered,
		...describeAnswer(block, record),
	})),
)
</script>

<template>
	<Card class="max-w-xl mx-auto p-8">
		<div class="text-center mb-6">
			<h2 class="text-2xl font-bold">Review your mistakes</h2>
			<p class="text-muted-foreground mt-1">
				{{ items.length }}
				{{ items.length === 1 ? 'task' : 'tasks' }} to look over.
			</p>
		</div>

		<div class="flex flex-col gap-4">
			<div
				v-for="item in items"
				:key="item.blockId"
				class="rounded-xl border border-border p-4"
			>
				<div class="flex items-start justify-between gap-3 mb-3">
					<p class="font-medium">{{ item.prompt }}</p>
					<Badge v-if="item.unanswered" variant="pending" class="shrink-0">
						Unanswered
					</Badge>
				</div>

				<div class="flex items-start gap-2 text-sm">
					<Icon
						name="x"
						:size="16"
						class="text-status-error mt-0.5 shrink-0"
					/>
					<div>
						<span class="text-muted">Your answer: </span>
						<span class="text-status-error">{{ item.userAnswer }}</span>
					</div>
				</div>

				<div class="flex items-start gap-2 text-sm mt-1.5">
					<Icon
						name="check"
						:size="16"
						class="text-status-success mt-0.5 shrink-0"
					/>
					<div>
						<span class="text-muted">Correct answer: </span>
						<span class="text-status-success">{{ item.correctAnswer }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-center mt-8">
			<Button variant="ghost" @click="emit('close')">
				<Icon name="arrow-left" :size="16" />
				Back to result
			</Button>
		</div>
	</Card>
</template>
