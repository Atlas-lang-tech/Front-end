<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-vue-next";
import { Toaster as Sonner } from "vue-sonner";
import { cn } from "@/utils";

const props = withDefaults(defineProps<ToasterProps>(), {
  position: "bottom-right",
});
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--card)',
      '--normal-text': 'var(--card-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--success-bg': 'var(--card)',
      '--error-bg': 'var(--card)',
      '--warning-bg': 'var(--card)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <div class="toast-icon-wrap toast-icon-wrap--success">
        <CircleCheckIcon class="size-4 text-white" />
      </div>
    </template>
    <template #info-icon>
      <div class="toast-icon-wrap toast-icon-wrap--info">
        <InfoIcon class="size-4 text-white" />
      </div>
    </template>
    <template #warning-icon>
      <div class="toast-icon-wrap toast-icon-wrap--warning">
        <TriangleAlertIcon class="size-4 text-white" />
      </div>
    </template>
    <template #error-icon>
      <div class="toast-icon-wrap toast-icon-wrap--error">
        <OctagonXIcon class="size-4 text-white" />
      </div>
    </template>
    <template #loading-icon>
      <div class="toast-icon-wrap toast-icon-wrap--loading">
        <Loader2Icon class="size-4 text-white animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-3 text-muted" />
    </template>
  </Sonner>
</template>

<style>
/* ── Toast контейнер ── */
[data-sonner-toaster] [data-sonner-toast] {
  font-family: var(--font-family) !important;
  background: var(--card) !important;
  color: var(--card-foreground) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  padding: 14px 16px !important;
  gap: 12px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease !important;
  cursor: pointer;
  z-index: 9999 !important;
  position: fixed !important;
  bottom: 1.5rem !important;
  right: 1.5rem !important;
}

[data-sonner-toaster] [data-sonner-toast]:active {
  transform: scale(0.98) !important;
}

/* ── Заголовок ── */
[data-sonner-toaster] [data-sonner-toast] [data-title] {
  font-family: var(--font-family) !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

/* ── Описание ── */
[data-sonner-toaster] [data-sonner-toast] [data-description] {
  font-family: var(--font-family) !important;
  font-size: 13px !important;
  color: var(--text-muted) !important;
}

/* ── Кнопка закрытия ── */
[data-sonner-toaster] [data-sonner-toast] [data-close-button] {
  background: var(--card-secondary) !important;
  border: 1px solid var(--border) !important;
  border-radius: 6px !important;
  transition:
    background 0.12s ease !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-close-button]:hover {
  background: var(--input) !important;
}

/* ── Иконки-обёртки ── */
.toast-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon-wrap--success {
  background: var(--status-success);
}

.toast-icon-wrap--info {
  background: var(--secondary);
}

.toast-icon-wrap--warning {
  background: var(--status-pending);
}

.toast-icon-wrap--error {
  background: var(--status-error);
}

.toast-icon-wrap--loading {
  background: var(--primary);
}
</style>
