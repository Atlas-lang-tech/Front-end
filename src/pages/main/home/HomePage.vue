<script setup lang="ts">
// ---------------------
// data
// ---------------------

import {
	continueLearning,
	dashboardStats,
	newsFeed,
	todaySchedule,
} from '@/app/data/main/DashboardData'
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { useUserStore } from '@/stores/user.store'
import { computed } from 'vue'
import GreetingHero from './widgets/GreetingHero.vue'
import NewsItem from './widgets/NewsItem.vue'
import StatCard from './widgets/StatCard.vue'

// ---------------------
// greeting
// ---------------------

const userStore = useUserStore()

const name = computed(() => userStore.user?.username ?? 'there')

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return 'Good morning'
	if (hour < 18) return 'Good afternoon'
	return 'Good evening'
})

const wish = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return 'A fresh day, a fresh chance to learn something new.'
	if (hour < 18) return 'Keep the momentum going — one more lesson today?'
	return 'Wind down with a quick lesson before the day ends.'
})

const today = computed(() =>
	new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date()),
)
</script>

<template>
	<div class="max-w-7xl mx-auto w-full px-6 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- left -->
			<div class="lg:col-span-2 flex flex-col gap-6">
				<GreetingHero
					:greeting="greeting"
					:name="name"
					:wish="wish"
					:date="today"
				/>

				<!-- stats -->
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						v-for="stat in dashboardStats"
						:key="stat.id"
						:title="stat.title"
						:value="stat.value"
						:icon="stat.icon"
						:color="stat.color"
					/>
				</div>

				<!-- continue learning -->
				<Card class="p-5">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-bold">Continue learning</h2>
						<RouterLink :to="$PAGES.main.myLearning">
							<Button variant="link" size="sm">View all</Button>
						</RouterLink>
					</div>

					<div class="flex items-center gap-4">
						<div
							class="flex items-center justify-center size-14 rounded-xl bg-card-secondary text-primary shrink-0"
						>
							<Icon :name="continueLearning.icon" :size="26" />
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<h3 class="font-semibold truncate">
									{{ continueLearning.title }}
								</h3>
								<Badge variant="outline">{{ continueLearning.level }}</Badge>
							</div>
							<p class="text-sm text-muted-foreground">
								{{ continueLearning.language }} ·
								{{ continueLearning.lessonsLeft }} lessons left
							</p>
							<div class="flex items-center gap-3 mt-3">
								<div
									class="flex-1 h-2 rounded-full bg-card-secondary overflow-hidden"
								>
									<div
										class="h-full rounded-full bg-primary transition-all"
										:style="{ width: `${continueLearning.progress}%` }"
									/>
								</div>
								<span class="text-sm font-medium text-muted-foreground">
									{{ continueLearning.progress }}%
								</span>
							</div>
						</div>
						<Button class="shrink-0">Resume</Button>
					</div>
				</Card>

				<!-- today schedule -->
				<Card class="p-5">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-bold">Today's schedule</h2>
						<Badge variant="secondary">{{ todaySchedule.length }} lessons</Badge>
					</div>

					<div class="flex flex-col">
						<div
							v-for="(item, i) in todaySchedule"
							:key="item.id"
							class="flex items-center gap-4 py-3"
							:class="{ 'border-t border-border': i > 0 }"
						>
							<div
								class="flex flex-col items-center justify-center text-center shrink-0 w-24 text-xs"
							>
								<span class="font-semibold text-foreground">
									{{ item.time.split(' — ')[0] }}
								</span>
								<span class="text-muted">{{ item.time.split(' — ')[1] }}</span>
							</div>
							<div class="w-px self-stretch bg-border" />
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-sm truncate">{{ item.title }}</h3>
								<p class="text-xs text-muted-foreground mt-0.5">
									{{ item.mentor }}
								</p>
							</div>
							<Badge variant="outline">{{ item.level }}</Badge>
						</div>
					</div>
				</Card>
			</div>

			<!-- right: news feed -->
			<div class="flex flex-col">
				<Card class="p-5">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-lg font-bold">What's new</h2>
						<Icon name="newspaper" :size="20" class="text-muted-foreground" />
					</div>
					<div class="flex flex-col divide-y divide-border">
						<NewsItem
							v-for="item in newsFeed"
							:key="item.id"
							:title="item.title"
							:excerpt="item.excerpt"
							:date="item.date"
							:tag="item.tag"
							:tag-variant="item.tagVariant"
						/>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>
