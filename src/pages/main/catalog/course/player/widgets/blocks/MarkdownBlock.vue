<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import { MarkdownPreview } from '@/shared/ui/markdown-preview'
import type { MarkdownContent } from '@/types/block'

// ---------------------
// props / emits
// ---------------------

defineProps<{
	content: MarkdownContent
	title: string | null
}>()

const emit = defineEmits<{
	continue: []
}>()
</script>

<template>
	<div>
		<h2 v-if="title" class="text-2xl font-bold mb-4">{{ title }}</h2>
		<MarkdownPreview :source="content.text" />
		<div class="flex justify-end mt-8">
			<Button size="lg" @click="emit('continue')">Continue</Button>
		</div>
	</div>
</template>
