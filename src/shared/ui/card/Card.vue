<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/utils'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-2xl border-2 border-border/20 py-6 shadow-[0_4px_0_var(--border)]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
