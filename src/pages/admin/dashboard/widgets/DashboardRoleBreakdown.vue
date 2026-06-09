<script setup lang="ts">
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import type { User } from '@/types/user'
import { computed } from 'vue'

// ---------------------
// props
// ---------------------
const props = defineProps<{
	usersByRole: Record<User['role'], number>
	totalLevels: number
}>()

// ---------------------
// derived
// ---------------------
const rows: { role: User['role']; variant: 'destructive' | 'warning' | 'secondary'; bar: string }[] = [
	{ role: 'ADMIN', variant: 'destructive', bar: 'bg-primary' },
	{ role: 'MODERATOR', variant: 'warning', bar: 'bg-accent' },
	{ role: 'USER', variant: 'secondary', bar: 'bg-secondary' },
]

const total = computed(() =>
	Object.values(props.usersByRole).reduce((sum, n) => sum + n, 0),
)

const widthOf = (value: number) =>
	`${total.value ? Math.round((value / total.value) * 100) : 0}%`
</script>

<template>
	<Card class="p-5 w-full">
		<h2 class="font-semibold text-lg mb-4">Users by role</h2>

		<div class="flex flex-col gap-3">
			<div v-for="row in rows" :key="row.role">
				<div class="flex items-center justify-between mb-1">
					<Badge :variant="row.variant">{{ row.role }}</Badge>
					<span class="text-sm font-bold text-muted-foreground">
						{{ usersByRole[row.role] }}
					</span>
				</div>
				<div class="h-2 w-full rounded-full bg-card-secondary overflow-hidden">
					<div
						:class="['h-full rounded-full transition-all', row.bar]"
						:style="{ width: widthOf(usersByRole[row.role]) }"
					/>
				</div>
			</div>
		</div>

		<div
			class="flex items-center justify-between mt-5 pt-4 border-t border-border"
		>
			<span class="text-sm text-muted-foreground">Language levels</span>
			<span class="text-sm font-bold">{{ totalLevels }}</span>
		</div>
	</Card>
</template>
