<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import { useUserStore } from '@/stores/user.store'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// ---------------------
// store / router
// ---------------------

const userStore = useUserStore()
const router = useRouter()

// ---------------------
// state
// ---------------------

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------

const onDelete = () => {
	console.log('[settings] delete account', userStore.user?.id)
	userStore.clearUser()
	localStorage.removeItem('accessToken')
	toast.success('Account deleted')
	isOpen.value = false
	router.push($PAGES.auth.login)
}
</script>

<template>
	<Card class="p-6 border-destructive">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-lg font-bold text-destructive">Danger zone</h2>
				<p class="text-sm text-muted-foreground">
					Permanently delete your account and all of its data
				</p>
			</div>
			<Dialog v-model:open="isOpen">
				<DialogTrigger as-child>
					<Button variant="destructive" size="sm">Delete account</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete account</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Your account will be permanently
							removed.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="ghost" size="sm" @click="isOpen = false">
							Cancel
						</Button>
						<Button variant="destructive" size="sm" @click="onDelete">
							Yes, delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	</Card>
</template>
