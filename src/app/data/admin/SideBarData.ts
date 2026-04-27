import { $PAGES } from '@/app/configs/pages.config'

export interface SideBarCategory {
	title: string
	buttons: SideBarButton[]
}
export interface SideBarButton {
	title: string
	icon: string
	path: string
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
