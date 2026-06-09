<script setup lang="ts">
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Home } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter, type RouteLocationMatched } from 'vue-router'

interface BreadcrumbItemConfig {
	label?: string
	to?: string
	icon?: unknown
	hidden?: boolean
}

const props = withDefaults(
	defineProps<{
		maxItems?: number
		showHomeIcon?: boolean
		items?: BreadcrumbItemConfig[]
		separator?: string
	}>(),
	{
		maxItems: 3,
		showHomeIcon: true,
		items: () => [],
		separator: undefined,
	},
)

const route = useRoute()
const router = useRouter()

function getLabel(matched: RouteLocationMatched): string {
	if (matched.meta?.breadcrumb && typeof matched.meta.breadcrumb === 'string') {
		return matched.meta.breadcrumb
	}
	if (matched.meta?.title && typeof matched.meta.title === 'string') {
		return matched.meta.title
	}
	if (matched.name && typeof matched.name === 'string') {
		return matched.name
	}
	const segments = matched.path.split('/').filter(Boolean)
	const segment = segments[segments.length - 1] ?? ''
	return segment.charAt(0).toUpperCase() + segment.slice(1)
}

interface CrumbItem {
	label: string
	to: string | null
	isActive: boolean
	icon?: unknown
}

const crumbs = computed<CrumbItem[]>(() => {
	const matched = route.matched.filter(
		r => r.meta?.breadcrumb !== false && !r.meta?.hideBreadcrumb,
	)

	return matched
		.map((m, i) => {
			const isLast = i === matched.length - 1
			const override = props.items[i] ?? {}

			if (override.hidden) return null as unknown as CrumbItem

			const label = override.label ?? getLabel(m)
			const to = isLast ? null : (override.to ?? m.path)

			return { label, to, isActive: isLast, icon: override.icon }
		})
		.filter(Boolean) as CrumbItem[]
})

const visibleCrumbs = computed(() => {
	const all = crumbs.value
	const max = props.maxItems

	if (all.length <= max + 1) return { head: all, collapsed: [], tail: [] }

	return {
		head: [all[0]],
		collapsed: all.slice(1, all.length - 1),
		tail: [all[all.length - 1]],
	}
})

const isCollapsed = computed(() => visibleCrumbs.value.collapsed.length > 0)

function navigate(to: string | null) {
	if (to) router.push(to)
}
</script>

<template>
	<Breadcrumb class="py-1 select-none" aria-label="Навигационная цепочка">
		<BreadcrumbList>
			<!-- Head крошки -->
			<template
				v-for="(crumb, idx) in visibleCrumbs.head"
				:key="crumb.to ?? crumb.label"
			>
				<BreadcrumbItem>
					<!-- Активная (последняя) -->
					<BreadcrumbPage
						v-if="crumb.isActive"
						class="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
					>
						<component
							:is="crumb.icon"
							v-if="crumb.icon"
							class="h-3.5 w-3.5 shrink-0"
							aria-hidden="true"
						/>
						<Home
							v-else-if="showHomeIcon && idx === 0"
							class="h-3.5 w-3.5 shrink-0"
							aria-hidden="true"
						/>
						<span>{{ crumb.label }}</span>
					</BreadcrumbPage>

					<!-- Ссылка -->
					<BreadcrumbLink
						v-else
						as="button"
						class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-transparent border-none p-0 cursor-pointer transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
						@click="navigate(crumb.to)"
					>
						<component
							:is="crumb.icon"
							v-if="crumb.icon"
							class="h-3.5 w-3.5 shrink-0"
							aria-hidden="true"
						/>
						<Home
							v-else-if="showHomeIcon && idx === 0"
							class="h-3.5 w-3.5 shrink-0"
							aria-hidden="true"
						/>
						<span>{{ crumb.label }}</span>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator v-if="!crumb.isActive">
					<span v-if="separator">{{ separator }}</span>
				</BreadcrumbSeparator>
			</template>

			<!-- Коллапс -->
			<template v-if="isCollapsed">
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger
							class="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							aria-label="Показать скрытые разделы"
						>
							<BreadcrumbEllipsis />
						</DropdownMenuTrigger>

						<DropdownMenuContent align="start" class="min-w-40">
							<DropdownMenuItem
								v-for="hidden in visibleCrumbs.collapsed"
								:key="hidden.to ?? hidden.label"
								class="flex items-center gap-2 text-sm cursor-pointer"
								@click="navigate(hidden.to)"
							>
								<component
									:is="hidden.icon"
									v-if="hidden.icon"
									class="h-3.5 w-3.5 shrink-0"
								/>
								{{ hidden.label }}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>

				<BreadcrumbSeparator>
					<span v-if="separator">{{ separator }}</span>
				</BreadcrumbSeparator>
			</template>

			<!-- Tail (последняя крошка) -->
			<template v-for="crumb in visibleCrumbs.tail" :key="crumb.label">
				<BreadcrumbItem>
					<BreadcrumbPage
						class="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
					>
						<component
							:is="crumb.icon"
							v-if="crumb.icon"
							class="h-3.5 w-3.5 shrink-0"
							aria-hidden="true"
						/>
						<span>{{ crumb.label }}</span>
					</BreadcrumbPage>
				</BreadcrumbItem>
			</template>
		</BreadcrumbList>
	</Breadcrumb>
</template>
