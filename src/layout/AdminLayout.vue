<script setup lang="ts">
import Sidebar from "@/components/admin/SideBar/Sidebar.vue";
</script>

<template>
  <main class="flex gap-2 h-svh overflow-hidden">
    <Sidebar />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </main>
</template>
