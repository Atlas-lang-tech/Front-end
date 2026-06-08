<script setup lang="ts">
// ---------------------
// props
// ---------------------

defineProps<{
	greeting: string
	name: string
	wish: string
	date: string
}>()

import Icon from '@/shared/icon.vue'
</script>

<template>
	<div
		class="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent text-white p-6"
	>
		<div
			class="absolute -right-8 -top-10 size-40 rounded-full bg-white/10"
		/>
		<div
			class="absolute -right-2 top-16 size-24 rounded-full bg-white/10"
		/>

		<div class="relative">
			<div class="flex items-center gap-2 text-white/80 text-sm mb-3">
				<Icon name="calendar-days" :size="16" />
				{{ date }}
			</div>
			<h1 class="text-3xl font-bold">{{ greeting }}, {{ name }} 👋</h1>
			<p class="text-white/80 mt-1">{{ wish }}</p>
		</div>
	</div>
</template>
