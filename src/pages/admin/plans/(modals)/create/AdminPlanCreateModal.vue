<script setup lang="ts">
import { useUpsertPlan } from '@/api/billing/admin/plans/upsert/useUpsertPlan'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { toTypedSchema } from '@vee-validate/valibot'
import { PlusIcon } from 'lucide-vue-next'
import * as v from 'valibot'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// emits
// ---------------------
const emit = defineEmits(['success'])

// ---------------------
// schema
// ---------------------
const schema = v.object({
	code: v.pipe(v.string(), v.trim(), v.minLength(1, 'Code is required')),
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
	maxDictionaries: v.number('Required'),
	maxWordsPerDict: v.number('Required'),
	price: v.number('Required'),
})

// ---------------------
// api
// ---------------------
const upsertPlan = useUpsertPlan()

// ---------------------
// form
// ---------------------
const { handleSubmit, resetForm, isSubmitting } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		code: '',
		name: '',
		maxDictionaries: 2,
		maxWordsPerDict: 100,
		price: 0,
	},
})

// ---------------------
// fields
// ---------------------
const { value: code, errorMessage: codeError } = useField<string>('code')
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: maxDictionaries } = useField<number>('maxDictionaries')
const { value: maxWordsPerDict } = useField<number>('maxWordsPerDict')
const { value: price } = useField<number>('price')

const isOpen = ref(false)

// ---------------------
// submit
// ---------------------
const onSubmit = handleSubmit(async values => {
	try {
		await upsertPlan.mutateAsync({
			code: values.code,
			name: values.name,
			maxDictionaries: values.maxDictionaries,
			maxWordsPerDict: values.maxWordsPerDict,
			priceCents: Math.round(values.price * 100),
			isActive: true,
		})

		toast.success('Plan created successfully')
		resetForm()
		isOpen.value = false
		emit('success')
	} catch (e) {
		toast.error('Error while creating plan')
	}
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button class="gap-1.5">
				<PlusIcon class="size-4" />
				New Plan
			</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Plan</DialogTitle>
				<DialogDescription>Add a new subscription plan.</DialogDescription>
			</DialogHeader>

			<form @submit="onSubmit" class="py-2">
				<div class="grid grid-cols-2 gap-5">
					<div>
						<Label>Code</Label>
						<Input v-model="code" placeholder="e.g. PRO" />
						<p class="text-red-500 text-sm">{{ codeError }}</p>
					</div>

					<div>
						<Label>Name</Label>
						<Input v-model="name" placeholder="e.g. Pro" />
						<p class="text-red-500 text-sm">{{ nameError }}</p>
					</div>

					<div>
						<Label>Max dictionaries</Label>
						<Input v-model.number="maxDictionaries" type="number" min="0" />
					</div>

					<div>
						<Label>Max words / dict</Label>
						<Input v-model.number="maxWordsPerDict" type="number" min="0" />
					</div>

					<div>
						<Label>Price (USD)</Label>
						<Input
							v-model.number="price"
							type="number"
							min="0"
							step="0.01"
						/>
					</div>
				</div>

				<DialogFooter class="mt-4">
					<Button :disabled="isSubmitting">
						{{ isSubmitting ? 'Saving...' : 'Create' }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
