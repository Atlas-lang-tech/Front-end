<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import type { TaskActionMode } from '../../lesson-player.types'

// ---------------------
// props / emits
// ---------------------

defineProps<{
	canSubmit: boolean
	mode: TaskActionMode
}>()

const emit = defineEmits<{
	submit: []
	secondary: []
}>()
</script>

<template>
	<div class="flex items-center justify-between gap-3 mt-8">
		<Button variant="ghost" @click="emit('secondary')">
			{{ mode === 'skip' ? 'Skip' : 'Leave unanswered' }}
		</Button>
		<Button :disabled="!canSubmit" @click="emit('submit')">
			Submit answer
		</Button>
	</div>
</template>
