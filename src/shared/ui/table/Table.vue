<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <div
    data-slot="table-container"
    class="relative w-full overflow-auto rounded-2xl border-2 border-border shadow-[0_4px_0_var(--border)]"
  >
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm font-sans', props.class)"
    >
      <slot />
    </table>
  </div>
</template>
