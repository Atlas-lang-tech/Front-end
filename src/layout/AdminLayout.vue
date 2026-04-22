<script setup lang="ts">
import Sidebar from '@/components/admin/SideBar/Sidebar.vue'
import ThemeToggle from '@/shared/ui/theme-toggle/ThemeToggle.vue'
</script>

<template>
	<main class="flex h-svh overflow-hidden">
		<Sidebar />
		<div class="flex-1">
			<header class="h-16 border-b-2 flex items-center justify-between px-4">
				<div>Admin Panel</div>
				<ThemeToggle />
			</header>
			<main class="p-10 h-screen w-full overflow-auto">
				<router-view />
			</main>
		</div>
	</main>
</template>
