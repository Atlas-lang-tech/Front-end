<script setup lang="ts">
import { usePlans } from '@/api/billing/plans/get/all/usePlans'
import { useMySubscription } from '@/api/billing/subscription/get/me/useMySubscription'
import Icon from '@/shared/icon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { formatPriceCents } from '@/utils/price'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// api
// ---------------------

const { data: plansData, asyncStatus, state } = usePlans()
const { data: subscriptionData } = useMySubscription()

// ---------------------
// data
// ---------------------

const plans = computed(() =>
	[...(plansData.value?.data ?? [])].sort(
		(a, b) => a.priceCents - b.priceCents,
	),
)

const subscription = computed(() => subscriptionData.value?.data)
const freePlan = computed(() => plans.value.find(p => p.priceCents <= 0))
const currentPlan = computed(
	() =>
		plans.value.find(p => p.code === subscription.value?.planCode) ??
		freePlan.value,
)
const currentPlanCode = computed(() => currentPlan.value?.code)

const priceLabel = (priceCents: number) =>
	priceCents <= 0 ? 'Free' : formatPriceCents(priceCents)

const formatDate = (value?: string | null) =>
	value ? new Date(value).toLocaleDateString() : '—'

// ---------------------
// actions
// ---------------------

const onChoose = () => {
	toast.info('Plan changes are managed by an administrator.')
}
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<div class="mb-6">
			<h1 class="text-3xl font-bold">Pricing</h1>
			<p class="text-muted-foreground text-sm mt-1">
				Compare plans and see what you get.
			</p>
		</div>

		<!-- current plan -->
		<Card
			v-if="currentPlan"
			class="p-5 mb-8 border-primary border-2 flex flex-wrap items-center gap-4"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex items-center justify-center size-11 rounded-xl bg-card-secondary text-primary"
				>
					<Icon name="badge-check" :size="22" />
				</div>
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">Current plan</p>
					<p class="text-lg font-bold">{{ currentPlan.name }}</p>
				</div>
			</div>

			<Badge
				:variant="subscription?.status === 'ACTIVE' ? 'success' : 'pending'"
			>
				{{ subscription?.status ?? 'ACTIVE' }}
			</Badge>

			<div v-if="subscription" class="sm:ml-auto flex items-center gap-6 text-sm">
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">Started</p>
					<p class="font-medium mt-0.5">
						{{ formatDate(subscription.startedAt) }}
					</p>
				</div>
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">
						{{ subscription.expiresAt ? 'Renews / expires' : 'Validity' }}
					</p>
					<p class="font-medium mt-0.5">
						{{
							subscription.expiresAt
								? formatDate(subscription.expiresAt)
								: 'No expiry'
						}}
					</p>
				</div>
			</div>
		</Card>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Skeleton v-for="i in 3" :key="i" class="h-64 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">Error loading plans</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- success -->
		<div
			v-else-if="plans.length"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Card
				v-for="plan in plans"
				:key="plan.code"
				class="p-6 flex flex-col"
				:class="
					plan.code === currentPlanCode
						? 'border-primary border-2'
						: 'border-border'
				"
			>
				<div class="flex items-center justify-between mb-2">
					<h2 class="text-xl font-bold">{{ plan.name }}</h2>
					<Badge v-if="plan.code === currentPlanCode" variant="success">
						Current plan
					</Badge>
				</div>

				<div class="flex items-baseline gap-1 mb-5">
					<span class="text-3xl font-bold text-primary">
						{{ priceLabel(plan.priceCents) }}
					</span>
					<span v-if="plan.priceCents > 0" class="text-sm text-muted">
						/ month
					</span>
				</div>

				<ul class="flex flex-col gap-2 text-sm flex-1">
					<li class="flex items-center gap-2">
						<Icon name="check" :size="16" class="text-status-success" />
						{{ plan.maxDictionaries }} dictionaries
					</li>
					<li class="flex items-center gap-2">
						<Icon name="check" :size="16" class="text-status-success" />
						{{ plan.maxWordsPerDict }} words per dictionary
					</li>
				</ul>

				<Button
					class="mt-6 w-full"
					:variant="plan.code === currentPlanCode ? 'ghost' : 'default'"
					:disabled="plan.code === currentPlanCode"
					@click="onChoose"
				>
					{{ plan.code === currentPlanCode ? 'Your plan' : 'Choose plan' }}
				</Button>
			</Card>
		</div>

		<!-- empty -->
		<div
			v-else
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No plans available</p>
			<p class="text-muted text-sm mt-1">Check back later.</p>
		</div>
	</div>
</template>
