<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { ref } from 'vue'

// ---------------------
// props
// ---------------------

defineProps<{
	source: string
}>()

// ---------------------
// theme
// ---------------------

const isDark = ref(document.documentElement.dataset.theme === 'dark')

useMutationObserver(
	document.documentElement,
	() => {
		isDark.value = document.documentElement.dataset.theme === 'dark'
	},
	{ attributes: true, attributeFilter: ['data-theme'] },
)
</script>

<template>
	<MdPreview
		:model-value="source"
		:theme="isDark ? 'dark' : 'light'"
		language="en-US"
		class="!bg-transparent"
	/>
</template>
