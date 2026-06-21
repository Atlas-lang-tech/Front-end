<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import CourseIcon from '@/components/course/CourseIcon.vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { useBillingStore } from '@/stores/billing.store'
import type { Product } from '@/types/billing'
import type { Course } from '@/types/course'
import { formatPriceCents } from '@/utils/price'
import { computed, ref } from 'vue'
import CoursePurchaseModal from '../(modals)/purchase/CoursePurchaseModal.vue'

// ---------------------
// props
// ---------------------

const props = defineProps<{
	id: string
	title: string
	description: string
	icon: string
	languageName: string
	levelName: string
	categoryName?: string
	isFree: boolean
	product?: Product
}>()

// ---------------------
// access
// ---------------------

const billingStore = useBillingStore()

const hasAccess = computed(() =>
	billingStore.canAccessCourse({
		id: props.id,
		isFree: props.isFree,
	} as Course),
)

const priceLabel = computed(() =>
	props.isFree
		? 'Free'
		: formatPriceCents(props.product?.priceCents, props.product?.currency),
)

const purchaseOpen = ref(false)
</script>

<template>
	<Card class="flex flex-col p-5 h-full transition-shadow hover:shadow-md">
		<div class="flex items-start justify-between mb-4">
			<div
				class="flex items-center justify-center size-12 rounded-xl bg-card-secondary text-primary"
			>
				<CourseIcon :name="icon" :size="24" />
			</div>
			<Badge variant="outline">{{ languageName }}</Badge>
		</div>

		<h3 class="text-lg font-bold mb-1">{{ title }}</h3>
		<p class="text-sm text-muted-foreground flex-1">{{ description }}</p>

		<div class="flex flex-wrap items-center gap-2 mt-4">
			<Badge variant="success">{{ levelName }}</Badge>
			<Badge v-if="categoryName" variant="secondary">{{ categoryName }}</Badge>
			<Badge v-if="isFree" variant="outline" class="ml-auto">Free</Badge>
			<Badge v-else-if="!hasAccess" variant="default" class="ml-auto">
				{{ priceLabel }}
			</Badge>
		</div>

		<RouterLink v-if="hasAccess" :to="$PAGES.main.course(id)" class="mt-5">
			<Button class="w-full">View course</Button>
		</RouterLink>

		<Button v-else class="mt-5 w-full" @click="purchaseOpen = true">
			Buy for {{ priceLabel }}
		</Button>

		<CoursePurchaseModal
			v-model:open="purchaseOpen"
			:course-id="Number(id)"
			:title="title"
			:product="product"
		/>
	</Card>
</template>
