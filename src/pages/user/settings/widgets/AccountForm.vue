<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

// ---------------------
// store
// ---------------------

const userStore = useUserStore()

// ---------------------
// schema
// ---------------------

const schema = v.object({
	username: v.pipe(v.string(), v.trim(), v.minLength(1, 'Username is required')),
	email: v.pipe(v.string(), v.trim(), v.email('Invalid email')),
})

// ---------------------
// form
// ---------------------

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		username: userStore.user?.username ?? '',
		email: userStore.user?.email ?? '',
	},
})

// ---------------------
// fields
// ---------------------

const { value: username, errorMessage: usernameError } =
	useField<string>('username')
const { value: email, errorMessage: emailError } = useField<string>('email')

// ---------------------
// submit
// ---------------------

const onSubmit = handleSubmit(async values => {
	console.log('[settings] update account', values)
	if (userStore.user) {
		userStore.setUser({ ...userStore.user, ...values })
	}
	toast.success('Account updated')
})
</script>

<template>
	<Card class="p-6">
		<div class="mb-5">
			<h2 class="text-lg font-bold">Account</h2>
			<p class="text-sm text-muted-foreground">
				Update your username and email
			</p>
		</div>
		<form @submit="onSubmit" class="flex flex-col gap-4">
			<div>
				<Label>Username</Label>
				<Input v-model="username" placeholder="Enter username.." />
				<p class="text-red-500 text-sm">{{ usernameError }}</p>
			</div>
			<div>
				<Label>Email</Label>
				<Input v-model="email" placeholder="Enter email.." />
				<p class="text-red-500 text-sm">{{ emailError }}</p>
			</div>
			<Button type="submit" size="sm" class="self-end" :disabled="isSubmitting">
				{{ isSubmitting ? 'Saving...' : 'Save changes' }}
			</Button>
		</form>
	</Card>
</template>
