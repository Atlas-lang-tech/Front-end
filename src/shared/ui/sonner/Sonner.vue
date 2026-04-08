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
      <XIcon class="size-3 text-muted-foreground" />
    </template>
  </Sonner>
</template>

<style>
/* ── Toast контейнер ── */
[data-sonner-toaster] [data-sonner-toast] {
  font-family: var(--sans) !important;
  background: var(--card) !important;
  color: var(--card-foreground) !important;
  border: 2px solid var(--border) !important;
  border-radius: calc(var(--radius) + 8px) !important; /* ~20px */
  box-shadow: var(--shadow) !important; /* 0 4px 0 var(--border) */
  padding: 14px 16px !important;
  gap: 12px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease !important;
  cursor: pointer;
  z-index: 9999 !important;
  position: fixed !important;
  bottom: 1.5rem !important;
  right: 1.5rem !important;
}

[data-sonner-toaster] [data-sonner-toast]:active {
  transform: translateY(4px) !important;
  box-shadow: none !important;
}

/* ── Заголовок ── */
[data-sonner-toaster] [data-sonner-toast] [data-title] {
  font-family: var(--sans) !important;
  font-weight: 800 !important;
  font-size: 14px !important;
  color: var(--text-h) !important;
}

/* ── Описание ── */
[data-sonner-toaster] [data-sonner-toast] [data-description] {
  font-family: var(--sans) !important;
  font-size: 13px !important;
  color: var(--muted-foreground) !important;
}

/* ── Кнопка закрытия ── */
[data-sonner-toaster] [data-sonner-toast] [data-close-button] {
  background: var(--muted) !important;
  border: 2px solid var(--border) !important;
  border-radius: calc(var(--radius) - 2px) !important;
  box-shadow: 0 2px 0 var(--border) !important;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-close-button]:hover {
  background: var(--input) !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-close-button]:active {
  transform: translateY(2px) !important;
  box-shadow: none !important;
}

/* ── Иконки-обёртки ── */
.toast-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: calc(var(--radius) - 2px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.toast-icon-wrap--success {
  background: #22c55e;
  border-color: #15803d;
  box-shadow: 0 3px 0 #15803d;
}

.toast-icon-wrap--info {
  background: var(--secondary);
  border-color: #1d4ed8;
  box-shadow: 0 3px 0 #1d4ed8;
}

.toast-icon-wrap--warning {
  background: #eab308;
  border-color: #a16207;
  box-shadow: 0 3px 0 #a16207;
}

.toast-icon-wrap--error {
  background: var(--destructive);
  border-color: #b91c1c;
  box-shadow: 0 3px 0 #b91c1c;
}

.toast-icon-wrap--loading {
  background: var(--primary);
  border-color: var(--accent-border);
  box-shadow: 0 3px 0 var(--accent-border);
}
</style>
