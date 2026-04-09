<script setup lang="ts">
import { useCategoryEdit } from "@/api/categories/edit/useCategoryEdit";
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
import { Input } from "@/shared/ui/input";
import { PencilIcon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  id: number;
  name: string;
}>();

const emit = defineEmits(["success"]);

const isOpen = ref(false);
const newName = ref(props.name);
const editCategory = useCategoryEdit();

const handleSave = async () => {
  if (!newName.value.trim()) return;

  try {
    await editCategory.mutateAsync({ id: props.id, name: newName.value });
    toast.success("Category edited successfully");

    isOpen.value = false;
    emit("success");
  } catch (e) {
    toast.error("Error while editing category");
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        size="sm"
        variant="outline"
        class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-secondary/40 text-secondary bg-secondary/5 shadow-[0_3px_0_color-mix(in_srgb,var(--secondary)_40%,transparent)] active:translate-y-[3px] active:shadow-none hover:bg-secondary/10 transition-all duration-150 cursor-pointer"
      >
        <PencilIcon class="size-3" />
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-h font-bold tracking-tight text-xl">
          Edit Category
        </DialogTitle>
        <DialogDescription>
          Here you can edit the category details.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <Input
          placeholder="Category Name"
          v-model="newName"
          @keyup.enter="handleSave"
        />
      </div>

      <DialogFooter>
        <Button :disabled="editCategory.isLoading.value" @click="handleSave">
          {{ editCategory.isLoading.value ? "Saving..." : "Save Changes" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
