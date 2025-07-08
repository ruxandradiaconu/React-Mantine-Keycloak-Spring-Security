import axios from "axios"
import {apiClient} from "./apiClient"
import { Tutorial } from "../types/tutorialType"


export const apiTutorials = {
// Tutorial endpoints
  getTutorials: async (): Promise<Tutorial[]> => {
    const response = await apiClient.get("/tutorials")
    return response.data
  },

  getTutorialById: async (id: number): Promise<Tutorial> => {
    const response = await apiClient.get(`/tutorials/${id}`)
    return response.data
  },

  searchTutorials: async (searchTerm: string): Promise<Tutorial[]> => {
    const response = await apiClient.get(`/tutorials/search?q=${encodeURIComponent(searchTerm)}`)
    return response.data
  },

  createTutorial: async (tutorial: Omit<Tutorial, "id">): Promise<Tutorial> => {
    const response = await apiClient.post("/tutorials", tutorial)
    return response.data
  },

  updateTutorial: async (id: number, tutorial: Omit<Tutorial, "id">): Promise<Tutorial> => {
    const response = await apiClient.put(`/tutorials/${id}`, tutorial)
    return response.data
  },

  deleteTutorial: async (id: number): Promise<void> => {
    await apiClient.delete(`/tutorials/${id}`)
  },
}

export type { Tutorial }
