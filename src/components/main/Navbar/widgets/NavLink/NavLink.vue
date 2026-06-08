<script setup lang="ts">
import Icon from '@/shared/icon.vue'

const props = defineProps<{
	title: string
	icon: string
	path: string
}>()
</script>

<template>
	<RouterLink :to="props.path" custom v-slot="{ isActive, navigate }">
		<button
			class="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer"
			:class="
				isActive
					? 'bg-primary text-white'
					: 'text-muted-foreground hover:text-foreground'
			"
			@click="navigate"
		>
			<span
				class="grid place-items-center overflow-hidden transition-all duration-300 ease-out"
				:class="isActive ? 'w-[18px] mr-2 opacity-100' : 'w-0 mr-0 opacity-0'"
			>
				<Icon :name="props.icon" :size="18" />
			</span>
			{{ props.title }}
		</button>
	</RouterLink>
</template>
