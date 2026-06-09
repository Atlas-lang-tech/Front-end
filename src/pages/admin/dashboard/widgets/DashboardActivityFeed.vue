<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'

// ---------------------
// mock data
// ---------------------
const events = [
	{
		icon: 'user-plus',
		color: 'bg-blue-500/15 text-blue-500',
		text: 'New user registered',
		time: '2m ago',
	},
	{
		icon: 'book-open',
		color: 'bg-orange-500/15 text-orange-500',
		text: 'Course "Spanish A1" published',
		time: '1h ago',
	},
	{
		icon: 'graduation-cap',
		color: 'bg-green-500/15 text-green-500',
		text: 'User completed a lesson',
		time: '3h ago',
	},
	{
		icon: 'languages',
		color: 'bg-cyan-500/15 text-cyan-500',
		text: 'New language added',
		time: 'Yesterday',
	},
	{
		icon: 'shield',
		color: 'bg-purple-500/15 text-purple-500',
		text: 'Role changed to MODERATOR',
		time: 'Yesterday',
	},
]
</script>

<template>
	<Card class="p-5 w-full border-dashed">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-semibold text-lg">Recent activity</h2>
			<Badge variant="warning">Test data</Badge>
		</div>

		<div class="flex flex-col gap-4">
			<div
				v-for="(event, i) in events"
				:key="i"
				class="flex items-center gap-3"
			>
				<div :class="['rounded-md p-2 shrink-0', event.color]">
					<Icon :name="event.icon" class="w-4 h-4" />
				</div>
				<span class="text-sm flex-1">{{ event.text }}</span>
				<span class="text-xs text-muted shrink-0">{{ event.time }}</span>
			</div>
		</div>
	</Card>
</template>
