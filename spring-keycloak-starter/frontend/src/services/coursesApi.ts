import { Course } from "../types/coursesType"
import { UserInfo } from "../types/userInfoType"
import { UsersByRoleResponse } from "../types/usersByRoleResponseType"
import { apiClient } from "./apiClient"

export const apiCourses = {
    getCourses: async (): Promise<Course[]> => {
            const response = await apiClient.get("/courses")
            return response.data
    },

    createCourse: async (course: Omit<Course, "id">): Promise<Course> => {
        const response = await apiClient.post("/courses", course)
        return response.data
    },

    deleteCourse: async (id: number) : Promise<void> => {
        await apiClient.delete(`/courses/${id}`)
    },

    getProfessors: async (): Promise<UsersByRoleResponse> => {
            const response = await apiClient.get(`/courses/professors`)
            return response.data
          },
    
}