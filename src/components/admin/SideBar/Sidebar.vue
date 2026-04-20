<script setup lang="ts">
import { sideBarData } from '@/app/data/admin/SideBarData'
import { Button } from '@/shared/ui/button'
import { ArrowLeftToLine, ChevronDown } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import SideBarButton from './widgets/SideBarButton/SideBarButton.vue'

const savedCategories = localStorage.getItem('collapsedCategories')

const collapsedCategories = ref<Record<string, boolean>>(
	savedCategories ? JSON.parse(savedCategories) : {},
)

watch(
	collapsedCategories,
	newVal => {
		localStorage.setItem('collapsedCategories', JSON.stringify(newVal))
	},
	{ deep: true },
)

const toggleCategory = (title: string) => {
	collapsedCategories.value[title] = !collapsedCategories.value[title]
}
</script>

<template>
	<aside
		class="w-72 bg-card h-screen border-r-2 border-border flex flex-col items-center"
	>
		<div class="my-5 flex gap-3 items-center">
			<img src="/logo.svg" alt="Admin Panel Logo" class="w-16 h-16" />
			<div>
				<h1 class="text-3xl font-bold -mb-2">Pandas</h1>
				<h1 class="font-semibold ml-0.5">
					<span class="text-primary">Admin</span> Panel
				</h1>
			</div>
		</div>
		<section class="flex flex-col gap-5 overflow-auto h-[1000rem]">
			<div v-for="category in sideBarData" :key="category.title" class="w-56">
				<button
					class="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-primary transition-colors"
					@click="toggleCategory(category.title)"
				>
					{{ category.title }}
					<span
						:class="{
							'rotate-180': collapsedCategories[category.title],
						}"
						class="transition-transform duration-200"
					>
						<ChevronDown :size="18" />
					</span>
				</button>
				<div
					v-show="!collapsedCategories[category.title]"
					v-for="button in category.buttons"
					:key="button.title"
					class="flex flex-col gap-3"
				>
					<div :class="category.buttons.length > 1 ? 'mb-3' : ''">
						<SideBarButton
							:title="button.title"
							:icon="button.icon"
							:path="button.path"
						/>
					</div>
				</div>
			</div>
		</section>

		<RouterLink
			to="/user/profile"
			class="h-full flex flex-col justify-end mb-5 w-full px-10"
		>
			<Button variant="destructive"> Go back <ArrowLeftToLine /></Button>
		</RouterLink>
	</aside>
</template>
