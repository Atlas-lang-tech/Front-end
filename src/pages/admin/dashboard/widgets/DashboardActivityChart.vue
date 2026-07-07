<script setup lang="ts">
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'

// ---------------------
// props
// ---------------------
const props = withDefaults(
	defineProps<{
		title?: string
		items: { label: string; value: number }[]
	}>(),
	{
		title: 'Weekly activity',
	},
)

const max = computed(() =>
	Math.max(1, ...props.items.map(item => item.value)),
)

const heightOf = (value: number) => `${Math.round((value / max.value) * 100)}%`
</script>

<template>
	<Card class="p-5 w-full">
		<h2 class="font-semibold text-lg mb-4">{{ title }}</h2>

		<div class="flex items-end justify-between gap-3 h-44">
			<div
				v-for="item in items"
				:key="item.label"
				class="flex flex-col items-center gap-2 flex-1 h-full"
			>
				<div class="flex-1 w-full flex items-end">
					<div
						class="w-full rounded-md bg-primary/80 hover:bg-primary transition-all"
						:style="{ height: heightOf(item.value) }"
					/>
				</div>
				<span class="text-xs text-muted-foreground">{{ item.label }}</span>
			</div>
		</div>
	</Card>
</template>
