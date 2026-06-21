<script setup lang="ts">
import { useDictionaryGetById } from '@/api/vocabulary/dictionaries/get/byId/useDictionaryGetById'
import { useWordGetByDictionary } from '@/api/vocabulary/words/get/byDictionary/useWordGetByDictionary'
import { $PAGES } from '@/app/configs/pages.config'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { Skeleton } from '@/shared/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui/table'
import type { WordLevel } from '@/types/vocabulary'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserWordCreateModal from './(modals)/create/UserWordCreateModal.vue'
import UserWordDeleteModal from './(modals)/delete/UserWordDeleteModal.vue'
import UserWordEditModal from './(modals)/edit/UserWordEditModal.vue'

// ---------------------
// route
// ---------------------
const route = useRoute()
const dictionaryId = computed(() => Number(route.params.dictionaryId))

// ---------------------
// api
// ---------------------
const { state: dictionaryState } = useDictionaryGetById(dictionaryId)
const { state, asyncStatus, refetch } = useWordGetByDictionary(dictionaryId)

const dictionary = computed(() => dictionaryState.value.data?.data)

// ---------------------
// filters
// ---------------------
const ALL = 'all'
const search = ref('')
const levelFilter = ref<string>(ALL)

const levelVariant = (level: WordLevel) =>
	level === 'MASTERED'
		? 'success'
		: level === 'LEARNING'
			? 'pending'
			: 'secondary'

// ---------------------
// data
// ---------------------
const words = computed(() => state.value.data?.data ?? [])

const filtered = computed(() => {
	const q = search.value.trim().toLowerCase()
	return words.value
		.filter(w => levelFilter.value === ALL || w.level === levelFilter.value)
		.filter(
			w =>
				!q ||
				w.word.toLowerCase().includes(q) ||
				w.translation.toLowerCase().includes(q),
		)
})

// ---------------------
// pagination
// ---------------------
const PER_PAGE = 8
const page = ref(1)

const totalPages = computed(() =>
	Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)),
)

const paginated = computed(() => {
	const start = (page.value - 1) * PER_PAGE
	return filtered.value.slice(start, start + PER_PAGE)
})

const rangeLabel = computed(() => {
	if (!filtered.value.length) return '0 of 0'
	const start = (page.value - 1) * PER_PAGE + 1
	const end = Math.min(page.value * PER_PAGE, filtered.value.length)
	return `${start}–${end} of ${filtered.value.length}`
})

watch([search, levelFilter], () => {
	page.value = 1
})
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<div class="flex items-center justify-between w-full mb-6 gap-4">
			<div class="flex items-center gap-4 min-w-0">
				<RouterLink :to="$PAGES.user.vocabulary">
					<Button variant="ghost" size="icon-sm">
						<Icon name="arrow-left" :size="18" />
					</Button>
				</RouterLink>
				<div
					class="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
				>
					<Icon :name="dictionary?.icon ?? 'book'" :size="24" />
				</div>
				<h1 class="text-3xl font-bold truncate">
					{{ dictionary?.title ?? 'Dictionary' }}
				</h1>
			</div>
			<UserWordCreateModal
				:dictionary-id="dictionaryId"
				:current-count="words.length"
				@success="refetch"
			/>
		</div>

		<!-- filters -->
		<div class="flex flex-col sm:flex-row gap-3 mb-4">
			<Input
				v-model="search"
				placeholder="Search word or translation.."
				class="sm:max-w-xs"
			/>
			<Select v-model="levelFilter">
				<SelectTrigger class="w-full sm:w-48">
					<SelectValue placeholder="All levels" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem :value="ALL">All levels</SelectItem>
					<SelectItem value="NEW">New</SelectItem>
					<SelectItem value="LEARNING">Learning</SelectItem>
					<SelectItem value="MASTERED">Mastered</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<!-- loading -->
		<div v-if="asyncStatus === 'loading'" class="w-full space-y-3">
			<Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">Error loading words</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!words.length"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No words yet</p>
			<p class="text-muted text-sm mt-1">Add your first word to this dictionary.</p>
		</div>

		<!-- success -->
		<div v-else-if="state.status === 'success'" class="w-full">
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Word</TableHead>
							<TableHead>Translation</TableHead>
							<TableHead>Transcription</TableHead>
							<TableHead class="w-32">Level</TableHead>
							<TableHead class="text-right w-32">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="word in paginated" :key="word.id">
							<TableCell class="font-medium">{{ word.word }}</TableCell>
							<TableCell>{{ word.translation }}</TableCell>
							<TableCell class="text-muted-foreground">
								{{ word.transcription ?? '—' }}
							</TableCell>
							<TableCell>
								<Badge :variant="levelVariant(word.level)">
									{{ word.level }}
								</Badge>
							</TableCell>
							<TableCell>
								<div class="flex items-center justify-end gap-2">
									<UserWordEditModal
										:id="word.id"
										:word="word.word"
										:translation="word.translation"
										:transcription="word.transcription"
										:example="word.example"
										:description="word.description"
										@success="refetch"
									/>
									<UserWordDeleteModal
										:id="word.id"
										:word="word.word"
										@success="refetch"
									/>
								</div>
							</TableCell>
						</TableRow>
						<TableRow v-if="!filtered.length">
							<TableCell colspan="5" class="text-center text-muted py-8">
								No words match your filters.
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<div
					class="flex items-center justify-between px-5 py-3 border-t border-border"
				>
					<span class="text-sm text-muted">{{ rangeLabel }}</span>
					<div class="flex gap-1">
						<Button
							size="sm"
							variant="ghost"
							:disabled="page === 1"
							@click="page--"
						>
							←
						</Button>
						<Button
							v-for="p in totalPages"
							:key="p"
							size="sm"
							@click="page = p"
							:variant="p === page ? 'default' : 'ghost'"
						>
							{{ p }}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							:disabled="page === totalPages"
							@click="page++"
						>
							→
						</Button>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
