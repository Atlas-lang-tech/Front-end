<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Card } from '@/shared/ui/card'

// ---------------------
// props
// ---------------------
defineProps<{
	title: string
	description: string
	icon: string
	to: string
	disabled?: boolean
}>()
</script>

<template>
	<component
		:is="disabled ? 'div' : 'RouterLink'"
		:to="disabled ? undefined : to"
	>
		<Card
			class="p-5 h-full flex flex-col gap-3 transition-all duration-150"
			:class="
				disabled
					? 'opacity-50 cursor-not-allowed'
					: 'hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer'
			"
		>
			<div
				class="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
			>
				<Icon :name="icon" :size="24" />
			</div>
			<h3 class="text-lg font-semibold">{{ title }}</h3>
			<p class="text-sm text-muted-foreground">{{ description }}</p>
		</Card>
	</component>
</template>
