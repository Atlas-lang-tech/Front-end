<script setup lang="ts">
import AdminBreadCrumbs from '@/components/admin/BreadCrumbs/AdminBreadCrumbs.vue'
import Sidebar from '@/components/admin/SideBar/Sidebar.vue'
import ThemeToggle from '@/shared/ui/theme-toggle/ThemeToggle.vue'
import { User } from 'lucide-vue-next'
</script>

<template>
	<main class="flex h-svh overflow-hidden">
		<Sidebar />
		<div class="flex-1">
			<header class="h-16 border-b-2 flex items-center justify-between px-4">
				<div>
					<AdminBreadCrumbs />
				</div>
				<div class="flex items-center">
					<ThemeToggle />
					<div class="w-[2px] h-10 rounded-full bg-border mx-2" />
					<div class="flex items-center gap-2 bg-primary rounded-md p-2.5">
						<User class="w-5 h-5 text-muted-foreground" />
					</div>
				</div>
			</header>
			<main class="p-10 h-screen w-full overflow-auto">
				<router-view />
			</main>
		</div>
	</main>
</template>
