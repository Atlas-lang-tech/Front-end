<script setup lang="ts">
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'

// ---------------------
// mock data
// ---------------------
const data = [
	{ day: 'Mon', value: 32 },
	{ day: 'Tue', value: 48 },
	{ day: 'Wed', value: 41 },
	{ day: 'Thu', value: 64 },
	{ day: 'Fri', value: 57 },
	{ day: 'Sat', value: 73 },
	{ day: 'Sun', value: 38 },
]

const max = computed(() => Math.max(...data.map(d => d.value)))

const heightOf = (value: number) => `${Math.round((value / max.value) * 100)}%`
</script>

<template>
	<Card class="p-5 w-full border-dashed">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-semibold text-lg">Weekly activity</h2>
			<Badge variant="warning">Test data</Badge>
		</div>

		<div class="flex items-end justify-between gap-3 h-44">
			<div
				v-for="item in data"
				:key="item.day"
				class="flex flex-col items-center gap-2 flex-1 h-full"
			>
				<div class="flex-1 w-full flex items-end">
					<div
						class="w-full rounded-md bg-primary/80 hover:bg-primary transition-all"
						:style="{ height: heightOf(item.value) }"
					/>
				</div>
				<span class="text-xs text-muted-foreground">{{ item.day }}</span>
			</div>
		</div>
	</Card>
</template>
