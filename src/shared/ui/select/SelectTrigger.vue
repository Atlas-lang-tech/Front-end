<script setup lang="ts">
import type { SelectTriggerProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ChevronDown } from "lucide-vue-next";
import { SelectIcon, SelectTrigger, useForwardProps } from "reka-ui";
import { cn } from "@/utils";

const props = withDefaults(
  defineProps<
    SelectTriggerProps & {
      class?: HTMLAttributes["class"];
      size?: "sm" | "default";
    }
  >(),
  { size: "default" },
);
const delegatedProps = reactiveOmit(props, "class", "size");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    :data-size="size"
    v-bind="forwardedProps"
    :class="
      cn(
        'bg-input text-foreground border border-border font-medium font-sans rounded-lg',
        'flex w-full items-center justify-between gap-2 whitespace-nowrap',
        'transition-all duration-150 ease-in-out outline-none',
        'hover:bg-card-secondary',
        'focus:border-primary focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[placeholder]:text-muted',
        'data-[size=default]:h-11 data-[size=default]:px-4 data-[size=default]:py-3',
        'data-[size=sm]:h-9 data-[size=sm]:px-3 data-[size=sm]:py-2 data-[size=sm]:text-sm',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 text-muted" />
    </SelectIcon>
  </SelectTrigger>
</template>
