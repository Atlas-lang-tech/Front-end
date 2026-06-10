<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config.ts'
import { userSideBarData } from '@/app/data/user/SideBarData'
import SideBarButton from '@/components/admin/SideBar/widgets/SideBarButton/SideBarButton.vue'
</script>

<template>
	<aside
		class="w-72 bg-card h-screen border-r-2 border-border flex flex-col items-center"
	>
		<RouterLink :to="$PAGES.main.index">
			<div class="my-5 flex gap-3 items-center">
				<img src="/logo.svg" alt="Pandas Logo" class="w-16 h-16" />
				<div>
					<h1 class="text-3xl font-bold -mb-2">Pandas</h1>
					<h1 class="font-semibold ml-0.5">
						<span class="text-primary">Account</span>
					</h1>
				</div>
			</div>
		</RouterLink>
		<section class="flex flex-col gap-5 overflow-auto flex-1 w-56">
			<div v-for="category in userSideBarData" :key="category.title">
				<h2 class="text-sm font-semibold mb-2">{{ category.title }}</h2>
				<div class="flex flex-col gap-3">
					<SideBarButton
						v-for="button in category.buttons"
						:key="button.title"
						:title="button.title"
						:icon="button.icon"
						:path="button.path"
					/>
				</div>
			</div>
		</section>
		<div class="w-56 mb-5">
			<SideBarButton title="Home" icon="house" :path="$PAGES.main.index" />
		</div>
	</aside>
</template>
