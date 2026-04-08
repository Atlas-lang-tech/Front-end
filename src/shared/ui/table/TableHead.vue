<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <th
    data-slot="table-head"
    :class="
      cn(
        'h-11 px-4 text-left align-middle whitespace-nowrap',
        'text-xs font-extrabold uppercase tracking-widest text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
