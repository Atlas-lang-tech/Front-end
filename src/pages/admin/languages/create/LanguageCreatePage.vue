<script setup lang="ts">
import { useLanguageCreate } from "@/api/languages/create/useLanguageCreate";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ref } from "vue";
import { toast } from "vue-sonner";

const nameField = ref("");
const codeField = ref("");
const iconField = ref("");

const addLanguage = useLanguageCreate();

const handleSubmit = async () => {
  if (
    !nameField.value ||
    !codeField.value ||
    nameField.value.trim() === "" ||
    codeField.value.trim() === ""
  )
    return;

  try {
    await addLanguage.mutateAsync({
      name: nameField.value,
      code: codeField.value,
      icon: iconField.value,
    });
    nameField.value = "";
    codeField.value = "";
    iconField.value = "";

    toast.success("Language added successfully");
  } catch (e) {
    toast.error("Error while adding language");
  }
};
</script>

<template>
  <main class="w-full h-screen flex justify-center items-center">
    <Card class="p-5">
      <div class="text-2xl font-bold">Add new language</div>
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
          <Label for="code" class="mb-5 font-semibold">Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            v-model="codeField"
            placeholder="Enter language code.."
          />
        </div>
        <div class="mt-2">
          <Label for="icon" class="mb-5 font-semibold">Icon</Label>
          <Input
            type="text"
            id="icon"
            name="icon"
            v-model="iconField"
            placeholder="Enter language icon.."
          />
        </div>

        <Button
          type="submit"
          class="w-full mt-5"
          size="sm"
          :disabled="addLanguage.asyncStatus.value === 'loading' ? true : false"
          @click.prevent="handleSubmit"
        >
          Save
        </Button>
      </form>
    </Card>
  </main>
</template>
