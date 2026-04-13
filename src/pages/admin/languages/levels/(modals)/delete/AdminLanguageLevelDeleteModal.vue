<script setup lang="ts">
import { useLanguageLevelDelete } from "@/api/languages/level/delete/useLanguageLevelDelete";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Trash2Icon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  id: number;
  name: string;
}>();

const emit = defineEmits(["success"]);

const isOpen = ref(false);
const deleteLanguageLevel = useLanguageLevelDelete();

const handleDelete = async () => {
  try {
    await deleteLanguageLevel.mutateAsync({ id: props.id });
    toast.success("Language level deleted successfully");

    isOpen.value = false;
    emit("success");
  } catch (e) {
    toast.error("Error while deleting language level");
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        size="sm"
        variant="outline"
        class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-destructive/40 text-destructive bg-destructive/5 shadow-[0_3px_0_color-mix(in_srgb,var(--destructive)_40%,transparent)] active:translate-y-[3px] active:shadow-none hover:bg-destructive/10 transition-all duration-150 cursor-pointer"
      >
        <Trash2Icon class="size-3" />
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-h font-bold tracking-tight text-xl">
          Delete Language Level
        </DialogTitle>
        <DialogDescription>
          Here you can delete the language level.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <h1 class="text-lg font-semibold">
          Are you sure you want to delete the language level
          <span class="text-xl px-3 bg-background rounded-2xl">
            {{ props.name }}
          </span>
          ?
        </h1>
      </div>

      <DialogFooter>
        <Button variant="ghost" @click="isOpen = false" class="cursor-pointer"
          >Cancel</Button
        >
        <Button
          :disabled="deleteLanguageLevel.isLoading.value"
          variant="destructive"
          @click="handleDelete"
          class="cursor-pointer"
        >
          {{ deleteLanguageLevel.isLoading.value ? "Deleting..." : "Delete" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
