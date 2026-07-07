<script setup lang="ts">
import { useProducts } from '@/api/billing/products/get/all/useProducts'
import { useCategoryGetAll } from '@/api/categories/get/all/useCategoryGetAll'
import { useCourseGetAllAdmin } from '@/api/courses/get/allAdmin/useCourseGetAllAdmin'
import { useCourseSetVisibility } from '@/api/courses/setVisibility/useCourseSetVisibility'
import { useLanguageGetAll } from '@/api/languages/get/all/useLanguageGetAll'
import { useLanguageLevelGetAll } from '@/api/languages/level/get/all/useLanguageLevelGetAll'
import { $PAGES } from '@/app/configs/pages.config'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import CourseIcon from '@/components/course/CourseIcon.vue'
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
import { formatPriceCents } from '@/utils/price'
import {
	EyeIcon,
	EyeOffIcon,
	FolderOpenIcon,
	GraduationCapIcon,
	LanguagesIcon,
	LayersIcon,
	ListTreeIcon,
	SearchIcon,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { computed, ref, watch } from 'vue'
import AdminCourseCreateModal from './(modals)/create/AdminCourseCreateModal.vue'
import AdminCourseDeleteModal from './(modals)/delete/AdminCourseDeleteModal.vue'
import AdminCourseEditModal from './(modals)/edit/AdminCourseEditModal.vue'

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useCourseGetAllAdmin()
const { data: productsData, refetch: refetchProducts } = useProducts()
const { data: languagesData } = useLanguageGetAll()
const { data: levelsData } = useLanguageLevelGetAll()
const { data: categoriesData } = useCategoryGetAll()

const setVisibility = useCourseSetVisibility()

const refetchAll = () => {
	refetch()
	refetchProducts()
}

const togglingId = ref<number | null>(null)

const toggleVisibility = async (course: { id: string | number; title: string; isVisible: boolean }) => {
	const id = Number(course.id)
	togglingId.value = id
	try {
		await setVisibility.mutateAsync({ id, isVisible: !course.isVisible })
		toast.success(
			course.isVisible
				? `"${course.title}" is now hidden`
				: `"${course.title}" is now visible`,
		)
		refetch()
	} catch (e) {
		toast.error('Failed to update visibility')
	} finally {
		togglingId.value = null
	}
}

// ---------------------
// lookups
// ---------------------
const languageMap = computed(
	() => new Map(languagesData.value?.data.map(l => [l.id, l])),
)
const levelMap = computed(
	() => new Map(levelsData.value?.data.map(l => [l.id, l])),
)
const categoryMap = computed(
	() => new Map(categoriesData.value?.data.map(c => [c.id, c])),
)
const productMap = computed(
	() => new Map(productsData.value?.data.map(p => [p.courseId, p])),
)

const priceLabel = (course: { id: string | number; isFree: boolean }) => {
	if (course.isFree) return 'Free'
	const product = productMap.value.get(Number(course.id))
	return formatPriceCents(product?.priceCents, product?.currency)
}

// ---------------------
// enriched list
// ---------------------
const allCourses = computed(() =>
	(state.value.data?.data ?? []).map(c => ({
		...c,
		languageName: languageMap.value.get(c.languageId)?.name ?? '—',
		nativeLanguageName:
			c.nativeLanguageId != null
				? (languageMap.value.get(c.nativeLanguageId)?.name ?? '—')
				: null,
		levelName: levelMap.value.get(c.languageLvlId)?.name ?? '—',
		categoryName: c.categoryId
			? (categoryMap.value.get(c.categoryId)?.name ?? '—')
			: null,
	})),
)

// ---------------------
// stats
// ---------------------
const freeCount = computed(() => allCourses.value.filter(c => c.isFree).length)
const paidCount = computed(() => allCourses.value.filter(c => !c.isFree).length)
const hiddenCount = computed(
	() => allCourses.value.filter(c => !c.isVisible).length,
)

// ---------------------
// filters
// ---------------------
const ALL = 'all'
const search = ref('')
const languageId = ref(ALL)

const filtered = computed(() =>
	allCourses.value
		.filter(
			c =>
				languageId.value === ALL || c.languageId === Number(languageId.value),
		)
		.filter(c => {
			const q = search.value.trim().toLowerCase()
			if (!q) return true
			return (
				c.title.toLowerCase().includes(q) || c.cid.toLowerCase().includes(q)
			)
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
const PER_PAGE = 9
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
				<h1 class="text-3xl font-bold">Courses</h1>
				<p class="text-muted-foreground mt-1">
					Manage your courses, languages and lessons.
				</p>
			</div>
			<AdminCourseCreateModal @success="refetchAll" />
		</div>

		<!-- stats -->
		<div class="flex flex-wrap gap-4 w-full mb-6">
			<AdminStatsCard
				title="Total Courses"
				:value="allCourses.length"
				icon="calculator"
				color="purple"
			/>
			<AdminStatsCard
				title="Free"
				:value="freeCount"
				icon="gift"
				color="green"
			/>
			<AdminStatsCard
				title="Paid"
				:value="paidCount"
				icon="credit-card"
				color="orange"
			/>
			<AdminStatsCard
				title="Hidden"
				:value="hiddenCount"
				icon="eye-off"
				color="red"
			/>
		</div>

		<!-- toolbar -->
		<div
			class="flex flex-col sm:flex-row sm:items-center gap-3 w-full mb-6"
		>
			<div class="relative flex-1">
				<SearchIcon
					class="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2"
				/>
				<Input
					v-model="search"
					placeholder="Search by title or CID.."
					class="pl-9"
				/>
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
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-56 w-full rounded-xl" />
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
			<!-- grid -->
			<div
				v-if="paginated.length"
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
			>
				<Card
					v-for="course in paginated"
					:key="course.id"
					class="group flex flex-col p-5 h-full transition-shadow hover:shadow-md"
					:class="{ 'opacity-60': !course.isVisible }"
				>
					<!-- top -->
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex items-center gap-3 min-w-0">
							<div
								class="flex items-center justify-center size-12 shrink-0 rounded-xl bg-card-secondary text-primary"
							>
								<CourseIcon :name="course.icon" :size="24" />
							</div>
							<div class="min-w-0">
								<h3 class="text-base font-bold truncate">{{ course.title }}</h3>
								<p class="text-xs text-muted font-mono truncate">
									{{ course.cid }}
								</p>
							</div>
						</div>
						<div class="flex flex-col items-end gap-1.5 shrink-0">
							<Badge variant="outline">#{{ course.id }}</Badge>
							<Badge v-if="!course.isVisible" variant="destructive">
								Hidden
							</Badge>
						</div>
					</div>

					<!-- description -->
					<p class="text-sm text-muted-foreground line-clamp-2 mb-4">
						{{ course.description }}
					</p>

					<!-- meta -->
					<div class="grid grid-cols-2 gap-2 mb-4">
						<div class="rounded-lg bg-card-secondary px-3 py-2 min-w-0">
							<p class="text-[10px] uppercase tracking-wide text-muted">
								Target
							</p>
							<p class="text-sm font-medium truncate flex items-center gap-1.5">
								<GraduationCapIcon class="size-3.5 shrink-0 text-primary" />
								{{ course.languageName }}
							</p>
						</div>
						<div class="rounded-lg bg-card-secondary px-3 py-2 min-w-0">
							<p class="text-[10px] uppercase tracking-wide text-muted">
								Original
							</p>
							<p class="text-sm font-medium truncate flex items-center gap-1.5">
								<LanguagesIcon class="size-3.5 shrink-0 text-secondary" />
								<span :class="{ 'text-muted': !course.nativeLanguageName }">
									{{ course.nativeLanguageName ?? 'Not set' }}
								</span>
							</p>
						</div>
						<div class="rounded-lg bg-card-secondary px-3 py-2 min-w-0">
							<p class="text-[10px] uppercase tracking-wide text-muted">Level</p>
							<p class="text-sm font-medium truncate flex items-center gap-1.5">
								<LayersIcon class="size-3.5 shrink-0 text-accent" />
								{{ course.levelName }}
							</p>
						</div>
						<div class="rounded-lg bg-card-secondary px-3 py-2 min-w-0">
							<p class="text-[10px] uppercase tracking-wide text-muted">
								Category
							</p>
							<p class="text-sm font-medium truncate flex items-center gap-1.5">
								<FolderOpenIcon class="size-3.5 shrink-0 text-muted-foreground" />
								<span :class="{ 'text-muted': !course.categoryName }">
									{{ course.categoryName ?? 'None' }}
								</span>
							</p>
						</div>
					</div>

					<!-- footer -->
					<div
						class="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border"
					>
						<Badge :variant="course.isFree ? 'success' : 'secondary'">
							{{ priceLabel(course) }}
						</Badge>
						<div class="flex items-center gap-2">
							<Button
								size="sm"
								:disabled="togglingId === Number(course.id)"
								class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 transition-all duration-150 cursor-pointer"
								:class="
									course.isVisible
										? 'border-status-success/40 text-status-success bg-status-success/5 hover:bg-status-success/10'
										: 'border-muted/40 text-muted-foreground bg-muted/5 hover:bg-muted/10'
								"
								:title="course.isVisible ? 'Hide course' : 'Show course'"
								@click="toggleVisibility(course)"
							>
								<EyeIcon v-if="course.isVisible" class="size-3" />
								<EyeOffIcon v-else class="size-3" />
							</Button>
							<RouterLink :to="$PAGES.admin.course.lessons(course.id)">
								<Button
									size="sm"
									class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-accent/40 text-accent bg-accent/5 hover:bg-accent/10 transition-all duration-150 cursor-pointer"
								>
									<ListTreeIcon class="size-3" />
								</Button>
							</RouterLink>
							<AdminCourseEditModal :data="course" @success="refetchAll" />
							<AdminCourseDeleteModal
								:id="Number(course.id)"
								:name="course.title"
								@success="refetchAll"
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
				<p class="text-foreground font-semibold text-lg">No courses found</p>
				<p class="text-muted text-sm mt-1">
					{{
						hasActiveFilters
							? 'Try changing or resetting the filters.'
							: 'Create your first course to get started.'
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
