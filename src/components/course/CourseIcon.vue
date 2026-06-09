<script setup lang="ts">
import Icon from '@/shared/icon.vue'

// ---------------------
// props
// ---------------------
withDefaults(
	defineProps<{
		name: string
		size?: number | string
	}>(),
	{
		size: 24,
	},
)
</script>

<template>
	<Icon :name="name" :size="size">
		<span class="text-sm font-medium leading-none">{{ name || '—' }}</span>
	</Icon>
</template>
