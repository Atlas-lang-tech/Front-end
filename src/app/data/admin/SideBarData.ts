import { $PAGES } from '@/app/configs/pages.config'
import type { User } from '@/types/user'

export interface SideBarCategory {
	title: string
	buttons: SideBarButton[]
}
export interface SideBarButton {
	title: string
	icon: string
	path: string
	roles?: User['role'][]
}

export const sideBarData: SideBarCategory[] = [
	{
		title: 'Main',
		buttons: [
			{
				title: 'Dashboard',
				icon: 'gauge',
				path: $PAGES.admin.dashboard,
			},
			{
				title: 'Users',
				icon: 'users',
				path: $PAGES.admin.users.list,
				roles: ['ADMIN'],
			},
		],
	},
	{
		title: 'CMS',
		buttons: [
			{
				title: 'Categories',
				icon: 'chart-column-stacked',
				path: $PAGES.admin.categories.list,
			},
			{
				title: 'Languages',
				icon: 'languages',
				path: $PAGES.admin.language.list,
			},
			{
				title: 'language Levels',
				icon: 'ampersand',
				path: $PAGES.admin.language.languageLevel.list,
			},
			{
				title: 'All Courses',
				icon: 'book',
				path: $PAGES.admin.course.list,
			},
		],
	},
]
