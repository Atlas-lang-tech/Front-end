import { $API } from '@/api'
import type { CourseProgress } from '@/types/progress'
import type { CustomResponse } from '@/types/response'

export interface GetCourseProgressParams {
	courseId: number
}

export const getCourseProgress = async (
	params: GetCourseProgressParams,
): Promise<CustomResponse<CourseProgress>> => {
	const response = await $API.get<CustomResponse<CourseProgress>>(
		`/course/private/progress/course/${params.courseId}`,
	)
	return response.data
}
