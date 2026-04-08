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
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input text-foreground border-2 border-border/30 rounded-xl px-3 py-2 w-full min-w-0 text-base shadow-xs transition-all outline-none font-sans',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        props.class,
      )
    "
  />
</template>
