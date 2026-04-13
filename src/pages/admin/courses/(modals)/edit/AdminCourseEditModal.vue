<script setup lang="ts">
import { useCategoryGetAll } from "@/api/categories/get/all/useCategoryGetAll";
import { useCourseEdit } from "@/api/courses/edit/useCourseEdit";
import { useLanguageGetAll } from "@/api/languages/get/all/useLanguageGetAll";
import { useLanguageLevelGetByLanguageId } from "@/api/languages/level/get/AllByLanguageId/useLanguageLevelGetByLanguageId";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import type { Course } from "@/types/course";
import { PencilIcon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  data: Course;
}>();

const emit = defineEmits(["success"]);

const isOpen = ref(false);
const newTitleField = ref(props.data.title);
const newCidField = ref(props.data.cid);
const newDescriptionField = ref(props.data.description);
const newIconField = ref(props.data.icon);

const newLanguageIdField = ref(props.data.languageId);
const newLanguageLevelIdField = ref(props.data.languageLvlId);
const newCategoryIdField = ref(props.data.categoryId);

const languages = useLanguageGetAll();
const languageLevels = useLanguageLevelGetByLanguageId(newLanguageIdField);
const categories = useCategoryGetAll();

const editCategory = useCourseEdit();

const handleSave = async () => {
  if (
    !newTitleField.value ||
    !newCidField.value ||
    !newDescriptionField.value ||
    !newIconField.value ||
    !newLanguageIdField.value ||
    !newLanguageLevelIdField.value ||
    newTitleField.value.trim() === "" ||
    newCidField.value.trim() === "" ||
    newDescriptionField.value.trim() === "" ||
    newIconField.value.trim() === ""
  )
    return;

  try {
    await editCategory.mutateAsync({
      id: Number(props.data.id),
      title: newTitleField.value,
      cid: newCidField.value,
      description: newDescriptionField.value,
      icon: newIconField.value,
      languageId: newLanguageIdField.value,
      languageLvlId: newLanguageLevelIdField.value,
      categoryId: newCategoryIdField.value,
    });
    toast.success("Course edited successfully");

    isOpen.value = false;
    emit("success");
  } catch (e) {
    toast.error("Error while editing course");
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
          Edit Course
        </DialogTitle>
        <DialogDescription>
          Here you can edit the course details.
        </DialogDescription>
      </DialogHeader>

      <form class="w-full p-4">
        <div class="grid grid-cols-2 gap-5">
          <div>
            <div>
              <Label for="title" class="mb-5 font-semibold">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                v-model="newTitleField"
                placeholder="Enter course title.."
              />
            </div>
            <div class="mt-2">
              <Label for="cid" class="mb-5 font-semibold">CID</Label>
              <Input
                type="text"
                id="cid"
                name="cid"
                v-model="newCidField"
                placeholder="Enter course CID.."
              />
            </div>
            <div class="mt-2">
              <Label for="description" class="mb-5 font-semibold"
                >Description</Label
              >
              <Input
                type="text"
                id="description"
                name="description"
                v-model="newDescriptionField"
                placeholder="Enter course description.."
              />
            </div>
            <div class="mt-2">
              <Label for="icon" class="mb-5 font-semibold">Icon</Label>
              <Input
                type="text"
                id="icon"
                name="icon"
                v-model="newIconField"
                placeholder="Enter course icon.."
              />
            </div>
          </div>
          <div>
            <div>
              <Label class="mb-5 font-semibold">Language</Label>
              <Select v-model="newLanguageIdField">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="language in languages.data.value?.data"
                    :key="language.id"
                    :value="language.id"
                  >
                    {{ language.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="mt-2">
              <Label class="mb-5 font-semibold">Language Level</Label>
              <Select
                v-model="newLanguageLevelIdField"
                :disabled="!newLanguageIdField"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="languageLevel in languageLevels.data.value?.data"
                    :key="languageLevel.id"
                    :value="languageLevel.id"
                  >
                    {{ languageLevel.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="mt-2">
              <Label class="mb-5 font-semibold">Category</Label>
              <Select v-model="newCategoryIdField">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="category in categories.data.value?.data"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>

      <DialogFooter>
        <Button :disabled="editCategory.isLoading.value" @click="handleSave">
          {{ editCategory.isLoading.value ? "Saving..." : "Save Changes" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
