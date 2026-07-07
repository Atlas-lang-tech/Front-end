<script setup lang="ts">
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { LayersIcon, SearchIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import AdminLanguageCreateModal from './(modals)/create/AdminLanguageCreateModal.vue'
import AdminLanguageDeleteModal from './(modals)/delete/AdminLanguageDeleteModal.vue'
import AdminLanguageEditModal from './(modals)/edit/AdminLanguageEditModal.vue'

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useLanguageGetAll()
const { data: levelsData } = useLanguageLevelGetAll()

// ---------------------
// lookups
// ---------------------
const levelCountMap = computed(() => {
	const map = new Map<number, number>()
	for (const level of levelsData.value?.data ?? []) {
		map.set(level.languageId, (map.get(level.languageId) ?? 0) + 1)
	}
	return map
})

// ---------------------
// list + filter
// ---------------------
const allLanguages = computed(() => state.value.data?.data ?? [])
const search = ref('')

const filtered = computed(() => {
	const q = search.value.trim().toLowerCase()
	if (!q) return allLanguages.value
	return allLanguages.value.filter(
		l =>
			l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
	)
})

const hasActiveFilters = computed(() => search.value.trim() !== '')

// ---------------------
// pagination
// ---------------------
const PER_PAGE = 12
const page = ref(1)

watch(search, () => {
	page.value = 1
})

const totalPages = computed(() => Math.ceil(filtered.value.length / PER_PAGE))
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
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<!-- header -->
		<div class="flex items-center justify-between w-full mb-6">
			<div>
				<h1 class="text-3xl font-bold">Languages</h1>
				<p class="text-muted-foreground mt-1">
					Languages available across the platform.
				</p>
			</div>
			<AdminLanguageCreateModal @success="refetch" />
		</div>

		<!-- stats -->
		<div class="flex flex-wrap gap-4 w-full mb-6">
			<AdminStatsCard
				title="Total Languages"
				:value="allLanguages.length"
				icon="languages"
				color="blue"
			/>
		</div>

		<!-- toolbar -->
		<div class="flex w-full mb-6">
			<div class="relative flex-1 max-w-md">
				<SearchIcon
					class="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2"
				/>
				<Input
					v-model="search"
					placeholder="Search by name or code.."
					class="pl-9"
				/>
			</div>
		</div>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
		>
			<Skeleton v-for="i in 8" :key="i" class="h-28 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl w-full"
		>
			<p class="text-destructive font-semibold text-lg">Error loading data</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- success -->
		<template v-else-if="state.status === 'success'">
			<div
				v-if="paginated.length"
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
			>
				<Card
					v-for="language in paginated"
					:key="language.id"
					class="group flex flex-col p-4 h-full transition-shadow hover:shadow-md"
				>
					<div class="flex items-center gap-3 mb-3">
						<div
							class="flex items-center justify-center size-11 shrink-0 rounded-xl bg-primary/10 text-primary font-bold uppercase"
						>
							{{ language.code }}
						</div>
						<div class="min-w-0">
							<h3 class="text-base font-bold truncate">{{ language.name }}</h3>
							<p class="text-xs text-muted">#{{ language.id }}</p>
						</div>
					</div>

					<div
						class="flex items-center justify-between gap-2 pt-3 border-t border-border mt-auto"
					>
						<span class="flex items-center gap-1.5 text-sm text-muted-foreground">
							<LayersIcon class="size-3.5 text-accent" />
							{{ levelCountMap.get(language.id) ?? 0 }} levels
						</span>
						<div class="flex items-center gap-2">
							<AdminLanguageEditModal
								:id="language.id"
								:name="language.name"
								:code="language.code"
								@success="refetch"
							/>
							<AdminLanguageDeleteModal
								:id="language.id"
								:name="language.name"
								@success="refetch"
							/>
						</div>
					</div>
				</Card>
			</div>

			<!-- empty -->
			<div
				v-else
				class="bg-card border border-border p-12 text-center rounded-xl w-full"
			>
				<p class="text-foreground font-semibold text-lg">No languages found</p>
				<p class="text-muted text-sm mt-1">
					{{
						hasActiveFilters
							? 'Try a different search.'
							: 'Add your first language to get started.'
					}}
				</p>
			</div>

			<!-- pagination -->
			<div
				v-if="filtered.length"
				class="flex items-center justify-between w-full mt-6"
			>
				<span class="text-sm text-muted">{{ rangeLabel }}</span>
				<div v-if="totalPages > 1" class="flex gap-1">
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
		</template>
	</div>
</template>
