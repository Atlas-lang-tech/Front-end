<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'flex h-11 w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted transition-colors duration-150 ease-in-out outline-none font-sans',
        'focus:border-primary focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
