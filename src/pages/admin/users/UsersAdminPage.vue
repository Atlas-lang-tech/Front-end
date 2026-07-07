<script setup lang="ts">
import { useUserGetAll } from '@/api/users/get/all/useUserGetAll'
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
import type { User } from '@/types/user'
import { MailIcon, SearchIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import AdminUserPlanModal from './(modals)/plan/AdminUserPlanModal.vue'
import AdminUserRoleModal from './(modals)/role/AdminUserRoleModal.vue'

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useUserGetAll()

// ---------------------
// list
// ---------------------
const allUsers = computed(() => state.value.data ?? [])

const adminCount = computed(
	() => allUsers.value.filter(u => u.role === 'ADMIN').length,
)
const moderatorCount = computed(
	() => allUsers.value.filter(u => u.role === 'MODERATOR').length,
)

// ---------------------
// filters
// ---------------------
const ALL = 'all'
const search = ref('')
const role = ref(ALL)

const filtered = computed(() =>
	allUsers.value
		.filter(u => role.value === ALL || u.role === role.value)
		.filter(u => {
			const q = search.value.trim().toLowerCase()
			if (!q) return true
			return (
				u.username.toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q)
			)
		}),
)

const hasActiveFilters = computed(
	() => search.value.trim() !== '' || role.value !== ALL,
)

const resetFilters = () => {
	search.value = ''
	role.value = ALL
}

// ---------------------
// pagination
// ---------------------
const PER_PAGE = 9
const page = ref(1)

watch([search, role], () => {
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

// ---------------------
// helpers
// ---------------------
const roleVariant = (r: User['role']) => {
	if (r === 'ADMIN') return 'destructive'
	if (r === 'MODERATOR') return 'warning'
	return 'secondary'
}

const initials = (username: string) =>
	username.slice(0, 2).toUpperCase() || '?'
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<!-- header -->
		<div class="flex items-center justify-between w-full mb-6">
			<div>
				<h1 class="text-3xl font-bold">Users</h1>
				<p class="text-muted-foreground mt-1">
					Manage roles and plans for platform members.
				</p>
			</div>
		</div>

		<!-- stats -->
		<div class="flex flex-wrap gap-4 w-full mb-6">
			<AdminStatsCard
				title="Total Users"
				:value="allUsers.length"
				icon="users"
				color="blue"
			/>
			<AdminStatsCard
				title="Admins"
				:value="adminCount"
				icon="shield"
				color="red"
			/>
			<AdminStatsCard
				title="Moderators"
				:value="moderatorCount"
				icon="shield-check"
				color="yellow"
			/>
		</div>

		<!-- toolbar -->
		<div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full mb-6">
			<div class="relative flex-1">
				<SearchIcon
					class="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2"
				/>
				<Input
					v-model="search"
					placeholder="Search by username or email.."
					class="pl-9"
				/>
			</div>
			<Select v-model="role">
				<SelectTrigger class="w-full sm:w-48">
					<SelectValue placeholder="All roles" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem :value="ALL">All roles</SelectItem>
					<SelectItem value="USER">User</SelectItem>
					<SelectItem value="MODERATOR">Moderator</SelectItem>
					<SelectItem value="ADMIN">Admin</SelectItem>
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
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-40 w-full rounded-xl" />
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
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full"
			>
				<Card
					v-for="user in paginated"
					:key="user.id"
					class="group flex flex-col p-5 h-full transition-shadow hover:shadow-md"
				>
					<div class="flex items-start gap-3 mb-4">
						<div
							class="flex items-center justify-center size-12 shrink-0 rounded-full bg-primary text-white font-bold"
						>
							{{ initials(user.username) }}
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h3 class="text-base font-bold truncate">{{ user.username }}</h3>
								<Badge :variant="roleVariant(user.role)" class="shrink-0">
									{{ user.role }}
								</Badge>
							</div>
							<p
								class="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate"
							>
								<MailIcon class="size-3.5 shrink-0" />
								<span class="truncate">{{ user.email }}</span>
							</p>
						</div>
					</div>

					<div
						class="flex items-center justify-between gap-2 pt-3 border-t border-border mt-auto"
					>
						<div class="flex items-center gap-2 text-sm">
							<span class="text-muted">Plan:</span>
							<Badge v-if="user.planCode" variant="outline">
								{{ user.planCode }}
							</Badge>
							<span v-else class="text-muted">—</span>
						</div>
						<div class="flex items-center gap-2">
							<AdminUserPlanModal
								:id="user.id"
								:username="user.username"
								:plan-code="user.planCode"
								@success="refetch"
							/>
							<AdminUserRoleModal
								:id="user.id"
								:username="user.username"
								:role="user.role"
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
				<p class="text-foreground font-semibold text-lg">No users found</p>
				<p class="text-muted text-sm mt-1">
					Try changing or resetting the filters.
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
