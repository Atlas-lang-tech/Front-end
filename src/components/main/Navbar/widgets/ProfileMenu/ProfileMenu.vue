<script setup lang="ts">
import { $PAGES } from '@/app/configs/pages.config'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useUserStore } from '@/stores/user.store'
import { LayoutDashboard, LogOut, User } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// ---------------------
// store / router
// ---------------------

const userStore = useUserStore()
const router = useRouter()

// ---------------------
// roles
// ---------------------

const isAdmin = computed(
	() =>
		userStore.user?.role === 'ADMIN' || userStore.user?.role === 'MODERATOR',
)

// ---------------------
// logout
// ---------------------

const logout = () => {
	userStore.clearUser()
	localStorage.removeItem('accessToken')
	router.push($PAGES.auth.login)
}
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger
			class="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			aria-label="User Profile Menu"
		>
			<User class="w-5 h-5" />
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end" class="min-w-56">
			<DropdownMenuLabel>
				<div class="flex flex-col">
					<span class="font-semibold">
						{{ userStore.user?.username ?? 'Guest' }}
					</span>
					<span
						v-if="userStore.user?.email"
						class="text-xs text-muted-foreground font-normal"
					>
						{{ userStore.user.email }}
					</span>
				</div>
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<RouterLink :to="$PAGES.main.index">
				<DropdownMenuItem class="cursor-pointer gap-2">
					<LayoutDashboard class="w-4 h-4" />
					Dashboard
				</DropdownMenuItem>
			</RouterLink>

			<RouterLink :to="$PAGES.main.profile">
				<DropdownMenuItem class="cursor-pointer gap-2">
					<User class="w-4 h-4" />
					Profile
				</DropdownMenuItem>
			</RouterLink>

			<RouterLink v-if="isAdmin" :to="$PAGES.admin.dashboard">
				<DropdownMenuItem class="cursor-pointer gap-2">
					<LayoutDashboard class="w-4 h-4" />
					Admin Panel
				</DropdownMenuItem>
			</RouterLink>

			<DropdownMenuItem
				class="cursor-pointer gap-2 text-destructive"
				@click="logout"
			>
				<LogOut class="w-4 h-4" />
				Log out
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
