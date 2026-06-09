<script lang="ts">
import { config, en_US } from 'md-editor-v3'

config({
	editorConfig: {
		languageUserDefined: { 'en-US': en_US },
	},
})
</script>

<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ref } from 'vue'

const model = defineModel<string>({ default: '' })

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
	<MdEditor
		:model-value="model ?? ''"
		@update:model-value="v => (model = v)"
		:theme="isDark ? 'dark' : 'light'"
		language="en-US"
		:preview="true"
		style="height: 440px"
	/>
</template>
