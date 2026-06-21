<script setup lang="ts">
import { usePurchaseCourse } from '@/api/billing/purchase/create/usePurchaseCourse'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/ui/dialog'
import { useBillingStore } from '@/stores/billing.store'
import type { Product } from '@/types/billing'
import { formatPriceCents } from '@/utils/price'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------

const props = defineProps<{
	courseId: number
	title: string
	product?: Product
}>()

const emit = defineEmits(['success'])

const isOpen = defineModel<boolean>('open')

// ---------------------
// api
// ---------------------

const billingStore = useBillingStore()
const purchase = usePurchaseCourse()

const isSubmitting = ref(false)

// ---------------------
// submit
// ---------------------

const onConfirm = async () => {
	isSubmitting.value = true
	try {
		await purchase.mutateAsync({ courseId: props.courseId })
		await billingStore.refreshAfterPurchase(props.courseId)
		toast.success('Course purchased successfully')
		isOpen.value = false
		emit('success')
	} catch {
		toast.error('Error while purchasing course')
	} finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Purchase course</DialogTitle>
				<DialogDescription>
					Confirm your purchase to unlock full access.
				</DialogDescription>
			</DialogHeader>

			<div class="py-4">
				<div
					class="flex items-center justify-between rounded-lg bg-card-secondary px-4 py-3"
				>
					<span class="font-medium">{{ props.title }}</span>
					<span class="text-lg font-bold text-primary">
						{{ formatPriceCents(props.product?.priceCents, props.product?.currency) }}
					</span>
				</div>
				<p class="text-sm text-muted-foreground mt-3">
					Payment is processed instantly. You'll get lifetime access to all
					lessons in this course.
				</p>
			</div>

			<DialogFooter>
				<Button variant="ghost" :disabled="isSubmitting" @click="isOpen = false">
					Cancel
				</Button>
				<Button :disabled="isSubmitting" @click="onConfirm">
					{{ isSubmitting ? 'Processing...' : 'Buy now' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
