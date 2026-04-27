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
        'bg-card text-card-foreground rounded-xl border border-border p-0 overflow-hidden',
        'shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
        'transition-shadow duration-200',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
