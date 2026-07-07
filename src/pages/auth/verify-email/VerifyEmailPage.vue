<script setup lang="ts">
import { useVerifyEmail } from '@/api/auth/verify-email/useVerifyEmail'
import { $PAGES } from '@/app/configs/pages.config'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// ---------------------
// token
// ---------------------

const route = useRoute()

// ---------------------
// api
// ---------------------

const verifyEmail = useVerifyEmail()
const status = ref<'loading' | 'success' | 'error'>('loading')

// ---------------------
// submit
// ---------------------

onMounted(async () => {
	const token = String(route.query.token ?? '')
	if (!token) {
		status.value = 'error'
		return
	}

	try {
		await verifyEmail.mutateAsync({ token })
		status.value = 'success'
	} catch (e) {
		status.value = 'error'
	}
})
</script>

<template>
	<div class="flex flex-col">
		<div class="mx-auto">
			<img src="/logo.svg" alt="Logo" class="w-32 h-32 -mb-3" />
		</div>
		<div class="bg-card p-10 border-2 rounded-xl max-w-[26rem] text-center">
			<div v-if="status === 'loading'">
				<h1 class="text-2xl font-bold mb-3">Verifying...</h1>
				<p class="text-sm text-muted-foreground">
					Please wait while we confirm your email address.
				</p>
			</div>

			<div v-else-if="status === 'success'">
				<h1 class="text-2xl font-bold mb-3">Email Verified</h1>
				<p class="text-sm text-muted-foreground">
					Your email has been confirmed. You can now sign in to your account.
				</p>
				<RouterLink :to="$PAGES.auth.login" class="text-primary block mt-5">
					Go to Sign In
				</RouterLink>
			</div>

			<div v-else>
				<h1 class="text-2xl font-bold mb-3">Verification Failed</h1>
				<p class="text-sm text-muted-foreground">
					This verification link is invalid or has expired.
				</p>
				<RouterLink :to="$PAGES.auth.login" class="text-primary block mt-5">
					Back to Sign In
				</RouterLink>
			</div>
		</div>
	</div>
</template>
