import { Classroom } from "../types/classroomType"
import { apiClient } from "./apiClient"

export const apiClassrooms = {
    
      getClassrooms: async (): Promise<Classroom[]> => {
        const response = await apiClient.get("/classrooms")
        return response.data
      },

      createClassroom: async (classroom: Omit<Classroom, "id">): Promise<Classroom> => {
        const response = await apiClient.post("/classrooms", classroom)
        return response.data
      },

      deleteClassroom: async (id: number) : Promise<void> => {
        await apiClient.delete(`/classrooms/${id}`)
      },
}