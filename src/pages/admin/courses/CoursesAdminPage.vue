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
import { useCourseGetAll } from "@/api/courses/get/all/useCourseGetAll";
import AdminCourseEditModal from "./(modals)/edit/AdminCourseEditModal.vue";
import AdminCourseDeleteModal from "./(modals)/delete/AdminCourseDeleteModal.vue";

const { state, asyncStatus, refetch } = useCourseGetAll();

const PER_PAGE = 8;
const page = ref(1);

const courses = computed(() => state.value.data?.data ?? []);
const totalPages = computed(() => Math.ceil(courses.value.length / PER_PAGE));

const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE;
  return courses.value.slice(start, start + PER_PAGE);
});

const rangeLabel = computed(() => {
  const start = (page.value - 1) * PER_PAGE + 1;
  const end = Math.min(page.value * PER_PAGE, courses.value.length);
  return `${start}–${end} of ${courses.value.length}`;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen">
    <!-- Skeleton -->
    <div
      v-if="asyncStatus === 'loading'"
      class="w-[65rem]"
    >
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
      <p class="text-muted text-sm mt-1">
        Please try refreshing the page.
      </p>
    </div>

    <!-- Table -->
    <div
      v-else-if="state.status === 'success'"
      class="w-[65rem]"
    >
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-36">
                ID
              </TableHead>
              <TableHead>
                Title
              </TableHead>
              <TableHead>
                CID
              </TableHead>
              <TableHead>
                Description
              </TableHead>
              <TableHead>
                Icon
              </TableHead>
              <TableHead>
                Language ID
              </TableHead>
              <TableHead>
                Level ID
              </TableHead>
              <TableHead>
                Category ID
              </TableHead>
              <TableHead class="text-right w-52">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="category in paginated"
              :key="category.id"
            >
              <TableCell>
                <Badge variant="outline">
                  #{{ category.id }}
                </Badge>
              </TableCell>
              <TableCell>
                {{ category.title }}
              </TableCell>
              <TableCell>
                {{ category.cid }}
              </TableCell>
              <TableCell>
                {{ category.description }}
              </TableCell>
              <TableCell>
                {{ category.icon }}
              </TableCell>
              <TableCell>
                {{ category.languageId }}
              </TableCell>
              <TableCell>
                {{ category.languageLvlId }}
              </TableCell>
              <TableCell>
                {{ category.categoryId || "N/A" }}
              </TableCell>
              <TableCell>
                <div class="flex items-center justify-end gap-2">
                  <AdminCourseEditModal :data="category" @success="refetch" />
                  <AdminCourseDeleteModal
                    :id="Number(category.id)"
                    :name="category.title"
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
