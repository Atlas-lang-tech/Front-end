<script setup lang="ts">
import { useCategoryCreate } from "@/api/categories/create/useCategryCreate";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ref } from "vue";
import { toast } from "vue-sonner";

const nameField = ref("");
const addCategory = useCategoryCreate();

const handleSubmit = async () => {
  if (!nameField.value) return;
  if (nameField.value.trim() === "") return;

  try {
    await addCategory.mutateAsync({ name: nameField.value });
    nameField.value = "";
    toast.success("Category added successfully");
  } catch (e) {
    toast.error("Error while adding category");
  }
};
</script>

<template>
  <main class="w-full h-screen flex justify-center items-center">
    <Card class="p-5">
      <div class="text-2xl font-bold">Add new category</div>
      <form class="w-full">
        <div>
          <Label for="name" class="mb-5 font-semibold">Name</Label>
          <Input type="text" id="name" name="name" v-model="nameField" />
        </div>

        <Button
          type="submit"
          class="w-full mt-5"
          size="sm"
          :disabled="addCategory.asyncStatus.value === 'loading' ? true : false"
          @click.prevent="handleSubmit"
        >
          Save
        </Button>
      </form>
    </Card>
  </main>
</template>
