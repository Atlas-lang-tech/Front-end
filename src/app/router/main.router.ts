import CatalogPage from '@/pages/main/catalog/CatalogPage.vue'
import CourseDetailPage from '@/pages/main/catalog/course/CourseDetailPage.vue'
import LessonPlayerPage from '@/pages/main/catalog/course/player/LessonPlayerPage.vue'
import HomePage from '@/pages/main/home/HomePage.vue'
import MyLearningPage from '@/pages/main/my-learning/MyLearningPage.vue'

export const mainRoutes = [
	{ path: '', component: HomePage },
	{ path: 'catalog', component: CatalogPage },
	{ path: 'catalog/:courseId', component: CourseDetailPage },
	{ path: 'catalog/:courseId/lesson/:lessonId', component: LessonPlayerPage },
	{ path: 'my-learning', component: MyLearningPage },
]
