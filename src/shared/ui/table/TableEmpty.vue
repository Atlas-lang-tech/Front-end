<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { cn } from "@/utils";
import TableCell from "./TableCell.vue";
import TableRow from "./TableRow.vue";
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    colspan?: number;
  }>(),
  {
    colspan: 1,
  },
);
const delegatedProps = reactiveOmit(props, "class");
</script>
<template>
  <TableRow class="hover:bg-transparent border-0">
    <TableCell
      :class="cn('p-4 whitespace-nowrap align-middle text-sm', props.class)"
      v-bind="delegatedProps"
    >
      <div class="flex flex-col items-center justify-center py-12 gap-2">
        <div
          class="w-12 h-12 rounded-xl bg-card-secondary border border-border flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <span class="text-muted font-medium text-sm">
          <slot />
        </span>
      </div>
    </TableCell>
  </TableRow>
</template>
