<script setup lang="ts">
import { useDictionaryGetByUser } from '@/api/vocabulary/dictionaries/get/byUser/useDictionaryGetByUser'
import { $PAGES } from '@/app/configs/pages.config'
import { useUserStore } from '@/stores/user.store'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// ---------------------
// store
// ---------------------
const { user } = storeToRefs(useUserStore())
const userId = computed(() => user.value?.id ?? '')

// ---------------------
// api
// ---------------------
const { state, asyncStatus } = useDictionaryGetByUser(userId)

const dictionaries = computed(() => state.value.data?.data ?? [])
</script>

<template>
	<div class="max-w-5xl mx-auto w-full px-6 py-8">
		<div class="flex items-center justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold">Study Vocabulary</h1>
				<p class="text-muted-foreground text-sm mt-1">
					Pick a dictionary to start practicing.
				</p>
			</div>
			<RouterLink :to="$PAGES.user.vocabulary">
				<Button variant="ghost" class="gap-1.5">
					<Icon name="settings" :size="16" />
					Manage
				</Button>
			</RouterLink>
		</div>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-36 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading dictionaries
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!dictionaries.length"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No dictionaries yet</p>
			<p class="text-muted text-sm mt-1">
				Create a dictionary first to start studying.
			</p>
			<RouterLink :to="$PAGES.user.vocabulary">
				<Button class="mt-4">Go to Vocabulary</Button>
			</RouterLink>
		</div>

		<!-- success -->
		<div
			v-else-if="state.status === 'success'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<RouterLink
				v-for="dictionary in dictionaries"
				:key="dictionary.id"
				:to="$PAGES.main.vocabularyStudy(dictionary.id)"
			>
				<Card
					class="p-6 flex flex-col items-center text-center gap-3 h-full hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-150"
				>
					<div
						class="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
					>
						<Icon :name="dictionary.icon" :size="28" />
					</div>
					<h2 class="text-lg font-semibold">{{ dictionary.title }}</h2>
					<span class="text-sm text-primary">Start studying →</span>
				</Card>
			</RouterLink>
		</div>
	</div>
</template>
