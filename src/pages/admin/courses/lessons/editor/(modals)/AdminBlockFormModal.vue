<script setup lang="ts">
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
import { MarkdownEditor } from '@/shared/ui/markdown-editor'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
import type { BlockContent, BlockType } from '@/types/block'
import { PencilIcon, PlusIcon, XIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import {
	BLOCK_TYPE_LABELS,
	BLOCK_TYPE_OPTIONS,
	createDefaultContent,
} from '../block-types'

interface BlockFormValue {
	type: BlockType
	title: string
	content: BlockContent
}

// ---------------------
// props / emits
// ---------------------
const props = defineProps<{
	block?: { type: BlockType; title: string; content: BlockContent }
}>()
const emit = defineEmits<{ submit: [value: BlockFormValue] }>()

const isEdit = computed(() => !!props.block)

const dialogClass = computed(
	() =>
		`${selectedType.value === 'MARKDOWN' ? 'sm:max-w-5xl' : 'sm:max-w-2xl'} max-h-[85vh] overflow-y-auto`,
)

// ---------------------
// local state
// ---------------------
const isOpen = ref(false)
const selectedType = ref<BlockType>('MARKDOWN')
const draftTitle = ref('')
const draft = ref<any>(createDefaultContent('MARKDOWN'))

const textAnswerTypes: BlockType[] = [
	'FILL_IN_BLANK',
	'MANUAL_ANSWER',
	'REPHRASING',
]

const init = () => {
	if (props.block) {
		selectedType.value = props.block.type
		draftTitle.value = props.block.title
		draft.value = JSON.parse(JSON.stringify(props.block.content))
	} else {
		selectedType.value = 'MARKDOWN'
		draftTitle.value = ''
		draft.value = createDefaultContent('MARKDOWN')
	}
}

watch(isOpen, open => {
	if (open) init()
})

watch(selectedType, type => {
	if (!isEdit.value) draft.value = createDefaultContent(type)
})

// ---------------------
// array helpers
// ---------------------
const push = (key: string, value: unknown) => draft.value[key].push(value)
const removeAt = (key: string, index: number) =>
	draft.value[key].splice(index, 1)

// dialogue lines as plain text
const dialogueText = computed<string>({
	get: () => ((draft.value.dialogue as unknown[]) ?? []).join('\n'),
	set: val =>
		(draft.value.dialogue = val.split('\n').filter(line => line.length > 0)),
})

// build-sentence correct order as comma separated indices
const correctOrderText = computed<string>({
	get: () => ((draft.value.correctOrder as number[]) ?? []).join(', '),
	set: val =>
		(draft.value.correctOrder = val
			.split(',')
			.map(n => Number(n.trim()))
			.filter(n => !Number.isNaN(n))),
})

// ---------------------
// submit
// ---------------------
const onSubmit = () => {
	emit('submit', {
		type: selectedType.value,
		title: draftTitle.value.trim(),
		content: draft.value,
	})
	isOpen.value = false
}
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button
				v-if="isEdit"
				size="sm"
				class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-secondary/40 text-secondary bg-secondary/5 hover:bg-secondary/10 transition-all duration-150 cursor-pointer"
			>
				<PencilIcon class="size-3" />
			</Button>
			<Button v-else class="gap-1.5">
				<PlusIcon class="size-4" />
				Add Block
			</Button>
		</DialogTrigger>

		<DialogContent :class="dialogClass">
			<DialogHeader>
				<DialogTitle>{{ isEdit ? 'Edit Block' : 'New Block' }}</DialogTitle>
				<DialogDescription>
					{{
						isEdit
							? 'Update this block content.'
							: 'Choose a type and fill in the content.'
					}}
				</DialogDescription>
			</DialogHeader>

			<form @submit.prevent="onSubmit" class="flex flex-col gap-4 py-2">
				<!-- type -->
				<div class="flex flex-col gap-2">
					<Label>Type</Label>
					<Select v-model="selectedType" :disabled="isEdit">
						<SelectTrigger>
							<SelectValue>{{ BLOCK_TYPE_LABELS[selectedType] }}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="opt in BLOCK_TYPE_OPTIONS"
								:key="opt.value"
								:value="opt.value"
							>
								{{ opt.label }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<!-- title (optional) -->
				<div class="flex flex-col gap-2">
					<Label>Title (optional)</Label>
					<Input v-model="draftTitle" placeholder="Block title..." />
				</div>

				<!-- MARKDOWN -->
				<div v-if="selectedType === 'MARKDOWN'" class="flex flex-col gap-2">
					<Label>Text (Markdown)</Label>
					<MarkdownEditor v-model="draft.text" />
				</div>

				<!-- ONE_TRUE_CHOICE -->
				<template v-else-if="selectedType === 'ONE_TRUE_CHOICE'">
					<div class="flex flex-col gap-2">
						<Label>Question</Label>
						<Input v-model="draft.question" placeholder="Question..." />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Options</Label>
						<div
							v-for="(_, i) in (draft.options as string[])"
							:key="i"
							class="flex items-center gap-2"
						>
							<Input v-model="draft.options[i]" :placeholder="`Option ${i + 1}`" />
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								@click="removeAt('options', i)"
							>
								<XIcon class="size-4" />
							</Button>
						</div>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							class="self-start"
							@click="push('options', '')"
						>
							+ Add option
						</Button>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Correct answer</Label>
						<Input
							v-model="draft.correctAnswer"
							placeholder="Must match one option"
						/>
					</div>
				</template>

				<!-- text + answer (FILL_IN_BLANK / MANUAL_ANSWER / REPHRASING) -->
				<template v-else-if="textAnswerTypes.includes(selectedType)">
					<div class="flex flex-col gap-2">
						<Label>Text</Label>
						<textarea
							v-model="draft.text"
							rows="3"
							placeholder="Use ___ for the blank where relevant..."
							class="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
						/>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Correct answer</Label>
						<Input v-model="draft.correctAnswer" placeholder="Correct answer..." />
					</div>
				</template>

				<!-- BUILD_SENTENCE -->
				<template v-else-if="selectedType === 'BUILD_SENTENCE'">
					<div class="flex flex-col gap-2">
						<Label>Words</Label>
						<div
							v-for="(_, i) in (draft.words as string[])"
							:key="i"
							class="flex items-center gap-2"
						>
							<Input v-model="draft.words[i]" :placeholder="`Word ${i + 1}`" />
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								@click="removeAt('words', i)"
							>
								<XIcon class="size-4" />
							</Button>
						</div>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							class="self-start"
							@click="push('words', '')"
						>
							+ Add word
						</Button>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Correct order (indices)</Label>
						<Input v-model="correctOrderText" placeholder="e.g. 0, 1, 2, 3" />
						<p class="text-muted text-xs">
							Comma-separated word indices in the correct order.
						</p>
					</div>
				</template>

				<!-- TRANSLATION -->
				<template v-else-if="selectedType === 'TRANSLATION'">
					<div class="flex flex-col gap-2">
						<Label>Text</Label>
						<Input v-model="draft.text" placeholder="Text to translate..." />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Translate to</Label>
						<Input v-model="draft.translateTo" placeholder="Target language..." />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Correct answer</Label>
						<Input v-model="draft.correctAnswer" placeholder="Translation..." />
					</div>
				</template>

				<!-- MATCHING -->
				<template v-else-if="selectedType === 'MATCHING'">
					<div class="flex flex-col gap-2">
						<Label>Pairs</Label>
						<div
							v-for="(pair, i) in (draft.pairs as { left: string; right: string }[])"
							:key="i"
							class="flex items-center gap-2"
						>
							<Input v-model="pair.left" placeholder="Left" />
							<span class="text-muted">↔</span>
							<Input v-model="pair.right" placeholder="Right" />
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								@click="removeAt('pairs', i)"
							>
								<XIcon class="size-4" />
							</Button>
						</div>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							class="self-start"
							@click="push('pairs', { left: '', right: '' })"
						>
							+ Add pair
						</Button>
					</div>
				</template>

				<!-- DIALOGUE -->
				<template v-else-if="selectedType === 'DIALOGUE'">
					<div class="flex flex-col gap-2">
						<Label>Dialogue (one line per turn)</Label>
						<textarea
							v-model="dialogueText"
							rows="4"
							placeholder="A: Hi&#10;B: Hello, how are you?"
							class="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
						/>
					</div>
					<div class="flex flex-col gap-2">
						<Label>Questions</Label>
						<div
							v-for="(q, i) in (draft.questions as { question: string; correctAnswer: string }[])"
							:key="i"
							class="flex items-center gap-2"
						>
							<Input v-model="q.question" placeholder="Question" />
							<Input v-model="q.correctAnswer" placeholder="Answer" />
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								@click="removeAt('questions', i)"
							>
								<XIcon class="size-4" />
							</Button>
						</div>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							class="self-start"
							@click="push('questions', { question: '', correctAnswer: '' })"
						>
							+ Add question
						</Button>
					</div>
				</template>

				<!-- ERROR_CORRECTION -->
				<template v-else-if="selectedType === 'ERROR_CORRECTION'">
					<div class="flex flex-col gap-2">
						<Label>Text</Label>
						<Input v-model="draft.text" placeholder="Original text..." />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Error text</Label>
						<Input v-model="draft.errorText" placeholder="The incorrect part..." />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Correct answer</Label>
						<Input v-model="draft.correctAnswer" placeholder="Correction..." />
					</div>
				</template>

				<DialogFooter>
					<Button type="submit">{{ isEdit ? 'Apply' : 'Add Block' }}</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
