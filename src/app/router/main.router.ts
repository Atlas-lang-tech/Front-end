import CatalogPage from '@/pages/main/catalog/CatalogPage.vue'
import HomePage from '@/pages/main/home/HomePage.vue'
import MyLearningPage from '@/pages/main/my-learning/MyLearningPage.vue'

export const mainRoutes = [
	{ path: '', component: HomePage },
	{ path: 'catalog', component: CatalogPage },
	{ path: 'my-learning', component: MyLearningPage },
]
