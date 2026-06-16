<script setup lang="ts">
import { useWordDelete } from '@/api/vocabulary/words/delete/useWordDelete'
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

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	id: number
	word: string
}>()

const emit = defineEmits(['success'])

// ---------------------
// api
// ---------------------
const isOpen = ref(false)
const deleteWord = useWordDelete()

// ---------------------
// submit
// ---------------------
const handleDelete = async () => {
	try {
		await deleteWord.mutateAsync({ id: props.id })
		toast.success('Word deleted successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while deleting word')
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
				<DialogTitle>Delete Word</DialogTitle>
				<DialogDescription>This will permanently delete the word.</DialogDescription>
			</DialogHeader>

			<div class="py-4">
				<h1 class="text-lg font-semibold">
					Are you sure you want to delete
					<span class="text-xl px-3 bg-background rounded-2xl">
						{{ props.word }}
					</span>
					?
				</h1>
			</div>

			<DialogFooter>
				<Button variant="ghost" @click="isOpen = false">Cancel</Button>
				<Button
					:disabled="deleteWord.isLoading.value"
					variant="destructive"
					@click="handleDelete"
				>
					{{ deleteWord.isLoading.value ? 'Deleting...' : 'Delete' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
