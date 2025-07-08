import { UserInfo } from "../types/userInfoType"
import { apiClient } from "./apiClient"
import axios from "axios"


export const apiUserInfo = {
  
  // Auth endpoints
  getCurrentUser: async (): Promise<UserInfo> => {
    try {
      const response = await apiClient.get("/me")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error("UNAUTHORIZED")
      }
      throw error
    }
  },

  logout: async (): Promise<{ message: string; status: string }> => {
      const response = await apiClient.post("/auth/logout")
      return response.data
    },
  
}