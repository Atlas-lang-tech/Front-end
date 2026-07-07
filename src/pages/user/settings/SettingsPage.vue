<script setup lang="ts">
import AccountForm from './widgets/AccountForm.vue'
import DeleteAccount from './widgets/DeleteAccount.vue'
import LanguageForm from './widgets/LanguageForm.vue'
import PasswordForm from './widgets/PasswordForm.vue'
</script>

<template>
	<div class="max-w-3xl mx-auto w-full">
		<div class="mb-6">
			<h1 class="text-2xl font-bold">Settings</h1>
			<p class="text-sm text-muted-foreground">
				Manage your account preferences
			</p>
		</div>
		<div class="flex flex-col gap-6">
			<AccountForm />
			<LanguageForm />
			<PasswordForm />
			<DeleteAccount />
		</div>
	</div>
</template>
