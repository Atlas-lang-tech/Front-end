<script setup lang="ts">
// ---------------------
// props
// ---------------------

const props = defineProps<{
	title: string
	value: string
	icon: string
	color: 'blue' | 'green' | 'orange' | 'red'
}>()

import { Card } from '@/shared/ui/card'
import Icon from '@/shared/icon.vue'
import { computed } from 'vue'

// ---------------------
// color
// ---------------------

const colorClass = computed(
	() =>
		({
			blue: 'bg-secondary/10 text-secondary',
			green: 'bg-status-success/10 text-status-success',
			orange: 'bg-accent/10 text-accent',
			red: 'bg-primary/10 text-primary',
		})[props.color],
)
</script>

<template>
	<Card class="flex items-center gap-4 p-4">
		<div
			class="flex items-center justify-center size-11 rounded-xl shrink-0"
			:class="colorClass"
		>
			<Icon :name="icon" :size="22" />
		</div>
		<div class="flex flex-col">
			<span class="text-2xl font-bold leading-none">{{ value }}</span>
			<span class="text-sm text-muted-foreground mt-1">{{ title }}</span>
		</div>
	</Card>
</template>
