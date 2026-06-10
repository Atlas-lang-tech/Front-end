<script setup lang="ts">
import AdminBreadCrumbs from '@/components/admin/BreadCrumbs/AdminBreadCrumbs.vue'
import Sidebar from '@/components/user/SideBar/Sidebar.vue'
import ProfileMenu from '@/components/main/Navbar/widgets/ProfileMenu/ProfileMenu.vue'
import ThemeToggle from '@/shared/ui/theme-toggle/ThemeToggle.vue'
</script>

<template>
	<main class="flex h-svh overflow-hidden">
		<Sidebar />
		<div class="flex-1 flex flex-col min-h-0">
			<header
				class="h-16 shrink-0 border-b-2 flex items-center justify-between px-4"
			>
				<div>
					<AdminBreadCrumbs />
				</div>
				<div class="flex items-center">
					<ThemeToggle />
					<div class="w-[2px] h-10 rounded-full bg-border mx-2" />
					<ProfileMenu />
				</div>
			</header>
			<main class="flex-1 min-h-0 w-full overflow-auto">
				<div class="min-h-full px-10 py-5">
					<router-view />
				</div>
			</main>
		</div>
	</main>
</template>
