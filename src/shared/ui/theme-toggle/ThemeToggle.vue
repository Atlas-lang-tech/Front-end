<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import { Moon, Sun } from 'lucide-vue-next'
import { ref } from 'vue'

const isDark = ref(
	document.documentElement.getAttribute('data-theme') === 'dark',
)

const toggleTheme = () => {
	isDark.value = !isDark.value
	const theme = isDark.value ? 'dark' : 'light'
	document.documentElement.setAttribute('data-theme', theme)
	localStorage.setItem('theme', theme)
}
</script>

<template>
	<Button
		size="icon"
		variant="ghost"
		@click="toggleTheme"
		aria-label="Toggle Theme"
		class="cursor-pointer"
	>
		<Sun v-if="!isDark" class="size-5 text-foreground" />
		<Moon v-else class="size-5 text-foreground" />
	</Button>
</template>
