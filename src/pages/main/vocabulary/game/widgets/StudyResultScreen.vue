<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	correct: number
	total: number
}>()

const emit = defineEmits<{
	retry: []
	back: []
}>()

// ---------------------
// score
// ---------------------
const percent = computed(() =>
	props.total === 0 ? 100 : Math.round((props.correct / props.total) * 100),
)
</script>

<template>
	<Card class="p-10 text-center flex flex-col items-center gap-4">
		<div
			class="size-16 rounded-full bg-status-success/10 text-status-success flex items-center justify-center"
		>
			<Icon name="party-popper" :size="32" />
		</div>
		<h2 class="text-2xl font-bold">Session complete!</h2>
		<p class="text-muted-foreground">
			You answered
			<span class="text-foreground font-semibold">{{ correct }}</span>
			of
			<span class="text-foreground font-semibold">{{ total }}</span>
			correctly ({{ percent }}%).
		</p>

		<div class="flex items-center gap-3 mt-4">
			<Button variant="ghost" @click="emit('back')">Back to hub</Button>
			<Button @click="emit('retry')">
				<Icon name="rotate-ccw" :size="16" class="mr-1.5" />
				Practice again
			</Button>
		</div>
	</Card>
</template>
