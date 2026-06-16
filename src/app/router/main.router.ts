import CatalogPage from '@/pages/main/catalog/CatalogPage.vue'
import CourseDetailPage from '@/pages/main/catalog/course/CourseDetailPage.vue'
import LessonPlayerPage from '@/pages/main/catalog/course/player/LessonPlayerPage.vue'
import HomePage from '@/pages/main/home/HomePage.vue'
import MyLearningPage from '@/pages/main/my-learning/MyLearningPage.vue'
import VocabularyStudyPage from '@/pages/main/vocabulary/VocabularyStudyPage.vue'
import StudyHubPage from '@/pages/main/vocabulary/hub/StudyHubPage.vue'
import StudyGamePage from '@/pages/main/vocabulary/game/StudyGamePage.vue'

export const mainRoutes = [
	{ path: '', component: HomePage },
	{ path: 'catalog', component: CatalogPage },
	{ path: 'catalog/:courseId', component: CourseDetailPage },
	{ path: 'catalog/:courseId/lesson/:lessonId', component: LessonPlayerPage },
	{ path: 'my-learning', component: MyLearningPage },
	{ path: 'vocabulary', component: VocabularyStudyPage },
	{ path: 'vocabulary/:dictionaryId', component: StudyHubPage },
	{ path: 'vocabulary/:dictionaryId/play/:mode', component: StudyGamePage },
]
