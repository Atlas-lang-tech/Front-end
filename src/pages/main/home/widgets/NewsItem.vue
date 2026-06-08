<script setup lang="ts">
// ---------------------
// props
// ---------------------

defineProps<{
	title: string
	excerpt: string
	date: string
	tag: string
	tagVariant: 'default' | 'success' | 'pending' | 'secondary'
}>()

import { Badge } from '@/shared/ui/badge'
</script>

<template>
	<div
		class="group cursor-pointer rounded-lg p-3 -mx-3 transition-colors hover:bg-card-secondary"
	>
		<div class="flex items-center justify-between gap-2 mb-1.5">
			<Badge :variant="tagVariant">{{ tag }}</Badge>
			<span class="text-xs text-muted">{{ date }}</span>
		</div>
		<h3 class="font-semibold text-sm group-hover:text-primary transition-colors">
			{{ title }}
		</h3>
		<p class="text-sm text-muted-foreground mt-0.5 line-clamp-2">
			{{ excerpt }}
		</p>
	</div>
</template>
