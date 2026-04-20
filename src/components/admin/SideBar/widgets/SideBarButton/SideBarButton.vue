<script setup lang="ts">
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'

const props = defineProps<{
	title: string
	icon: string
	path: string
}>()
</script>

<template>
	<RouterLink :to="props.path" custom v-slot="{ isActive, navigate }">
		<Button
			:variant="isActive ? 'default' : 'ghost'"
			class="w-full items-center px-5 py-3 rounded-lg justify-start gap-8 transition-all duration-300 text-muted-foreground cursor-pointer"
			:class="{
				'text-white': isActive,
				'hover:text-white bg-muted/5 hover:bg-muted/10': !isActive,
			}"
			@click="navigate"
		>
			<Icon :name="props.icon" size="32" />
			{{ props.title }}
		</Button>
	</RouterLink>
</template>
