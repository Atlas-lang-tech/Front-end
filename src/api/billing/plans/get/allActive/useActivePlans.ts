import { useQuery } from '@pinia/colada'
import { getAllActivePlans } from '.'

export const useActivePlans = () => {
	return useQuery({
		key: ['billing-active-plans'],
		query: () => getAllActivePlans(),
	})
}
