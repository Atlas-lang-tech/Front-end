<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { useUserRoleEdit } from '@/api/users/role/useUserRoleEdit'
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
import type { User } from '@/types/user'
import { ShieldIcon } from 'lucide-vue-next'

// ---------------------
// Props / emits
// ---------------------
const props = defineProps<{
	id: string
	username: string
	role: User['role']
}>()

const emit = defineEmits(['success'])

// ---------------------
// Dialog state
// ---------------------
const isOpen = ref(false)

const ROLES: User['role'][] = ['USER', 'MODERATOR', 'ADMIN']

const role = ref<User['role']>(props.role)

// ---------------------
// Sync props -> local state when dialog opens
// ---------------------
watch(isOpen, open => {
	if (open) {
		role.value = props.role
	}
})

// ---------------------
// Api
// ---------------------
const editUserRole = useUserRoleEdit()

// ---------------------
// Submit handler
// ---------------------
const onSubmit = async () => {
	try {
		await editUserRole.mutateAsync({
			id: props.id,
			role: role.value,
		})

		toast.success('Role updated successfully')

		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while updating role')
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
				<ShieldIcon class="size-3" />
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle class="text-h font-bold tracking-tight text-xl">
					Edit Role
				</DialogTitle>
				<DialogDescription>
					Change the role for <span class="font-semibold">{{ username }}</span
					>.
				</DialogDescription>
			</DialogHeader>

			<form @submit.prevent="onSubmit">
				<div class="py-4">
					<Label class="mb-5 font-semibold">Role</Label>

					<Select v-model="role">
						<SelectTrigger>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem v-for="r in ROLES" :key="r" :value="r">
								{{ r }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DialogFooter>
					<Button :disabled="editUserRole.isLoading.value">
						{{ editUserRole.isLoading.value ? 'Saving...' : 'Save Changes' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
