<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Moon, Sun } from "lucide-vue-next";
import { Button } from "@/shared/ui/button";

const isDark = ref(false);

onMounted(() => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    @click="toggleTheme"
    aria-label="Змінити тему"
    class="cursor-pointer"
  >
    <!-- Sun icon for light mode, Moon icon for dark mode -->
    <Sun v-if="!isDark" class="size-6 text-primary" />
    <Moon v-else class="size-6 text-foreground" />
  </Button>
</template>
