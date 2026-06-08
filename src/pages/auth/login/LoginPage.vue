<script setup lang="ts">
import { useLogin } from '@/api/auth/login/useLogin'
import { $PAGES } from '@/app/configs/pages.config'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Label from '@/shared/ui/label/Label.vue'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const schema = v.object({
	email: v.pipe(
		v.string(),
		v.trim(),
		v.email(),
		v.minLength(1, 'Email is required'),
	),
	password: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, 'Password is required'),
	),
})

const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		email: '',
		password: '',
	},
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } =
	useField<string>('password')

const login = useLogin()
const router = useRouter()

const onSubmit = handleSubmit(async formValues => {
	try {
		await login.mutateAsync({
			email: formValues.email,
			password: formValues.password,
		})

		toast.success('Logged in successfully')
		resetForm()
		router.push($PAGES.main.index)
	} catch (e) {
		toast.error('Error while logging in')
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
				<h1 class="text-2xl font-bold">Log In</h1>
				<p class="text-sm text-muted-foreground">
					Welcome back! Please enter your credentials to access your account
				</p>
			</div>

			<form @submit="onSubmit">
				<div class="flex flex-col gap-2 mb-4">
					<Label for="email" class="font-semibold">Email</Label>
					<Input
						id="email"
						v-model="email"
						type="email"
						placeholder="Enter your email..."
					/>
					<p class="text-red-500 text-sm">{{ emailError }}</p>
				</div>
				<div class="flex flex-col gap-2 mb-4">
					<div>
						<Label for="password" class="font-semibold">Password</Label>
						<RouterLink
							:to="$PAGES.auth.forgotPassword"
							class="text-sm text-muted-foreground float-right hover:text-primary transition-colors duration-300"
						>
							Forgot Password?
						</RouterLink>
					</div>
					<Input
						id="password"
						v-model="password"
						type="password"
						placeholder="Enter your password..."
					/>
					<p class="text-red-500 text-sm">{{ passwordError }}</p>
				</div>
				<Button class="w-full" :disabled="isSubmitting">Log In</Button>
			</form>
			<p class="text-center text-muted mt-5">
				Don't have an account?
				<RouterLink :to="$PAGES.auth.register" class="text-primary">
					Sign Up
				</RouterLink>
			</p>
		</div>
	</div>
</template>
