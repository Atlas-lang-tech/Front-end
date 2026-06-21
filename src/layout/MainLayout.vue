<script setup lang="ts">
import MainNavbar from '@/components/main/Navbar/MainNavbar.vue'
import { useBillingStore } from '@/stores/billing.store'
import { useUserStore } from '@/stores/user.store'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// ---------------------
// stores
// ---------------------

const userStore = useUserStore()
const billingStore = useBillingStore()

onMounted(() => {
	if (userStore.isAuthenticated) {
		billingStore.loadSubscription()
		billingStore.loadPurchases()
		billingStore.loadPlans()
	}
})
</script>

<template>
	<div class="flex flex-col h-svh overflow-hidden">
		<MainNavbar />
		<main class="flex-1 overflow-auto">
			<RouterView />
		</main>
	</div>
</template>
