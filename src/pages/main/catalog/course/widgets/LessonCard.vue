<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import type { Lesson } from '@/types/lesson'

// ---------------------
// props
// ---------------------

defineProps<{
	lesson: Lesson
	index: number
	locked: boolean
	completed: boolean
}>()
</script>

<template>
	<Card
		class="flex items-center gap-4 p-5 transition-shadow"
		:class="locked ? 'opacity-60' : 'hover:shadow-md'"
	>
		<div
			class="flex items-center justify-center size-11 shrink-0 rounded-full font-bold"
			:class="
				completed
					? 'bg-status-success/10 text-status-success'
					: 'bg-card-secondary text-primary'
			"
		>
			<Icon v-if="completed" name="check" :size="20" />
			<template v-else>{{ index + 1 }}</template>
		</div>

		<div class="flex-1 min-w-0">
			<h3 class="font-semibold truncate">{{ lesson.title }}</h3>
			<p
				v-if="lesson.description"
				class="text-sm text-muted-foreground truncate"
			>
				{{ lesson.description }}
			</p>
		</div>

		<Button v-if="locked" disabled variant="ghost" class="shrink-0">
			<Icon name="lock" :size="16" />
			Locked
		</Button>
		<RouterLink
			v-else
			:to="$PAGES.main.lesson(lesson.courseId, lesson.id)"
			class="shrink-0"
		>
			<Button>
				Start lesson
				<Icon name="arrow-right" :size="16" />
			</Button>
		</RouterLink>
	</Card>
</template>
