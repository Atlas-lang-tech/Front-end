<script setup lang="ts">
import { useDictionaryDelete } from '@/api/vocabulary/dictionaries/delete/useDictionaryDelete'
import { useUserStore } from '@/stores/user.store'
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
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	title: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// store
// ---------------------
const { user } = storeToRefs(useUserStore())

// ---------------------
// api
// ---------------------
const isOpen = ref(false)
const deleteDictionary = useDictionaryDelete()

// ---------------------
// submit
// ---------------------
const handleDelete = async () => {
	if (!user.value?.id) {
		toast.error('You must be logged in')
		return
	}

	try {
		await deleteDictionary.mutateAsync({ id: props.id, userId: user.value.id })
		toast.success('Dictionary deleted successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while deleting dictionary')
	}
}
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				size="sm"
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-destructive/40 text-destructive bg-destructive/5 hover:bg-destructive/10"
			>
				<Trash2Icon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Dictionary</DialogTitle>
				<DialogDescription>
					This will permanently delete the dictionary and all its words.
				</DialogDescription>
			</DialogHeader>

			<div class="py-4">
				<h1 class="text-lg font-semibold">
					Are you sure you want to delete
					<span class="text-xl px-3 bg-background rounded-2xl">
						{{ props.title }}
					</span>
					?
				</h1>
			</div>

			<DialogFooter>
				<Button variant="ghost" @click="isOpen = false">Cancel</Button>
				<Button
					:disabled="deleteDictionary.isLoading.value"
					variant="destructive"
					@click="handleDelete"
				>
					{{ deleteDictionary.isLoading.value ? 'Deleting...' : 'Delete' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
