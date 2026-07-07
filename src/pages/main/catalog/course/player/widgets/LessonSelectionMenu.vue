<script setup lang="ts">
import { useTranslate } from '@/api/translate/useTranslate'
import { useDictionaryGetByUser } from '@/api/vocabulary/dictionaries/get/byUser/useDictionaryGetByUser'
import { useWordCreate } from '@/api/vocabulary/words/create/useWordCreate'
import Icon from '@/shared/icon.vue'
import { Button } from '@/shared/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import { useUserStore } from '@/stores/user.store'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

// ---------------------
// props
// ---------------------

const props = defineProps<{
	sourceCode: string
	targetCode: string
}>()

// ---------------------
// store
// ---------------------

const { user } = storeToRefs(useUserStore())
const userId = computed(() => user.value?.id ?? '')

// ---------------------
// api
// ---------------------

const translate = useTranslate()
const addWord = useWordCreate()
const { state: dictionariesState } = useDictionaryGetByUser(userId)

const dictionaries = computed(
	() => dictionariesState.value.data?.data ?? [],
)

// ---------------------
// menu state
// ---------------------

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })

const selectedText = ref('')
const translation = ref('')
const dictionaryId = ref<string>('')

const MENU_WIDTH = 288
const MENU_MARGIN = 12

const reset = () => {
	translation.value = ''
	dictionaryId.value = ''
}

const close = () => {
	open.value = false
}

// ---------------------
// open on selection + right click
// ---------------------

const onContextMenu = (e: MouseEvent) => {
	const target = e.target as HTMLElement | null
	if (target?.closest('input, textarea')) return

	const text = window.getSelection()?.toString().trim() ?? ''
	if (!text) return

	e.preventDefault()

	selectedText.value = text
	reset()

	const x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH - MENU_MARGIN)
	const y = Math.min(e.clientY, window.innerHeight - 80)
	position.value = { x: Math.max(MENU_MARGIN, x), y: Math.max(MENU_MARGIN, y) }

	open.value = true
}

// ---------------------
// translate
// ---------------------

const onTranslate = async () => {
	try {
		translation.value = await translate.mutateAsync({
			q: selectedText.value,
			source: props.sourceCode,
			target: props.targetCode,
		})
	} catch {
		toast.error('Translation failed')
	}
}

// ---------------------
// add to dictionary
// ---------------------

const onAdd = async () => {
	if (!dictionaryId.value) return
	try {
		await addWord.mutateAsync({
			dictionaryId: Number(dictionaryId.value),
			word: selectedText.value,
			translation: translation.value,
		})
		toast.success('Word added to dictionary')
		close()
	} catch {
		toast.error('Failed to add word')
	}
}

// ---------------------
// close handlers
// ---------------------

onClickOutside(menuRef, () => close(), {
	ignore: ['[data-reka-popper-content-wrapper]', '[data-slot="select-content"]'],
})

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
	if (e.key === 'Escape') close()
})
</script>

<template>
	<div @contextmenu="onContextMenu">
		<slot />

		<Teleport to="body">
			<div
				v-if="open"
				ref="menuRef"
				class="fixed z-50 w-72 rounded-2xl border border-border bg-card p-3 shadow-[0_4px_0_var(--border)]"
				:style="{ left: `${position.x}px`, top: `${position.y}px` }"
			>
				<p class="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
					{{ selectedText }}
				</p>

				<!-- before translation -->
				<Button
					v-if="!translation"
					class="w-full gap-1.5"
					size="sm"
					:disabled="translate.isLoading.value"
					@click="onTranslate"
				>
					<Icon name="languages" :size="16" />
					{{ translate.isLoading.value ? 'Translating...' : 'Translate' }}
				</Button>

				<!-- after translation -->
				<template v-else>
					<div class="mb-3 rounded-lg bg-card-secondary px-3 py-2">
						<p class="text-sm text-foreground">{{ translation }}</p>
					</div>

					<p class="mb-1.5 text-xs font-medium text-muted-foreground">
						Add to dictionary
					</p>

					<Select v-model="dictionaryId">
						<SelectTrigger size="sm" class="w-full">
							<SelectValue placeholder="Choose dictionary" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="dict in dictionaries"
								:key="dict.id"
								:value="String(dict.id)"
							>
								{{ dict.title }}
							</SelectItem>
						</SelectContent>
					</Select>

					<Button
						class="mt-2 w-full gap-1.5"
						size="sm"
						:disabled="!dictionaryId || addWord.isLoading.value"
						@click="onAdd"
					>
						<Icon name="plus" :size="16" />
						{{ addWord.isLoading.value ? 'Adding...' : 'Add' }}
					</Button>
				</template>
			</div>
		</Teleport>
	</div>
</template>
