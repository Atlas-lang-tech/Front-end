<script setup lang="ts">
import Sidebar from "@/components/admin/SideBar/Sidebar.vue";
</script>

<template>
  <main class="flex gap-2">
    <sidebar />
    <router-view />
  </main>
</template>
