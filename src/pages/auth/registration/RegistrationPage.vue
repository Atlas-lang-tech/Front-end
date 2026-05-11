<script setup lang="ts">
import { useRegistration } from '@/api/auth/registration/useRegistration'
import { $PAGES } from '@/app/configs/pages.config'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Label from '@/shared/ui/label/Label.vue'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const schema = v.object({
	email: v.pipe(
		v.string(),
		v.trim(),
		v.email(),
		v.minLength(1, 'Email is required'),
	),
	username: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, 'Username is required'),
		v.maxLength(16, 'Username must be at most 16 characters'),
	),
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
})

const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		email: '',
		username: '',
		password: '',
	},
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: username, errorMessage: usernameError } =
	useField<string>('username')
const { value: password, errorMessage: passwordError } =
	useField<string>('password')

const registration = useRegistration()

const onSubmit = handleSubmit(async formValues => {
	try {
		await registration.mutateAsync({
			email: formValues.email,
			username: formValues.username,
			password: formValues.password,
		})

		toast.success('Account created successfully')
		resetForm()
	} catch (e) {
		toast.error('Error while creating account')
	}
})
</script>

<template>
	<div class="flex flex-col">
		<div class="mx-auto">
			<img src="/logo.svg" alt="Logo" class="w-32 h-32 -mb-3" />
		</div>
		<div class="bg-card p-10 border-2 rounded-xl max-w-[26rem]">
			<div class="text-center mb-7">
				<h1 class="text-2xl font-bold">Create Account</h1>
				<p class="text-sm text-muted-foreground">
					Join us today! Please fill in your details to get started
				</p>
			</div>

			<form @submit="onSubmit">
				<div class="flex flex-col gap-2 mb-4">
					<Label for="email" class="font-semibold">Email</Label>
					<Input
						v-model="email"
						id="email"
						type="email"
						placeholder="Enter your email..."
					/>
					<p class="text-red-500 text-sm">{{ emailError }}</p>
				</div>
				<div class="flex flex-col gap-2 mb-4">
					<Label for="username" class="font-semibold">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="Enter your username..."
						v-model="username"
					/>
					<p class="text-red-500 text-sm">{{ usernameError }}</p>
				</div>
				<div class="flex flex-col gap-2 mb-4">
					<Label for="password" class="font-semibold">Password</Label>
					<Input
						id="password"
						v-model="password"
						type="password"
						placeholder="Enter your password..."
					/>
					<p class="text-red-500 text-sm">{{ passwordError }}</p>
				</div>
				<p class="text-sm text-center mb-5 text-muted-foreground">
					By creating an account, you agree to our
					<span class="text-primary">Terms of Service and Privacy Policy.</span>
				</p>
				<Button class="w-full" :disabled="isSubmitting">Create Account</Button>
			</form>
			<p class="text-center text-muted mt-5">
				Already have an account?
				<RouterLink :to="$PAGES.auth.login" class="text-primary">
					Sign In
				</RouterLink>
			</p>
		</div>
	</div>
</template>
