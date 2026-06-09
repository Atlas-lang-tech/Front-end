<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    v-bind="$attrs"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
  />
  <slot v-else>
    <span
      class="lucide-icon--fallback"
      :style="{ width: `${size}px`, height: `${size}px` }"
    />
  </slot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as icons from "lucide-vue-next";
import type { Component } from "vue";

interface Props {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
  color: "currentColor",
  strokeWidth: 2,
});

const toPascalCase = (str: string): string =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const iconComponent = computed<Component | null>(() => {
  const pascalName = toPascalCase(props.name);
  return (icons as unknown as Record<string, Component>)[pascalName] ?? null;
});
</script>

<style scoped>
.lucide-icon--fallback {
  display: inline-block;
  background: currentColor;
  opacity: 0.15;
  border-radius: 4px;
}
</style>
