<script setup lang="ts">
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useLanguageGetAll } from "@/api/languages/get/all/useLanguageGetAll";
import { useCourseCreate } from "@/api/courses/create/useCourseCreate";
import { useLanguageLevelGetByLanguageId } from "@/api/languages/level/get/AllByLanguageId/useLanguageLevelGetByLanguageId";
import { useCategoryGetAll } from "@/api/categories/get/all/useCategoryGetAll";

const titleField = ref("");
const cidField = ref("");
const descriptionField = ref("");
const iconField = ref("");

const languageIdField = ref();
const languageLevelIdField = ref();
const categoryIdField = ref();

const addCourse = useCourseCreate();
const languages = useLanguageGetAll();
const languageLevels = useLanguageLevelGetByLanguageId(languageIdField);
const categories = useCategoryGetAll();

watch(languageIdField, () => {
  languageLevels.refetch();
});

const handleSubmit = async () => {
  if (
    !titleField.value ||
    !languageIdField.value ||
    !cidField.value ||
    !descriptionField.value ||
    !iconField.value ||
    !languageLevelIdField.value ||
    titleField.value.trim() === "" ||
    cidField.value.trim() === "" ||
    descriptionField.value.trim() === "" ||
    iconField.value.trim() === ""
  )
    return;
  try {
    await addCourse.mutateAsync({
      title: titleField.value,
      languageId: languageIdField.value,
      categoryId: categoryIdField.value || undefined,
      cid: cidField.value,
      description: descriptionField.value,
      icon: iconField.value,
      languageLvlId: languageLevelIdField.value,
    });
    titleField.value = "";
    cidField.value = "";
    descriptionField.value = "";
    iconField.value = "";
    languageIdField.value = "";
    languageLevelIdField.value = "";
    categoryIdField.value = "";
    toast.success("Course added successfully");
  } catch (e) {
    toast.error("Error while adding course");
  }
};
</script>

<template>
  <main class="w-full h-screen flex justify-center items-center">
    <Card class="p-5">
      <div class="text-2xl font-bold">Add new Course</div>
      <form class="w-full">
        <div class="grid grid-cols-2 gap-5">
          <div>
            <div>
              <Label for="title" class="mb-5 font-semibold">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                v-model="titleField"
                placeholder="Enter course title.."
              />
            </div>
            <div class="mt-2">
              <Label for="cid" class="mb-5 font-semibold">CID</Label>
              <Input
                type="text"
                id="cid"
                name="cid"
                v-model="cidField"
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
                v-model="descriptionField"
                placeholder="Enter course description.."
              />
            </div>
            <div class="mt-2">
              <Label for="icon" class="mb-5 font-semibold">Icon</Label>
              <Input
                type="text"
                id="icon"
                name="icon"
                v-model="iconField"
                placeholder="Enter course icon.."
              />
            </div>
          </div>
          <div>
            <div>
              <Label class="mb-5 font-semibold">Language</Label>
              <Select v-model="languageIdField">
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
                v-model="languageLevelIdField"
                :disabled="!languageIdField"
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
              <Select v-model="categoryIdField">
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

        <Button
          type="submit"
          class="w-full mt-5"
          size="sm"
          :disabled="addCourse.asyncStatus.value === 'loading'"
          @click.prevent="handleSubmit"
        >
          Save
        </Button>
      </form>
    </Card>
  </main>
</template>
