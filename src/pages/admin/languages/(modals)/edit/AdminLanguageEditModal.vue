<script setup lang="ts">
import { useLanguageEdit } from "@/api/languages/edit/useLanguageEdit";
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
  code: string;
  icon: string;
}>();

const emit = defineEmits(["success"]);

const isOpen = ref(false);
const newName = ref(props.name);
const newCode = ref(props.code);
const newIcon = ref(props.icon);

const editLanguage = useLanguageEdit();

const handleSave = async () => {
  if (!newName.value.trim() || !newCode.value.trim() || !newIcon.value.trim())
    return;

  try {
    await editLanguage.mutateAsync({
      id: props.id,
      name: newName.value,
      code: newCode.value,
      icon: newIcon.value,
    });
    toast.success("Language edited successfully");
    isOpen.value = false;
    emit("success");
  } catch (e) {
    toast.error("Error while editing language");
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        size="sm"
        class="gap-1.5 p-3 text-xs font-extrabold rounded-xl border-2 border-secondary/40 text-secondary bg-secondary/5 hover:bg-secondary/10 transition-all duration-150 cursor-pointer"
      >
        <PencilIcon class="size-3" />
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-h font-bold tracking-tight text-xl">
          Edit language
        </DialogTitle>
        <DialogDescription>
          Here you can edit the language details.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <div>
          <Label for="name" class="mb-5 font-semibold">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            v-model="newName"
            :default-value="props.name"
            placeholder="Enter language name.."
          />
        </div>
        <div class="mt-2">
          <Label for="code" class="mb-5 font-semibold">Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            v-model="newCode"
            :default-value="props.code"
            placeholder="Enter language code.."
          />
        </div>
        <div class="mt-2">
          <Label for="icon" class="mb-5 font-semibold">Icon</Label>
          <Input
            type="text"
            id="icon"
            name="icon"
            v-model="newIcon"
            :default-value="props.icon"
            placeholder="Enter language icon.."
          />
        </div>
      </div>

      <DialogFooter>
        <Button :disabled="editLanguage.isLoading.value" @click="handleSave">
          {{ editLanguage.isLoading.value ? "Saving..." : "Save Changes" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
