<script setup lang="ts">
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
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
import { SearchIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import AdminLanguageLevelCreateModal from './(modals)/create/AdminLanguageLevelCreateModal.vue'
import AdminLanguageLevelDeleteModal from './(modals)/delete/AdminLanguageLevelDeleteModal.vue'
import AdminLanguageLevelEditModal from './(modals)/edit/AdminLanguageLevelEditModal.vue'

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useLanguageLevelGetAll()
const { data: languagesData } = useLanguageGetAll()

// ---------------------
// lookups
// ---------------------
const languageMap = computed(
	() => new Map(languagesData.value?.data.map(l => [l.id, l])),
)

// ---------------------
// enriched list
// ---------------------
const allLevels = computed(() =>
	(state.value.data?.data ?? []).map(l => ({
		...l,
		languageName: languageMap.value.get(l.languageId)?.name ?? '—',
	})),
)

// ---------------------
// filters
// ---------------------
const ALL = 'all'
const search = ref('')
const languageId = ref(ALL)

const filtered = computed(() =>
	allLevels.value
		.filter(
			l => languageId.value === ALL || l.languageId === Number(languageId.value),
		)
		.filter(l => {
			const q = search.value.trim().toLowerCase()
			if (!q) return true
			return l.name.toLowerCase().includes(q)
		}),
)

const hasActiveFilters = computed(
	() => search.value.trim() !== '' || languageId.value !== ALL,
)

const resetFilters = () => {
	search.value = ''
	languageId.value = ALL
}

// ---------------------
// pagination
// ---------------------
const PER_PAGE = 12
const page = ref(1)

watch([search, languageId], () => {
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
				<h1 class="text-3xl font-bold">Language Levels</h1>
				<p class="text-muted-foreground mt-1">
					Proficiency levels grouped by language.
				</p>
			</div>
			<AdminLanguageLevelCreateModal @success="refetch" />
		</div>

		<!-- stats -->
		<div class="flex flex-wrap gap-4 w-full mb-6">
			<AdminStatsCard
				title="Total Levels"
				:value="allLevels.length"
				icon="layers"
				color="green"
			/>
		</div>

		<!-- toolbar -->
		<div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full mb-6">
			<div class="relative flex-1">
				<SearchIcon
					class="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2"
				/>
				<Input v-model="search" placeholder="Search by name.." class="pl-9" />
			</div>
			<Select v-model="languageId">
				<SelectTrigger class="w-full sm:w-56">
					<SelectValue placeholder="All languages" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem :value="ALL">All languages</SelectItem>
					<SelectItem
						v-for="language in languagesData?.data"
						:key="language.id"
						:value="String(language.id)"
					>
						{{ language.name }}
					</SelectItem>
				</SelectContent>
			</Select>
			<Button
				v-if="hasActiveFilters"
				variant="ghost"
				size="sm"
				@click="resetFilters"
			>
				Reset
			</Button>
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
					v-for="level in paginated"
					:key="level.id"
					class="group flex flex-col p-4 h-full transition-shadow hover:shadow-md"
				>
					<div class="flex items-start justify-between gap-2 mb-3">
						<div class="min-w-0">
							<h3 class="text-base font-bold truncate">{{ level.name }}</h3>
							<Badge variant="secondary" class="mt-1">
								{{ level.languageName }}
							</Badge>
						</div>
						<Badge variant="outline" class="shrink-0">#{{ level.id }}</Badge>
					</div>

					<div
						class="flex items-center justify-end gap-2 pt-3 border-t border-border mt-auto"
					>
						<AdminLanguageLevelEditModal
							:id="level.id"
							:name="level.name"
							@success="refetch"
						/>
						<AdminLanguageLevelDeleteModal
							:id="level.id"
							:name="level.name"
							@success="refetch"
						/>
					</div>
				</Card>
			</div>

			<!-- empty -->
			<div
				v-else
				class="bg-card border border-border p-12 text-center rounded-xl w-full"
			>
				<p class="text-foreground font-semibold text-lg">No levels found</p>
				<p class="text-muted text-sm mt-1">
					{{
						hasActiveFilters
							? 'Try changing or resetting the filters.'
							: 'Add your first level to get started.'
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
