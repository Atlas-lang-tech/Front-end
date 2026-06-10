<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import { useUserStore } from '@/stores/user.store'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Mail, Settings } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// ---------------------
// store
// ---------------------

const { user } = storeToRefs(useUserStore())

// ---------------------
// computed
// ---------------------

const initials = computed(() => {
	const name = user.value?.username ?? ''
	return name.slice(0, 2).toUpperCase() || '?'
})

const roleVariant = computed(() => {
	switch (user.value?.role) {
		case 'ADMIN':
			return 'destructive'
		case 'MODERATOR':
			return 'pending'
		default:
			return 'success'
	}
})
</script>

<template>
	<div class="max-w-3xl mx-auto w-full">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">Profile</h1>
				<p class="text-sm text-muted-foreground">
					Your account information
				</p>
			</div>
			<RouterLink :to="$PAGES.user.settings">
				<Button variant="ghost" class="gap-2">
					<Settings class="w-4 h-4" />
					Edit in Settings
				</Button>
			</RouterLink>
		</div>

		<Card class="p-6">
			<div class="flex items-center gap-5">
				<div
					class="flex items-center justify-center h-20 w-20 shrink-0 rounded-full bg-primary text-white text-2xl font-bold"
				>
					{{ initials }}
				</div>
				<div class="min-w-0">
					<div class="flex items-center gap-3">
						<h2 class="text-xl font-bold truncate">
							{{ user?.username ?? 'Guest' }}
						</h2>
						<Badge :variant="roleVariant">{{ user?.role }}</Badge>
					</div>
					<p
						class="flex items-center gap-1.5 text-sm text-muted-foreground mt-1"
					>
						<Mail class="w-4 h-4 shrink-0" />
						{{ user?.email ?? '—' }}
					</p>
				</div>
			</div>

			<div class="border-t border-border mt-6 pt-6 grid grid-cols-2 gap-4">
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">Username</p>
					<p class="font-medium mt-1">{{ user?.username ?? '—' }}</p>
				</div>
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">Email</p>
					<p class="font-medium mt-1 truncate">{{ user?.email ?? '—' }}</p>
				</div>
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">Role</p>
					<p class="font-medium mt-1">{{ user?.role ?? '—' }}</p>
				</div>
				<div>
					<p class="text-xs text-muted uppercase tracking-wide">User ID</p>
					<p class="font-medium mt-1 truncate">{{ user?.id ?? '—' }}</p>
				</div>
			</div>
		</Card>
	</div>
</template>
