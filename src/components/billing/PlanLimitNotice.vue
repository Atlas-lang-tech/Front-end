<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import { Button } from '@/shared/ui/button'
import { useBillingStore } from '@/stores/billing.store'
import { LockIcon, SparklesIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// ---------------------
// props
// ---------------------
const props = defineProps<{
	title?: string
	description?: string
}>()

// ---------------------
// store
// ---------------------
const { currentPlan } = storeToRefs(useBillingStore())

// ---------------------
// data
// ---------------------
const description = computed(
	() =>
		props.description ??
		`You've reached the limit of your${
			currentPlan.value ? ` ${currentPlan.value.name}` : ''
		} plan. Upgrade to unlock more.`,
)
</script>

<template>
	<div
		class="flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 sm:flex-row sm:items-center"
	>
		<div class="flex flex-1 items-start gap-3 min-w-0">
			<div
				class="size-9 shrink-0 rounded-lg bg-accent/20 text-accent flex items-center justify-center"
			>
				<LockIcon class="size-4.5" />
			</div>
			<div class="min-w-0">
				<p class="font-semibold text-sm">
					{{ title ?? 'This feature is limited by your plan' }}
				</p>
				<p class="text-muted-foreground text-sm">{{ description }}</p>
			</div>
		</div>

		<RouterLink :to="$PAGES.user.pricing" class="shrink-0">
			<Button size="sm" variant="secondary" class="gap-1.5">
				<SparklesIcon class="size-4" />
				Upgrade plan
			</Button>
		</RouterLink>
	</div>
</template>
