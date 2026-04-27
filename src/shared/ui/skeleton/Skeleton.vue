<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
interface SkeletonProps {
  class?: HTMLAttributes["class"];
}
const props = defineProps<SkeletonProps>();
</script>
<template>
  <div
    data-slot="skeleton"
    :class="
      cn(
        'animate-pulse rounded-lg bg-card-secondary border border-border-subtle',
        props.class,
      )
    "
  />
</template>
