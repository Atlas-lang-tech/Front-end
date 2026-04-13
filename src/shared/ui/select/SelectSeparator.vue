<script setup lang="ts">
import type { SelectSeparatorProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { SelectSeparator } from "reka-ui";
import { cn } from "@/utils";

const props = defineProps<
  SelectSeparatorProps & { class?: HTMLAttributes["class"] }
>();
const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <SelectSeparator
    data-slot="select-separator"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-border/30 pointer-events-none -mx-2 my-1.5 h-0.5 rounded-full',
        props.class,
      )
    "
  />
</template>
