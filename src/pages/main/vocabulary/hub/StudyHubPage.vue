<script setup lang="ts">
import { useDictionaryGetById } from '@/api/vocabulary/dictionaries/get/byId/useDictionaryGetById'
import { useStudySession } from '@/api/vocabulary/study/session/useStudySession'
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { WordLevel } from '@/types/vocabulary'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GAME_MODES, type GameMode } from '../game/study-player.types'
import GameCard from './widgets/GameCard.vue'

// ---------------------
// route
// ---------------------
const route = useRoute()
const dictionaryId = computed(() => Number(route.params.dictionaryId))

// ---------------------
// api
// ---------------------
const { state: dictionaryState } = useDictionaryGetById(dictionaryId)
const { state, asyncStatus } = useStudySession(dictionaryId)

const dictionary = computed(() => dictionaryState.value.data?.data)
const pool = computed(() => state.value.data?.data ?? [])

// ---------------------
// helpers
// ---------------------
const hasExample = computed(() => pool.value.some(w => !!w.example))

const levelVariant = (level: WordLevel) =>
	level === 'MASTERED'
		? 'success'
		: level === 'LEARNING'
			? 'pending'
			: 'secondary'

const isModeDisabled = (mode: GameMode) => {
	if (!pool.value.length) return true
	if (mode === 'cloze') return !hasExample.value
	if (mode === 'matching') return pool.value.length < 2
	return false
}
</script>

<template>
	<div class="max-w-5xl mx-auto w-full px-6 py-8">
		<!-- header -->
		<div class="flex items-center gap-4 mb-8">
			<RouterLink :to="$PAGES.main.vocabulary">
				<Button variant="ghost" size="icon-sm">
					<Icon name="arrow-left" :size="18" />
				</Button>
			</RouterLink>
			<div
				class="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
			>
				<Icon :name="dictionary?.icon ?? 'book'" :size="24" />
			</div>
			<div>
				<h1 class="text-2xl font-bold">{{ dictionary?.title ?? 'Study' }}</h1>
				<p class="text-sm text-muted-foreground">Choose a game to practice.</p>
			</div>
		</div>

		<!-- loading -->
		<div v-if="asyncStatus === 'loading'" class="space-y-6">
			<Skeleton class="h-40 w-full rounded-xl" />
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				<Skeleton v-for="i in 6" :key="i" class="h-40 w-full rounded-xl" />
			</div>
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading session
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!pool.length"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">
				Nothing to study today
			</p>
			<p class="text-muted text-sm mt-1">
				You're all caught up — come back later or add more words.
			</p>
		</div>

		<!-- success -->
		<div v-else-if="state.status === 'success'" class="flex flex-col gap-8">
			<!-- today's words -->
			<Card class="p-5">
				<div class="flex items-center justify-between mb-4">
					<h2 class="font-semibold">Today's words</h2>
					<Badge variant="outline">{{ pool.length }}</Badge>
				</div>
				<div class="flex flex-wrap gap-2">
					<div
						v-for="word in pool"
						:key="word.id"
						class="flex items-center gap-2 rounded-lg border border-border bg-card-secondary px-3 py-1.5"
					>
						<span class="font-medium text-sm">{{ word.word }}</span>
						<span class="text-xs text-muted-foreground">
							{{ word.translation }}
						</span>
						<Badge :variant="levelVariant(word.level)" class="ml-1">
							{{ word.level }}
						</Badge>
					</div>
				</div>
			</Card>

			<!-- games -->
			<div>
				<h2 class="font-semibold mb-4">Games</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					<GameCard
						v-for="game in GAME_MODES"
						:key="game.mode"
						:title="game.title"
						:description="game.description"
						:icon="game.icon"
						:to="$PAGES.main.vocabularyGame(dictionaryId, game.mode)"
						:disabled="isModeDisabled(game.mode)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
