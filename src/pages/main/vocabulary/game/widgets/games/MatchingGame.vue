<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import type { Word } from '@/types/vocabulary'
import { computed, ref } from 'vue'
import { shuffle } from '../../study-answer-check'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	pool: Word[]
}>()

const emit = defineEmits<{
	answer: [payload: { wordId: number; correct: boolean }]
	complete: [payload: { correct: number; total: number }]
}>()

// ---------------------
// batches
// ---------------------
const BATCH_SIZE = 6

const chunk = (arr: Word[], size: number): Word[][] => {
	const out: Word[][] = []
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
	return out
}

const batches = ref<Word[][]>(chunk(shuffle(props.pool), BATCH_SIZE))
const batchIndex = ref(0)
const currentBatch = computed(() => batches.value[batchIndex.value] ?? [])
const isLastBatch = computed(() => batchIndex.value >= batches.value.length - 1)

// ---------------------
// state
// ---------------------
const translations = ref<string[]>([])
const selectedWordId = ref<number | null>(null)
const pairs = ref<Record<number, string>>({})
const checked = ref(false)
const correctAcc = ref(0)
const totalAcc = ref(0)

const setupBatch = () => {
	translations.value = shuffle(currentBatch.value.map(w => w.translation))
	pairs.value = {}
	selectedWordId.value = null
	checked.value = false
}

setupBatch()

const usedTranslations = computed(() => new Set(Object.values(pairs.value)))
const allPaired = computed(() =>
	currentBatch.value.every(w => pairs.value[w.id] !== undefined),
)

// ---------------------
// interactions
// ---------------------
const chooseWord = (id: number) => {
	if (checked.value) return
	selectedWordId.value = selectedWordId.value === id ? null : id
}

const chooseTranslation = (t: string) => {
	if (checked.value || selectedWordId.value === null) return
	for (const id of Object.keys(pairs.value)) {
		if (pairs.value[Number(id)] === t) delete pairs.value[Number(id)]
	}
	pairs.value[selectedWordId.value] = t
	selectedWordId.value = null
}

const isWordCorrect = (w: Word) => pairs.value[w.id] === w.translation

const check = () => {
	if (checked.value || !allPaired.value) return
	checked.value = true
	let c = 0
	for (const w of currentBatch.value) {
		const correct = isWordCorrect(w)
		if (correct) c += 1
		emit('answer', { wordId: w.id, correct })
	}
	correctAcc.value += c
	totalAcc.value += currentBatch.value.length
}

const next = () => {
	if (!isLastBatch.value) {
		batchIndex.value += 1
		setupBatch()
	} else {
		emit('complete', { correct: correctAcc.value, total: totalAcc.value })
	}
}
</script>

<template>
	<div class="flex flex-col gap-6">
		<div class="text-center">
			<p class="text-sm text-muted-foreground">
				Match each word to its translation
			</p>
			<p class="text-xs text-muted mt-1">
				Batch {{ batchIndex + 1 }} of {{ batches.length }}
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<!-- words -->
			<div class="flex flex-col gap-3">
				<button
					v-for="w in currentBatch"
					:key="w.id"
					type="button"
					class="rounded-xl border-2 px-4 py-3 text-left transition-all duration-150"
					:class="[
						!checked && selectedWordId === w.id
							? 'border-primary bg-primary/10'
							: '',
						!checked && selectedWordId !== w.id
							? 'border-border bg-card hover:border-primary/40'
							: '',
						checked && isWordCorrect(w)
							? 'border-status-success bg-status-success/10'
							: '',
						checked && !isWordCorrect(w)
							? 'border-destructive bg-destructive/10'
							: '',
					]"
					@click="chooseWord(w.id)"
				>
					<span class="font-semibold">{{ w.word }}</span>
					<span
						v-if="pairs[w.id]"
						class="block text-xs mt-0.5"
						:class="
							checked && !isWordCorrect(w)
								? 'text-destructive'
								: 'text-muted-foreground'
						"
					>
						→ {{ pairs[w.id] }}
					</span>
					<span
						v-if="checked && !isWordCorrect(w)"
						class="block text-xs text-status-success mt-0.5"
					>
						✓ {{ w.translation }}
					</span>
				</button>
			</div>

			<!-- translations -->
			<div class="flex flex-col gap-3">
				<button
					v-for="t in translations"
					:key="t"
					type="button"
					:disabled="checked"
					class="rounded-xl border-2 px-4 py-3 text-left transition-all duration-150"
					:class="
						usedTranslations.has(t)
							? 'border-secondary/50 bg-secondary/10 text-muted-foreground'
							: 'border-border bg-card hover:border-primary/40'
					"
					@click="chooseTranslation(t)"
				>
					{{ t }}
				</button>
			</div>
		</div>

		<div class="flex justify-end">
			<Button v-if="!checked" :disabled="!allPaired" @click="check">
				Check
			</Button>
			<Button v-else @click="next">
				{{ isLastBatch ? 'Finish' : 'Next batch' }}
			</Button>
		</div>
	</div>
</template>
