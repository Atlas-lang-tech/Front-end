<script setup lang="ts">
import type { DialogDescriptionProps } from "reka-ui";
import { DialogDescription } from "reka-ui";
import { cn } from "@/utils";
const props = defineProps<DialogDescriptionProps & { class?: string }>();
</script>

<template>
  <DialogDescription
    :class="cn('text-muted-foreground text-sm font-sans', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
