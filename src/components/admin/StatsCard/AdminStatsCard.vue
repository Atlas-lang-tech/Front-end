<script lang="ts" setup>
import Icon from '@/shared/icon.vue'
import { Card } from '@/shared/ui/card'
import { computed } from 'vue'

const props = defineProps<{
	title: string
	value: string | number
	icon: string
	color: string
}>()

const colorClasses = computed(() => {
	const colors: Record<string, string> = {
		blue: 'bg-blue-500/15 text-blue-500',
		green: 'bg-green-500/15 text-green-500',
		red: 'bg-red-500/15 text-red-500',
		yellow: 'bg-yellow-500/15 text-yellow-500',
		purple: 'bg-purple-500/15 text-purple-500',
		orange: 'bg-orange-500/15 text-orange-500',
		pink: 'bg-pink-500/15 text-pink-500',
		cyan: 'bg-cyan-500/15 text-cyan-500',
	}
	return colors[props.color] || colors.blue
})
</script>

<template>
	<Card class="w-80 h-32 p-5 flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-medium font-mono text-muted-foreground">
				{{ title.toUpperCase() }}
			</h2>
			<div :class="['rounded-md p-2', colorClasses]">
				<Icon :name="icon" class="w-5 h-5" />
			</div>
		</div>
		<div class="text-2xl font-bold mt-auto">{{ value }}</div>
	</Card>
</template>
