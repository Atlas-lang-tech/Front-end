import { $PAGES } from '@/app/configs/pages.config'

export interface NavItem {
	title: string
	icon: string
	path: string
}

export const navData: NavItem[] = [
	{
		title: 'Каталог',
		icon: 'book-open',
		path: $PAGES.main.catalog,
	},
	{
		title: 'Моє навчання',
		icon: 'graduation-cap',
		path: $PAGES.main.myLearning,
	},
]
