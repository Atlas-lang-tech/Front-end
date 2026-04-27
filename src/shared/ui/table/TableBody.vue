<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <tbody
    data-slot="table-body"
    :class="cn('[&_tr:first-child]:border-t', props.class)"
  >
    <slot />
  </tbody>
</template>
