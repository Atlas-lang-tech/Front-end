<script setup lang="ts">
import { Toaster } from "@/shared/ui/sonner";
</script>

<template>
  <RouterView />
  <Teleport to="body">
    <Toaster />
  </Teleport>
</template>
