<script setup lang="ts">
import { useResetPassword } from '@/api/auth/reset-password/useResetPassword'
import { $PAGES } from '@/app/configs/pages.config'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Label from '@/shared/ui/label/Label.vue'
import { toTypedSchema } from '@vee-validate/valibot'
import { computed } from 'vue'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// ---------------------
// token
// ---------------------

const route = useRoute()
const router = useRouter()
const token = computed(() => String(route.query.token ?? ''))

// ---------------------
// schema
// ---------------------

const schema = v.pipe(
	v.object({
		password: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(8, 'Password must be at least 8 characters'),
			v.maxLength(24, 'Password must be at most 24 characters'),
			v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
			v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
			v.regex(/[0-9]/, 'Password must contain at least one number'),
			v.regex(
				/[^A-Za-z0-9]/,
				'Password must contain at least one special character',
			),
		),
		confirmPassword: v.pipe(v.string(), v.minLength(1, 'Please confirm your password')),
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['confirmPassword']],
			input => input.password === input.confirmPassword,
			'Passwords do not match',
		),
		['confirmPassword'],
	),
)

// ---------------------
// api
// ---------------------

const resetPassword = useResetPassword()

// ---------------------
// form
// ---------------------

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		password: '',
		confirmPassword: '',
	},
})

// ---------------------
// fields
// ---------------------

const { value: password, errorMessage: passwordError } =
	useField<string>('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } =
	useField<string>('confirmPassword')

// ---------------------
// submit
// ---------------------

const onSubmit = handleSubmit(async formValues => {
	if (!token.value) {
		toast.error('Reset link is invalid or expired')
		return
	}

	try {
		await resetPassword.mutateAsync({
			token: token.value,
			newPassword: formValues.password,
		})
		toast.success('Password reset successfully')
		router.push($PAGES.auth.login)
	} catch (e) {
		toast.error('Reset link is invalid or expired')
	}
})
</script>

<template>
	<div class="flex flex-col">
		<div class="mx-auto">
			<img src="/logo.svg" alt="Logo" class="w-32 h-32 -mb-3" />
		</div>
		<div class="bg-card p-10 border-2 rounded-xl max-w-[26rem]">
			<div v-if="!token" class="text-center">
				<h1 class="text-2xl font-bold mb-3">Invalid Link</h1>
				<p class="text-sm text-muted-foreground">
					This password reset link is invalid or has expired. Please request a
					new one.
				</p>
				<RouterLink
					:to="$PAGES.auth.forgotPassword"
					class="text-primary block mt-5"
				>
					Request new link
				</RouterLink>
			</div>

			<div v-else>
				<div class="text-center mb-7">
					<h1 class="text-2xl font-bold">Reset Password</h1>
					<p class="text-sm text-muted-foreground">
						Choose a new password for your account
					</p>
				</div>

				<form @submit="onSubmit">
					<div class="flex flex-col gap-2 mb-4">
						<Label for="password" class="font-semibold">New Password</Label>
						<Input
							id="password"
							v-model="password"
							type="password"
							placeholder="Enter your new password..."
						/>
						<p class="text-red-500 text-sm">{{ passwordError }}</p>
					</div>
					<div class="flex flex-col gap-2 mb-4">
						<Label for="confirmPassword" class="font-semibold">
							Confirm Password
						</Label>
						<Input
							id="confirmPassword"
							v-model="confirmPassword"
							type="password"
							placeholder="Repeat your new password..."
						/>
						<p class="text-red-500 text-sm">{{ confirmPasswordError }}</p>
					</div>
					<Button class="w-full" :disabled="isSubmitting">
						Reset Password
					</Button>
				</form>
			</div>
		</div>
	</div>
</template>
