<script setup lang="ts">
import { useDictionaryGetByUser } from '@/api/vocabulary/dictionaries/get/byUser/useDictionaryGetByUser'
import { $PAGES } from '@/app/configs/pages.config'
import PlanLimitNotice from '@/components/billing/PlanLimitNotice.vue'
import { usePlanLimits } from '@/composables/usePlanLimits'
import { useUserStore } from '@/stores/user.store'
import Icon from '@/shared/icon.vue'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import UserDictionaryCreateModal from './(modals)/create/UserDictionaryCreateModal.vue'
import UserDictionaryDeleteModal from './(modals)/delete/UserDictionaryDeleteModal.vue'
import UserDictionaryEditModal from './(modals)/edit/UserDictionaryEditModal.vue'

// ---------------------
// store
// ---------------------
const { user } = storeToRefs(useUserStore())
const userId = computed(() => user.value?.id ?? '')

// ---------------------
// api
// ---------------------
const { state, asyncStatus, refetch } = useDictionaryGetByUser(userId)

// ---------------------
// data
// ---------------------
const dictionaries = computed(() => state.value.data?.data ?? [])

// ---------------------
// plan limit
// ---------------------
const { maxDictionaries } = usePlanLimits()
const atLimit = computed(() => dictionaries.value.length >= maxDictionaries.value)
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<div class="flex items-center justify-between w-full mb-6">
			<div>
				<h1 class="text-3xl font-bold">Vocabulary</h1>
				<p class="text-muted-foreground text-sm mt-1">
					Manage your dictionaries and words.
				</p>
			</div>
			<UserDictionaryCreateModal
				:current-count="dictionaries.length"
				@success="refetch"
			/>
		</div>

		<PlanLimitNotice
			v-if="atLimit"
			class="mb-6"
			:description="`You've reached your plan limit of ${maxDictionaries} dictionaries. Upgrade to create more.`"
		/>

		<!-- loading -->
		<div
			v-if="asyncStatus === 'loading'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Skeleton v-for="i in 6" :key="i" class="h-40 w-full rounded-xl" />
		</div>

		<!-- error -->
		<div
			v-else-if="state.status === 'error'"
			class="bg-card border border-destructive p-12 text-center rounded-xl"
		>
			<p class="text-destructive font-semibold text-lg">
				Error loading dictionaries
			</p>
			<p class="text-muted text-sm mt-1">Please try refreshing the page.</p>
		</div>

		<!-- empty -->
		<div
			v-else-if="!dictionaries.length"
			class="bg-card border border-border p-12 text-center rounded-xl"
		>
			<p class="text-foreground font-semibold text-lg">No dictionaries yet</p>
			<p class="text-muted text-sm mt-1">
				Create your first dictionary to start adding words.
			</p>
		</div>

		<!-- success -->
		<div
			v-else-if="state.status === 'success'"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
		>
			<Card
				v-for="dictionary in dictionaries"
				:key="dictionary.id"
				class="p-5 flex flex-col gap-4 hover:border-primary/40 transition-all duration-150"
			>
				<RouterLink
					:to="$PAGES.user.vocabularyDetail(dictionary.id)"
					class="flex items-center gap-4"
				>
					<div
						class="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
					>
						<Icon :name="dictionary.icon" :size="24" />
					</div>
					<h2 class="text-lg font-semibold truncate">{{ dictionary.title }}</h2>
				</RouterLink>

				<div class="flex items-center justify-between mt-auto">
					<RouterLink
						:to="$PAGES.user.vocabularyDetail(dictionary.id)"
						class="text-sm text-primary hover:underline"
					>
						Open
					</RouterLink>
					<div class="flex items-center gap-2">
						<UserDictionaryEditModal
							:id="dictionary.id"
							:title="dictionary.title"
							:icon="dictionary.icon"
							@success="refetch"
						/>
						<UserDictionaryDeleteModal
							:id="dictionary.id"
							:title="dictionary.title"
							@success="refetch"
						/>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
