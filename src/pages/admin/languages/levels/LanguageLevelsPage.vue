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
import { Skeleton } from "@/shared/ui/skeleton";
import { useLanguageLevelGetAll } from "@/api/languages/level/get/all/useLanguageLevelGetAll";
import AdminLanguageLevelEditModal from "./(modals)/edit/AdminLanguageLevelEditModal.vue";
import AdminLanguageLevelDeleteModal from "./(modals)/delete/AdminLanguageLevelDeleteModal.vue";

const { state, asyncStatus, refetch } = useLanguageLevelGetAll();

const PER_PAGE = 8;
const page = ref(1);

const languageLevels = computed(() => state.value.data?.data ?? []);
const totalPages = computed(() =>
  Math.ceil(languageLevels.value.length / PER_PAGE),
);

const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE;
  return languageLevels.value.slice(start, start + PER_PAGE);
});

const rangeLabel = computed(() => {
  const start = (page.value - 1) * PER_PAGE + 1;
  const end = Math.min(page.value * PER_PAGE, languageLevels.value.length);
  return `${start}–${end} of ${languageLevels.value.length}`;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen">
    <!-- Skeleton -->
    <div
      v-if="asyncStatus === 'loading'"
      class="bg-card border-2 border-border rounded-2xl shadow-[0_4px_0_var(--border)] overflow-hidden"
    >
      <div class="p-4 space-y-3">
        <Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-xl" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="state.status === 'error'"
      class="bg-card border-2 border-destructive/40 rounded-2xl shadow-[0_4px_0_var(--destructive)] p-12 text-center"
    >
      <p class="text-destructive font-extrabold text-lg">Error loading data</p>
      <p class="text-muted-foreground text-sm mt-1">
        Please try refreshing the page.
      </p>
    </div>

    <!-- Table -->
    <div
      v-else-if="state.status === 'success'"
      class="bg-card border-2 border-border rounded-2xl shadow-[0_4px_0_var(--border)] overflow-hidden w-[50rem]"
    >
      <Table>
        <TableHeader>
          <TableRow class="bg-muted hover:bg-muted border-b-2 border-border">
            <TableHead
              class="w-24 font-extrabold text-xs uppercase tracking-widest text-muted-foreground"
            >
              ID
            </TableHead>
            <TableHead
              class="font-extrabold text-xs uppercase tracking-widest text-muted-foreground"
            >
              Name
            </TableHead>
            <TableHead
              class="font-extrabold text-xs uppercase tracking-widest text-muted-foreground"
            >
              Language Id
            </TableHead>
            <TableHead
              class="text-right font-extrabold text-xs uppercase tracking-widest text-muted-foreground w-52"
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="language in paginated"
            :key="language.id"
            class="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
          >
            <TableCell>
              <Badge
                variant="outline"
                class="font-mono font-bold text-xs text-muted-foreground rounded-lg border-border"
              >
                #{{ language.id }}
              </Badge>
            </TableCell>
            <TableCell class="font-bold text-foreground">
              {{ language.name }}
            </TableCell>
            <TableCell class="font-bold text-foreground">
              {{ language.languageId }}
            </TableCell>

            <TableCell>
              <div class="flex items-center justify-end gap-2">
                <AdminLanguageLevelEditModal
                  :id="language.id"
                  :name="language.name"
                  @success="refetch"
                />
                <AdminLanguageLevelDeleteModal
                  :id="language.id"
                  :name="language.name"
                  @success="refetch"
                />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between px-5 py-3.5 border-t-2 border-border bg-muted"
      >
        <span class="text-sm font-bold text-muted-foreground">
          {{ rangeLabel }}
        </span>
        <div class="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            :disabled="page === 1"
            @click="page--"
            class="font-extrabold rounded-xl border-2 border-border shadow-[0_3px_0_var(--border)] active:translate-y-[3px] active:shadow-none disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-150"
          >
            ←
          </Button>
          <Button
            v-for="p in totalPages"
            :key="p"
            size="sm"
            @click="page = p"
            :variant="p === page ? 'default' : 'outline'"
            :class="
              p === page
                ? 'shadow-[0_3px_0_var(--accent-border)] active:translate-y-[3px] active:shadow-none font-extrabold rounded-xl border-2 border-transparent transition-all duration-150'
                : 'shadow-[0_3px_0_var(--border)] active:translate-y-[3px] active:shadow-none font-extrabold rounded-xl border-2 border-border transition-all duration-150'
            "
          >
            {{ p }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            :disabled="page === totalPages"
            @click="page++"
            class="font-extrabold rounded-xl border-2 border-border shadow-[0_3px_0_var(--border)] active:translate-y-[3px] active:shadow-none disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-150"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
