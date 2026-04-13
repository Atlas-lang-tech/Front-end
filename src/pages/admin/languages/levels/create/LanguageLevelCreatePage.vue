<script setup lang="ts">
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ref } from "vue";
import { toast } from "vue-sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useLanguageGetAll } from "@/api/languages/get/all/useLanguageGetAll";
import { useLanguageLevelCreate } from "@/api/languages/level/create/useLanguageLevelCreate";

const nameField = ref("");
const languageIdField = ref();
const addLanguageLevel = useLanguageLevelCreate();
const languages = useLanguageGetAll();

const handleSubmit = async () => {
  if (
    !nameField.value ||
    !languageIdField.value ||
    nameField.value.trim() === ""
  )
    return;
  try {
    await addLanguageLevel.mutateAsync({
      name: nameField.value,
      languageId: languageIdField.value,
    });
    nameField.value = "";
    languageIdField.value = "";
    toast.success("Language level added successfully");
  } catch (e) {
    toast.error("Error while adding language level");
  }
};
</script>

<template>
  <main class="w-full h-screen flex justify-center items-center">
    <Card class="p-5">
      <div class="text-2xl font-bold">Add new language level</div>
      <form class="w-full">
        <div>
          <Label for="name" class="mb-5 font-semibold">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            v-model="nameField"
            placeholder="Enter language name.."
          />
        </div>
        <div class="mt-2">
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
        <Button
          type="submit"
          class="w-full mt-5"
          size="sm"
          :disabled="addLanguageLevel.asyncStatus.value === 'loading'"
          @click.prevent="handleSubmit"
        >
          Save
        </Button>
      </form>
    </Card>
  </main>
</template>
