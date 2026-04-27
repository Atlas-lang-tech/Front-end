<script setup lang="ts">
import { Toaster } from '@/shared/ui/sonner'

const savedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = savedTheme ?? (prefersDark ? 'dark' : 'light')
document.documentElement.setAttribute('data-theme', theme)
</script>

<template>
	<RouterView />
	<Teleport to="body">
		<Toaster />
	</Teleport>
</template>
