<script setup lang="ts">
import MainNavbar from '@/components/main/Navbar/MainNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
	<div class="flex flex-col h-svh overflow-hidden">
		<MainNavbar />
		<main class="flex-1 overflow-auto">
			<RouterView />
		</main>
	</div>
</template>
