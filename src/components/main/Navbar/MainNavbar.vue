<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import { navData } from '@/app/data/main/NavData'
import ThemeToggle from '@/shared/ui/theme-toggle/ThemeToggle.vue'
import NavLink from './widgets/NavLink/NavLink.vue'
import ProfileMenu from './widgets/ProfileMenu/ProfileMenu.vue'
</script>

<template>
	<header
		class="h-16 border-b-2 border-border flex items-center justify-between px-6 bg-card"
	>
		<div class="flex items-center gap-8">
			<RouterLink :to="$PAGES.main.catalog" class="flex items-center gap-3">
				<img src="/logo.svg" alt="Pandas Logo" class="w-10 h-10" />
				<h1 class="text-2xl font-bold">Pandas</h1>
			</RouterLink>

			<nav class="flex items-center gap-1">
				<NavLink
					v-for="item in navData"
					:key="item.title"
					:title="item.title"
					:icon="item.icon"
					:path="item.path"
				/>
			</nav>
		</div>

		<div class="flex items-center">
			<ThemeToggle />
			<div class="w-[2px] h-10 rounded-full bg-border mx-3" />
			<ProfileMenu />
		</div>
	</header>
</template>
