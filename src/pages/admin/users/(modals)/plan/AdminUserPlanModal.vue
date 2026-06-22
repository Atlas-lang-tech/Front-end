<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { usePlans } from '@/api/billing/plans/get/all/usePlans'
import { useUserPlanEdit } from '@/api/users/plan/useUserPlanEdit'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { CreditCardIcon } from 'lucide-vue-next'

// ---------------------
// Props / emits
// ---------------------
const props = defineProps<{
	id: string
	username: string
	planCode?: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// Dialog state
// ---------------------
const isOpen = ref(false)

const planCode = ref<string>(props.planCode ?? '')

// ---------------------
// Sync props -> local state when dialog opens
// ---------------------
watch(isOpen, open => {
	if (open) {
		planCode.value = props.planCode ?? ''
	}
})

// ---------------------
// Api
// ---------------------
const { state: plansState, asyncStatus } = usePlans()
const editUserPlan = useUserPlanEdit()

// ---------------------
// Submit handler
// ---------------------
const onSubmit = async () => {
	if (!planCode.value) {
		toast.error('Please select a plan')
		return
	}

	try {
		await editUserPlan.mutateAsync({
			id: props.id,
			planCode: planCode.value,
		})

		toast.success('Plan updated successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while updating plan')
	}
}
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				size="sm"
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-accent/40 text-accent bg-accent/5 hover:bg-accent/10 transition-all duration-150 cursor-pointer"
			>
				<CreditCardIcon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle class="text-h font-bold tracking-tight text-xl">
					Change Plan
				</DialogTitle>
				<DialogDescription>
					Change the plan for <span class="font-semibold">{{ username }}</span
					>.
				</DialogDescription>
			</DialogHeader>

			<form @submit.prevent="onSubmit">
				<div class="py-4">
					<Label class="mb-5 font-semibold">Plan</Label>

					<Select v-model="planCode" :disabled="asyncStatus === 'loading'">
						<SelectTrigger>
							<SelectValue placeholder="Select plan" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="plan in plansState.data?.data ?? []"
								:key="plan.code"
								:value="plan.code"
							>
								{{ plan.name }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DialogFooter>
					<Button :disabled="editUserPlan.isLoading.value">
						{{ editUserPlan.isLoading.value ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
