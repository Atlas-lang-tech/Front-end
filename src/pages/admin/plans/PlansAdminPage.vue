<script setup lang="ts">
import { useSetPlanActive } from '@/api/billing/admin/plans/setActive/useSetPlanActive'
import { usePlans } from '@/api/billing/plans/get/all/useAllPlans.ts'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Plan } from '@/types/billing'
import { formatPriceCents } from '@/utils/price'
import { BookTextIcon, EyeIcon, EyeOffIcon, LayersIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import AdminPlanCreateModal from './(modals)/create/AdminPlanCreateModal.vue'
import AdminPlanDeleteModal from './(modals)/delete/AdminPlanDeleteModal.vue'
import AdminPlanEditModal from './(modals)/edit/AdminPlanEditModal.vue'

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = usePlans()

const setPlanActive = useSetPlanActive()

const togglingCode = ref<string | null>(null)

const toggleActive = async (plan: Plan) => {
	togglingCode.value = plan.code
	try {
		await setPlanActive.mutateAsync({
			code: plan.code,
			isActive: !plan.isActive,
		})
		toast.success(plan.isActive ? 'Plan deactivated' : 'Plan activated')
		await refetch()
	} catch (e) {
		toast.error('Error while updating plan status')
	} finally {
		togglingCode.value = null
	}
}

// ---------------------
// list + stats
// ---------------------
const plans = computed(() => state.value.data?.data ?? [])
const activeCount = computed(() => plans.value.filter(p => p.isActive).length)
const formatLimit = (value: number) => (value < 0 ? 'Unlimited' : value)
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<!-- header -->
		<div class="flex items-center justify-between w-full mb-6">
			<div>
				<h1 class="text-3xl font-bold">Plans</h1>
				<p class="text-muted-foreground mt-1">
					Subscription tiers and their limits.
				</p>
			</div>
			<AdminPlanCreateModal @success="refetch" />
		</div>

		<!-- stats -->
		<div class="flex flex-wrap gap-4 w-full mb-6">
			<AdminStatsCard
				title="Total Plans"
				:value="plans.length"
				icon="credit-card"
				color="purple"
			/>
			<AdminStatsCard
				title="Active"
				:value="activeCount"
				icon="check-circle"
				color="green"
			/>
		</div>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-64 w-full rounded-xl" />
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
				v-if="plans.length"
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
			>
				<Card
					v-for="plan in plans"
					:key="plan.code"
					class="group flex flex-col p-6 h-full transition-shadow hover:shadow-md"
					:class="{ 'opacity-60': !plan.isActive }"
				>
					<!-- top -->
					<div class="flex items-start justify-between gap-2 mb-4">
						<div class="min-w-0">
							<h3 class="text-lg font-bold truncate">{{ plan.name }}</h3>
							<Badge variant="outline" class="mt-1 font-mono uppercase">
								{{ plan.code }}
							</Badge>
						</div>
						<Badge :variant="plan.isActive ? 'success' : 'secondary'">
							{{ plan.isActive ? 'Active' : 'Inactive' }}
						</Badge>
					</div>

					<!-- price -->
					<div class="mb-5">
						<span class="text-3xl font-bold">
							{{ formatPriceCents(plan.priceCents) }}
						</span>
					</div>

					<!-- limits -->
					<div class="flex flex-col gap-2 text-sm mb-5">
						<div class="flex items-center gap-2">
							<LayersIcon class="size-4 text-secondary shrink-0" />
							<span class="text-muted-foreground">Dictionaries:</span>
							<span class="font-medium ml-auto">
								{{ formatLimit(plan.maxDictionaries) }}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<BookTextIcon class="size-4 text-accent shrink-0" />
							<span class="text-muted-foreground">Words per dictionary:</span>
							<span class="font-medium ml-auto">
								{{ formatLimit(plan.maxWordsPerDict) }}
							</span>
						</div>
					</div>

					<!-- footer -->
					<div
						class="flex items-center justify-end gap-2 pt-4 border-t border-border mt-auto"
					>
						<Button
							size="sm"
							:disabled="togglingCode === plan.code"
							:title="plan.isActive ? 'Deactivate plan' : 'Activate plan'"
							class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 transition-all duration-150 cursor-pointer"
							:class="
								plan.isActive
									? 'border-status-success/40 text-status-success bg-status-success/5 hover:bg-status-success/10'
									: 'border-muted/40 text-muted bg-muted/5 hover:bg-muted/10'
							"
							@click="toggleActive(plan)"
						>
							<EyeIcon v-if="plan.isActive" class="size-3" />
							<EyeOffIcon v-else class="size-3" />
						</Button>
						<AdminPlanEditModal :data="plan" @success="refetch" />
						<AdminPlanDeleteModal
							:code="plan.code"
							:name="plan.name"
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
				<p class="text-foreground font-semibold text-lg">No plans found</p>
				<p class="text-muted text-sm mt-1">
					Create your first plan to get started.
				</p>
			</div>
		</template>
	</div>
</template>
