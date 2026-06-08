<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import { navData } from '@/app/data/main/NavData'
import { Button } from '@/shared/ui/button'
import ThemeToggle from '@/shared/ui/theme-toggle/ThemeToggle.vue'
import { Bell } from 'lucide-vue-next'
import NavLink from './widgets/NavLink/NavLink.vue'
import ProfileMenu from './widgets/ProfileMenu/ProfileMenu.vue'
</script>

<template>
	<header class="relative h-16 mt-2 flex items-center justify-between px-6">
		<RouterLink :to="$PAGES.main.index" class="flex items-center gap-1">
			<img src="/logo.svg" alt="Pandas Logo" class="w-16 h-16" />
			<h1 class="text-xl font-bold">Pandas</h1>
		</RouterLink>

		<nav
			class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-card-secondary p-2 bg-card"
		>
			<NavLink
				v-for="item in navData"
				:key="item.title"
				:title="item.title"
				:icon="item.icon"
				:path="item.path"
			/>
		</nav>

		<div class="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				class="relative"
				aria-label="Notifications"
			>
				<Bell class="w-5 h-5" />
				<span
					class="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary ring-2 ring-card"
				/>
			</Button>
			<ThemeToggle />
			<div class="w-[2px] h-8 rounded-full bg-border mx-2" />
			<ProfileMenu />
		</div>
	</header>
</template>
