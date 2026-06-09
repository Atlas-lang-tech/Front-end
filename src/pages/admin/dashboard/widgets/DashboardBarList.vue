<script setup lang="ts">
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'

// ---------------------
// props
// ---------------------
const props = withDefaults(
	defineProps<{
		title: string
		items: { label: string; value: number }[]
		color?: string
	}>(),
	{
		color: 'bg-primary',
	},
)

// ---------------------
// derived
// ---------------------
const sorted = computed(() =>
	[...props.items].sort((a, b) => b.value - a.value),
)

const max = computed(() =>
	Math.max(1, ...props.items.map(item => item.value)),
)

const widthOf = (value: number) => `${Math.round((value / max.value) * 100)}%`
</script>

<template>
	<Card class="p-5 w-full">
		<h2 class="font-semibold text-lg mb-4">{{ title }}</h2>

		<div v-if="sorted.length" class="flex flex-col gap-3">
			<div v-for="item in sorted" :key="item.label">
				<div class="flex items-center justify-between mb-1">
					<span class="text-sm font-medium truncate">{{ item.label }}</span>
					<span class="text-sm font-bold text-muted-foreground">
						{{ item.value }}
					</span>
				</div>
				<div class="h-2 w-full rounded-full bg-card-secondary overflow-hidden">
					<div
						:class="['h-full rounded-full transition-all', color]"
						:style="{ width: widthOf(item.value) }"
					/>
				</div>
			</div>
		</div>

		<div
			v-else
			class="text-sm text-muted py-8 text-center"
		>
			No data
		</div>
	</Card>
</template>
