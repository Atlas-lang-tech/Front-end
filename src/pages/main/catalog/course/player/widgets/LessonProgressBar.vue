<script setup lang="ts">
import { Badge } from '@/shared/ui/badge'
import { computed } from 'vue'
import type { LessonPlayerPhase } from '../lesson-player.types'

// ---------------------
// props
// ---------------------

const props = defineProps<{
	current: number
	total: number
	phase: LessonPlayerPhase
}>()

// ---------------------
// progress
// ---------------------

const percent = computed(() =>
	props.total === 0 ? 0 : Math.round((props.current / props.total) * 100),
)
</script>

<template>
	<div class="mb-8">
		<div class="flex items-center justify-between mb-2">
			<Badge v-if="phase === 'review'" variant="pending">
				Reviewing skipped tasks
			</Badge>
			<span v-else class="text-sm text-muted-foreground">Progress</span>
			<span class="text-sm font-medium text-muted-foreground">
				{{ current }} / {{ total }}
			</span>
		</div>
		<div class="h-2.5 rounded-full bg-card-secondary overflow-hidden">
			<div
				class="h-full rounded-full bg-primary transition-all duration-300"
				:style="{ width: `${percent}%` }"
			/>
		</div>
	</div>
</template>
