<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogClose } from "reka-ui";
import { cn } from "@/utils";
import { Button } from "@/shared/ui/button";
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    showCloseButton?: boolean;
  }>(),
  {
    showCloseButton: false,
  },
);
</script>

<template>
  <div
    data-slot="dialog-footer"
    :class="
      cn('flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', props.class)
    "
  >
    <slot />
    <DialogClose v-if="showCloseButton" as-child>
      <Button
        variant="outline"
        class="rounded-xl border-2 border-border shadow-[0_4px_0_var(--border)] active:translate-y-1 active:shadow-none transition-all"
      >
        Close
      </Button>
    </DialogClose>
  </div>
</template>
