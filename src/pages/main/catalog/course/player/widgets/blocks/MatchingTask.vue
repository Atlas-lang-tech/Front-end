<script setup lang="ts">
import type { MatchingContent, MatchingPair } from '@/types/block'
import { computed, ref } from 'vue'
import type { BlockAnswer, TaskActionMode } from '../../lesson-player.types'
import TaskActions from './TaskActions.vue'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	content: MatchingContent
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

const shuffle = <T,>(items: T[]) => {
	const result = [...items]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

const rightItems = ref(shuffle(props.content.pairs.map(pair => pair.right)))

const pendingLeft = ref<string | null>(null)
const matched = ref<MatchingPair[]>([])

const matchedLeft = computed(() => matched.value.map(pair => pair.left))
const matchedRight = computed(() => matched.value.map(pair => pair.right))

const dissolveByLeft = (left: string) => {
	matched.value = matched.value.filter(pair => pair.left !== left)
}

const onLeftClick = (left: string) => {
	if (matchedLeft.value.includes(left)) {
		dissolveByLeft(left)
		return
	}
	pendingLeft.value = pendingLeft.value === left ? null : left
}

const onRightClick = (right: string) => {
	if (matchedRight.value.includes(right)) {
		matched.value = matched.value.filter(pair => pair.right !== right)
		return
	}
	if (pendingLeft.value === null) return
	matched.value = [...matched.value, { left: pendingLeft.value, right }]
	pendingLeft.value = null
}

const pairNumber = (side: 'left' | 'right', value: string) => {
	const index = matched.value.findIndex(pair => pair[side] === value)
	return index === -1 ? null : index + 1
}

const canSubmit = computed(
	() => matched.value.length === props.content.pairs.length,
)

const onSubmit = () => {
	if (!canSubmit.value) return
	emit('submit', { kind: 'matching', pairs: matched.value })
}
</script>

<template>
	<div>
		<p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
			Match the pairs
		</p>
		<h2 v-if="title" class="text-2xl font-bold mb-4">{{ title }}</h2>
		<p class="text-sm text-muted-foreground mb-6">
			Select an item on the left, then its match on the right. Click a matched
			item to undo.
		</p>

		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<button
					v-for="pair in content.pairs"
					:key="pair.left"
					type="button"
					class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 text-left transition-colors bg-card"
					:class="
						matchedLeft.includes(pair.left)
							? 'border-status-success text-status-success'
							: pendingLeft === pair.left
								? 'border-primary text-primary font-semibold'
								: 'border-border hover:border-muted'
					"
					@click="onLeftClick(pair.left)"
				>
					<span>{{ pair.left }}</span>
					<span
						v-if="pairNumber('left', pair.left)"
						class="text-xs font-bold shrink-0"
					>
						{{ pairNumber('left', pair.left) }}
					</span>
				</button>
			</div>

			<div class="flex flex-col gap-3">
				<button
					v-for="right in rightItems"
					:key="right"
					type="button"
					class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 text-left transition-colors bg-card"
					:class="
						matchedRight.includes(right)
							? 'border-status-success text-status-success'
							: 'border-border hover:border-muted'
					"
					@click="onRightClick(right)"
				>
					<span>{{ right }}</span>
					<span
						v-if="pairNumber('right', right)"
						class="text-xs font-bold shrink-0"
					>
						{{ pairNumber('right', right) }}
					</span>
				</button>
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
