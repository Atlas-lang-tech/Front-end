import { $API } from '@/api'

export interface CompleteLessonParams {
	lessonId: number
}

export const completeLesson = async (params: CompleteLessonParams) => {
	return $API.post(
		`/course/private/progress/lesson/${params.lessonId}/complete`,
		{},
		{},
	)
}
