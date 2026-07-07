import { useQuery } from '@pinia/colada'
import { getAllPlans } from '.'

export const usePlans = () => {
	return useQuery({
		key: ['billing-plans'],
		query: () => getAllPlans(),
	})
}
