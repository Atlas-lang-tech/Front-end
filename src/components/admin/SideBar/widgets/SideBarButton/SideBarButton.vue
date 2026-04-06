<script setup lang="ts">
import Icon from "@/shared/icon.vue";
import { Button } from "@/shared/ui/button";

const props = defineProps<{
  title: string;
  icon: string;
  path: string;
}>();
</script>

<template>
  <RouterLink :to="props.path" custom v-slot="{ isActive, navigate }">
    <Button
      :variant="isActive ? 'default' : 'ghost'"
      class="w-full items-center justify-center px-10 py-3 rounded-2xl text-muted-foreground hover:text-white cursor-pointer"
      :class="{ 'bg-muted text-white': isActive }"
      @click="navigate"
    >
      <Icon :name="props.icon" size="32" />
      {{ props.title }}
    </Button>
  </RouterLink>
</template>
