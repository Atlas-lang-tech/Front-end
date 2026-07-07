import { $API } from '@/api'
import type { Plan } from '@/types/billing'
import type { CustomResponse } from '@/types/response'

export const getAllPlans = async (): Promise<CustomResponse<Plan[]>> => {
	const response = await $API.get<CustomResponse<Plan[]>>(
		'/billing/private/admin/plans',
	)
	return response.data
}
