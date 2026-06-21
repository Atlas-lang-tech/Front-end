<script setup lang="ts">
import { useUpdatePlan } from '@/api/billing/admin/plans/update/useUpdatePlan'
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
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import type { Plan } from '@/types/billing'
import { PencilIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{ data: Plan }>()
const emit = defineEmits(['success'])

// ---------------------
// api
// ---------------------
const updatePlan = useUpdatePlan()

// ---------------------
// state
// ---------------------
const isOpen = defineModel<boolean>('open')

const name = ref(props.data.name)
const maxDictionaries = ref(props.data.maxDictionaries)
const maxWordsPerDict = ref(props.data.maxWordsPerDict)
const price = ref(props.data.priceCents / 100)
const isActive = ref(props.data.isActive)

watch(isOpen, open => {
	if (open) {
		name.value = props.data.name
		maxDictionaries.value = props.data.maxDictionaries
		maxWordsPerDict.value = props.data.maxWordsPerDict
		price.value = props.data.priceCents / 100
		isActive.value = props.data.isActive
	}
})

// ---------------------
// submit
// ---------------------
const onSubmit = async () => {
	try {
		await updatePlan.mutateAsync({
			code: props.data.code,
			name: name.value,
			maxDictionaries: maxDictionaries.value,
			maxWordsPerDict: maxWordsPerDict.value,
			priceCents: Math.round(price.value * 100),
			isActive: isActive.value,
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
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-secondary/40 text-secondary bg-secondary/5 hover:bg-secondary/10 transition-all duration-150 cursor-pointer"
			>
				<PencilIcon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>Edit Plan</DialogTitle>
				<DialogDescription>
					Editing plan
					<span class="font-semibold">{{ props.data.code }}</span>
				</DialogDescription>
			</DialogHeader>

			<form @submit.prevent="onSubmit" class="py-2">
				<div class="grid grid-cols-2 gap-5">
					<div>
						<Label>Name</Label>
						<Input v-model="name" placeholder="Plan name.." />
					</div>

					<div>
						<Label>Status</Label>
						<Select
							:model-value="isActive ? 'active' : 'inactive'"
							@update:model-value="val => (isActive = val === 'active')"
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Max dictionaries</Label>
						<Input v-model.number="maxDictionaries" type="number" min="0" />
					</div>

					<div>
						<Label>Max words / dict</Label>
						<Input v-model.number="maxWordsPerDict" type="number" min="0" />
					</div>

					<div>
						<Label>Price (USD)</Label>
						<Input v-model.number="price" type="number" min="0" step="0.01" />
					</div>
				</div>

				<DialogFooter class="mt-4">
					<Button :disabled="updatePlan.isLoading.value">
						{{ updatePlan.isLoading.value ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
