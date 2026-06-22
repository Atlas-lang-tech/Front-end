<script setup lang="ts">
import { useSetPlanActive } from '@/api/billing/admin/plans/setActive/useSetPlanActive'
import { usePlans } from '@/api/billing/plans/get/all/usePlans'
import AdminStatsCard from '@/components/admin/StatsCard/AdminStatsCard.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui/table'
import type { Plan } from '@/types/billing'
import { formatPriceCents } from '@/utils/price'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
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
// pagination
// ---------------------
const PER_PAGE = 8
const page = ref(1)

const plans = computed(() => state.value.data?.data ?? [])
const totalPages = computed(() => Math.ceil(plans.value.length / PER_PAGE))

const paginated = computed(() => {
	const start = (page.value - 1) * PER_PAGE
	return plans.value.slice(start, start + PER_PAGE)
})

const rangeLabel = computed(() => {
	const start = (page.value - 1) * PER_PAGE + 1
	const end = Math.min(page.value * PER_PAGE, plans.value.length)
	return `${start}–${end} of ${plans.value.length}`
})
</script>

<template>
	<div class="flex flex-col items-center w-full h-full">
		<div class="flex flex-col items-center justify-between w-full mb-4">
			<div class="flex items-center justify-between w-full mb-4">
				<h1 class="text-3xl font-bold">Plans</h1>
				<AdminPlanCreateModal @success="refetch" />
			</div>
			<div class="flex items-center justify-between w-full">
				<AdminStatsCard
					title="Total Plans"
					:value="plans.length"
					icon="credit-card"
					color="purple"
				/>
			</div>
		</div>

		<div class="flex flex-col items-center w-full h-full">
			<!-- loading -->
			<div v-if="asyncStatus === 'loading'" class="w-full">
				<div class="p-4 space-y-3">
					<Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
				</div>
			</div>

			<!-- error -->
			<div
				v-else-if="state.status === 'error'"
				class="bg-card border border-destructive p-12 text-center rounded-xl"
			>
				<p class="text-destructive font-semibold text-lg">Error loading data</p>
				<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
			</div>

			<!-- success -->
			<div v-else-if="state.status === 'success'" class="w-full">
				<Card class="w-full h-full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-24">Code</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Dictionaries</TableHead>
								<TableHead>Words / dict</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Status</TableHead>
								<TableHead class="text-right w-52">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow v-for="plan in paginated" :key="plan.code">
								<TableCell>
									<Badge variant="outline">{{ plan.code }}</Badge>
								</TableCell>
								<TableCell>{{ plan.name }}</TableCell>
								<TableCell>{{ plan.maxDictionaries }}</TableCell>
								<TableCell>{{ plan.maxWordsPerDict }}</TableCell>
								<TableCell>{{ formatPriceCents(plan.priceCents) }}</TableCell>
								<TableCell>
									<Badge :variant="plan.isActive ? 'success' : 'secondary'">
										{{ plan.isActive ? 'Active' : 'Inactive' }}
									</Badge>
								</TableCell>
								<TableCell>
									<div class="flex items-center justify-end gap-2">
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
	</div>
</template>
