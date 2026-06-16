<script setup lang="ts">
import { useUserPasswordEdit } from '@/api/users/password/useUserPasswordEdit'
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
// api
// ---------------------

const passwordEdit = useUserPasswordEdit()

// ---------------------
// schema
// ---------------------

const schema = v.pipe(
	v.object({
		currentPassword: v.pipe(
			v.string(),
			v.minLength(1, 'Current password is required'),
		),
		newPassword: v.pipe(
			v.string(),
			v.minLength(8, 'Password must be at least 8 characters'),
		),
		confirmPassword: v.pipe(v.string(), v.minLength(1, 'Please confirm')),
	}),
	v.forward(
		v.partialCheck(
			[['newPassword'], ['confirmPassword']],
			input => input.newPassword === input.confirmPassword,
			'Passwords do not match',
		),
		['confirmPassword'],
	),
)

// ---------------------
// form
// ---------------------

const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	},
})

// ---------------------
// fields
// ---------------------

const { value: currentPassword, errorMessage: currentPasswordError } =
	useField<string>('currentPassword')
const { value: newPassword, errorMessage: newPasswordError } =
	useField<string>('newPassword')
const { value: confirmPassword, errorMessage: confirmPasswordError } =
	useField<string>('confirmPassword')

// ---------------------
// submit
// ---------------------

const onSubmit = handleSubmit(async values => {
	if (!userStore.user) return
	try {
		await passwordEdit.mutateAsync({
			id: userStore.user.id,
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		})
		toast.success('Password changed')
		resetForm()
	} catch (e) {
		toast.error('Failed to change password')
	}
})
</script>

<template>
	<Card class="p-6">
		<div class="mb-5">
			<h2 class="text-lg font-bold">Change password</h2>
			<p class="text-sm text-muted-foreground">
				Update your account password
			</p>
		</div>
		<form @submit="onSubmit" class="flex flex-col gap-4">
			<div>
				<Label>Current password</Label>
				<Input
					v-model="currentPassword"
					type="password"
					placeholder="Enter current password.."
				/>
				<p class="text-red-500 text-sm">{{ currentPasswordError }}</p>
			</div>
			<div>
				<Label>New password</Label>
				<Input
					v-model="newPassword"
					type="password"
					placeholder="Enter new password.."
				/>
				<p class="text-red-500 text-sm">{{ newPasswordError }}</p>
			</div>
			<div>
				<Label>Confirm new password</Label>
				<Input
					v-model="confirmPassword"
					type="password"
					placeholder="Repeat new password.."
				/>
				<p class="text-red-500 text-sm">{{ confirmPasswordError }}</p>
			</div>
			<Button type="submit" size="sm" class="self-end" :disabled="isSubmitting">
				{{ isSubmitting ? 'Saving...' : 'Change password' }}
			</Button>
		</form>
	</Card>
</template>
