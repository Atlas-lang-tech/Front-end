<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLanguageGetAll } from "@/api/languages/get/all/useLanguageGetAll";
import AdminLanguageEditModal from "./(modals)/edit/AdminLanguageEditModal.vue";
import AdminLanguageDeleteModal from "./(modals)/delete/AdminLanguageDeleteModal.vue";

const { state, asyncStatus, refetch } = useLanguageGetAll();

const PER_PAGE = 8;
const page = ref(1);

const languages = computed(() => state.value.data?.data ?? []);
const totalPages = computed(() => Math.ceil(languages.value.length / PER_PAGE));

const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE;
  return languages.value.slice(start, start + PER_PAGE);
});

const rangeLabel = computed(() => {
  const start = (page.value - 1) * PER_PAGE + 1;
  const end = Math.min(page.value * PER_PAGE, languages.value.length);
  return `${start}–${end} of ${languages.value.length}`;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen">
    <!-- Skeleton -->
    <div v-if="asyncStatus === 'loading'" class="w-[50rem]">
      <div class="p-4 space-y-3">
        <Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="state.status === 'error'"
      class="bg-card border border-destructive p-12 text-center rounded-xl"
    >
      <p class="text-destructive font-semibold text-lg">Error loading data</p>
      <p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
    </div>

    <!-- Table -->
    <div v-else-if="state.status === 'success'" class="w-[50rem]">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-24"> ID </TableHead>
              <TableHead> Name </TableHead>
              <TableHead> Code </TableHead>
              <TableHead> Icon </TableHead>
              <TableHead class="text-right w-52"> Actions </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="language in paginated" :key="language.id">
              <TableCell>
                <Badge variant="outline"> #{{ language.id }} </Badge>
              </TableCell>
              <TableCell>
                {{ language.name }}
              </TableCell>
              <TableCell>
                {{ language.code }}
              </TableCell>
              <TableCell>
                {{ language.icon }}
              </TableCell>
              <TableCell>
                <div class="flex items-center justify-end gap-2">
                  <AdminLanguageEditModal
                    :id="language.id"
                    :name="language.name"
                    :code="language.code"
                    :icon="language.icon"
                    @success="refetch"
                  />
                  <AdminLanguageDeleteModal
                    :id="language.id"
                    :name="language.name"
                    @success="refetch"
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div
          class="flex items-center justify-between px-5 py-3 border-t border-border"
        >
          <span class="text-sm text-muted">
            {{ rangeLabel }}
          </span>
          <div class="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              :disabled="page === 1"
              @click="page--"
            >
              ←
            </Button>
            <Button
              v-for="p in totalPages"
              :key="p"
              size="sm"
              @click="page = p"
              :variant="p === page ? 'default' : 'outline'"
            >
              {{ p }}
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="page === totalPages"
              @click="page++"
            >
              →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
