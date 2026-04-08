<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <tfoot
    data-slot="table-footer"
    :class="
      cn(
        'border-t-2 border-border bg-muted font-bold',
        '[&>tr]:last:border-b-0',
        props.class,
      )
    "
  >
    <slot />
  </tfoot>
</template>
