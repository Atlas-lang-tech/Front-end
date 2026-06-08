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
			variant="ghost"
			class="items-center px-4 py-2 rounded-lg justify-start gap-2 transition-all duration-300 cursor-pointer"
			:class="{
				'text-primary': isActive,
				'text-muted-foreground hover:text-foreground': !isActive,
			}"
			@click="navigate"
		>
			<Icon :name="props.icon" size="20" />
			{{ props.title }}
		</Button>
	</RouterLink>
</template>
