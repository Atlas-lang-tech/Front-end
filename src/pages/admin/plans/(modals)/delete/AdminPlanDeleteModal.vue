<script setup lang="ts">
import { useDeletePlan } from '@/api/billing/admin/plans/delete/useDeletePlan'
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
import { Trash2Icon } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
	code: string
	name: string
}>()

const emit = defineEmits(['success'])

const isOpen = ref(false)
const deletePlan = useDeletePlan()

const handleDelete = async () => {
	try {
		await deletePlan.mutateAsync({ code: props.code })
		toast.success('Plan deleted successfully')
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while deleting plan')
	}
}
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				size="sm"
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-destructive/40 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all duration-150 cursor-pointer"
			>
				<Trash2Icon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle class="text-h font-bold tracking-tight text-xl">
					Delete Plan
				</DialogTitle>
				<DialogDescription>Here you can delete the plan.</DialogDescription>
			</DialogHeader>

			<div class="py-4">
				<h1 class="text-lg font-semibold">
					Are you sure you want to delete the plan
					<span class="text-xl px-3 bg-background rounded-2xl">
						{{ props.name }}
					</span>
					?
				</h1>
			</div>

			<DialogFooter>
				<Button variant="ghost" @click="isOpen = false" class="cursor-pointer">
					Cancel
				</Button>
				<Button
					:disabled="deletePlan.isLoading.value"
					variant="destructive"
					@click="handleDelete"
					class="cursor-pointer"
				>
					{{ deletePlan.isLoading.value ? 'Deleting...' : 'Delete' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
