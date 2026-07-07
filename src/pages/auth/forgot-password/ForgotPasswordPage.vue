<script setup lang="ts">
import { useForgotPassword } from '@/api/auth/forgot-password/useForgotPassword'
import { $PAGES } from '@/app/configs/pages.config'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Label from '@/shared/ui/label/Label.vue'
import { toTypedSchema } from '@vee-validate/valibot'
import { ref } from 'vue'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

// ---------------------
// schema
// ---------------------

const schema = v.object({
	email: v.pipe(
		v.string(),
		v.trim(),
		v.email(),
		v.minLength(1, 'Email is required'),
	),
})

// ---------------------
// api
// ---------------------

const forgotPassword = useForgotPassword()
const submitted = ref(false)

// ---------------------
// form
// ---------------------

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		email: '',
	},
})

// ---------------------
// fields
// ---------------------

const { value: email, errorMessage: emailError } = useField<string>('email')

// ---------------------
// submit
// ---------------------

const onSubmit = handleSubmit(async formValues => {
	try {
		await forgotPassword.mutateAsync({ email: formValues.email })
		submitted.value = true
	} catch (e) {
		toast.error('Error while sending reset link')
	}
})
</script>

<template>
	<div class="flex flex-col">
		<div class="mx-auto">
			<img src="/logo.svg" alt="Logo" class="w-32 h-32 -mb-3" />
		</div>
		<div class="bg-card p-10 border-2 rounded-xl max-w-[26rem]">
			<div v-if="!submitted">
				<div class="text-center mb-7">
					<h1 class="text-2xl font-bold">Forgot Password</h1>
					<p class="text-sm text-muted-foreground">
						Enter your email and we'll send you a link to reset your password
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
					<Button class="w-full" :disabled="isSubmitting">
						Send Reset Link
					</Button>
				</form>
			</div>

			<div v-else class="text-center">
				<h1 class="text-2xl font-bold mb-3">Check Your Email</h1>
				<p class="text-sm text-muted-foreground">
					If an account exists for that address, we've sent a link to reset
					your password. Please check your inbox.
				</p>
			</div>

			<p class="text-center text-muted mt-5">
				Remembered your password?
				<RouterLink :to="$PAGES.auth.login" class="text-primary">
					Sign In
				</RouterLink>
			</p>
		</div>
	</div>
</template>
