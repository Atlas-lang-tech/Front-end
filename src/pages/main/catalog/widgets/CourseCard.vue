<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import CourseIcon from '@/components/course/CourseIcon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
// ---------------------
// props
// ---------------------

defineProps<{
	id: string
	title: string
	description: string
	icon: string
	languageName: string
	languageIcon: string
	levelName: string
	categoryName?: string
}>()
</script>

<template>
	<Card class="flex flex-col p-5 h-full transition-shadow hover:shadow-md">
		<div class="flex items-start justify-between mb-4">
			<div
				class="flex items-center justify-center size-12 rounded-xl bg-card-secondary text-primary"
			>
				<CourseIcon :name="icon" :size="24" />
			</div>
			<Badge variant="outline">{{ languageIcon }} {{ languageName }}</Badge>
		</div>

		<h3 class="text-lg font-bold mb-1">{{ title }}</h3>
		<p class="text-sm text-muted-foreground flex-1">{{ description }}</p>

		<div class="flex flex-wrap items-center gap-2 mt-4">
			<Badge variant="success">{{ levelName }}</Badge>
			<Badge v-if="categoryName" variant="secondary">{{ categoryName }}</Badge>
		</div>

		<RouterLink :to="$PAGES.main.course(id)" class="mt-5">
			<Button class="w-full">View course</Button>
		</RouterLink>
	</Card>
</template>
