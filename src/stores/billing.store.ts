import { getAllPlans } from '@/api/billing/plans/get/all'
import { getMyPurchases } from '@/api/billing/purchases/get/me'
import { getMySubscription } from '@/api/billing/subscription/get/me'
import type { Course } from '@/types/course'
import type { Plan, UserSubscription } from '@/types/billing'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './user.store'

export const useBillingStore = defineStore(
	'billing',
	() => {
		const subscription = ref<UserSubscription | null>(null)
		const ownedCourseIds = ref<number[]>([])
		const plans = ref<Plan[]>([])

		const freePlan = computed(
			() => plans.value.find(p => p.priceCents <= 0) ?? null,
		)

		const currentPlan = computed(
			() =>
				plans.value.find(p => p.code === subscription.value?.planCode) ??
				freePlan.value,
		)

		const canAccessCourse = (course: Course) => {
			const userStore = useUserStore()
			return (
				course.isFree ||
				ownedCourseIds.value.includes(Number(course.id)) ||
				userStore.isAdmin
			)
		}

		const loadSubscription = async () => {
			try {
				const res = await getMySubscription()
				subscription.value = res.data
			} catch {
				subscription.value = null
			}
		}

		const loadPurchases = async () => {
			try {
				const res = await getMyPurchases()
				ownedCourseIds.value = (res.data ?? []).map(p => p.courseId)
			} catch {
				ownedCourseIds.value = []
			}
		}

		const loadPlans = async () => {
			try {
				const res = await getAllPlans()
				plans.value = res.data ?? []
			} catch {
				plans.value = []
			}
		}

		const refreshAfterPurchase = async (courseId: number) => {
			if (!ownedCourseIds.value.includes(courseId)) {
				ownedCourseIds.value = [...ownedCourseIds.value, courseId]
			}
			await loadPurchases()
		}

		const clear = () => {
			subscription.value = null
			ownedCourseIds.value = []
			plans.value = []
		}

		return {
			subscription,
			ownedCourseIds,
			plans,
			currentPlan,
			canAccessCourse,
			loadSubscription,
			loadPurchases,
			loadPlans,
			refreshAfterPurchase,
			clear,
		}
	},
	{
		persist: true,
	},
)
