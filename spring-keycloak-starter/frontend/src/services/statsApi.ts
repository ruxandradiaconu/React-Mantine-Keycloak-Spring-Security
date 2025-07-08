import { apiClient } from "./apiClient"
// import api from "./api"
import { Stats } from "../types/statsType"


export const apiStats = {
    
  getStats: async (): Promise<Stats> => {
    const response = await apiClient.get("/stats")
    return response.data
  },

  // Public endpoints
  health: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get("/public/health")
    return response.data
  },

  logout: async (): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post("/auth/logout")
    return response.data
  },
}