<script setup lang="ts">
import { computed, ref } from 'vue'
import { icons } from 'lucide-vue-next'
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverPortal,
	PopoverContent,
} from 'reka-ui'
import { refDebounced } from '@vueuse/core'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

// ---------------------
// props / model
// ---------------------

const model = defineModel<string>()

withDefaults(
	defineProps<{
		placeholder?: string
		disabled?: boolean
	}>(),
	{
		placeholder: 'Pick an icon',
	},
)

// ---------------------
// icon names
// ---------------------

const MAX = 150

const toPascalCase = (str: string): string =>
	str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')

const toKebabCase = (str: string): string =>
	str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
		.replace(/([a-zA-Z])([0-9])/g, '$1-$2')
		.toLowerCase()

const ICON_NAMES: string[] = Object.keys(icons)
	.map(toKebabCase)
	.filter(name => toPascalCase(name) in icons)

// ---------------------
// search
// ---------------------

const open = ref(false)
const query = ref('')
const debouncedQuery = refDebounced(query, 150)

const filtered = computed(() => {
	const q = debouncedQuery.value.trim().toLowerCase()
	const list = q ? ICON_NAMES.filter(name => name.includes(q)) : ICON_NAMES
	return list
})

const visible = computed(() => filtered.value.slice(0, MAX))
const hasMore = computed(() => filtered.value.length > MAX)

// ---------------------
// select
// ---------------------

const select = (name: string) => {
	model.value = name
	open.value = false
	query.value = ''
}
</script>

<template>
	<PopoverRoot v-model:open="open">
		<PopoverTrigger as-child>
			<Button type="button" variant="ghost" :disabled="disabled" class="w-full justify-start border border-border bg-input">
				<Icon v-if="model" :name="model" :size="18" />
				<span :class="model ? 'text-foreground' : 'text-muted'">
					{{ model || placeholder }}
				</span>
			</Button>
		</PopoverTrigger>

		<PopoverPortal>
			<PopoverContent
				align="start"
				:side-offset="6"
				class="z-50 w-80 rounded-2xl border border-border bg-card p-3 shadow-[0_4px_0_var(--border)]"
			>
				<Input v-model="query" placeholder="Search icons.." class="mb-3" />

				<div v-if="visible.length" class="grid max-h-72 grid-cols-8 gap-1 overflow-y-auto">
					<button
						v-for="name in visible"
						:key="name"
						type="button"
						:title="name"
						class="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-card-secondary"
						:class="name === model ? 'bg-primary/10 text-primary' : 'text-foreground'"
						@click="select(name)"
					>
						<Icon :name="name" :size="20" />
					</button>
				</div>

				<p v-else class="py-6 text-center text-sm text-muted-foreground">
					No icons found
				</p>

				<p v-if="hasMore" class="mt-2 text-center text-xs text-muted">
					Refine search to see more
				</p>
			</PopoverContent>
		</PopoverPortal>
	</PopoverRoot>
</template>
