import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Authentication required")
    }
    return Promise.reject(error)
  },
)

export interface Tutorial {
  id?: number
  tutorialValue: string
  createdAt?: string
  updatedAt?: string
}

export interface UserInfo {
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  authType?: string
}

export interface Stats {
  totalTutorials: number
  timestamp: number
  isAdmin: boolean
}

export interface UsersByRoleResponse {
  role: string
  count: number
  users: Array<{
    username: string
    email: string
    firstName: string
    lastName: string
  }>
  timestamp: number
}

export interface RolesSummary {
  [roleName: string]: {
    count: number
    users: Array<{
      username: string
      email: string
      firstName: string
      lastName: string
    }>
  }
}

export const api = {
  // Public endpoints
  health: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get("/public/health")
    return response.data
  },

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

  // Admin endpoints
  getUsersByRole: async (role: string): Promise<UsersByRoleResponse> => {
    const response = await apiClient.get(`/admin/users/by-role/${role}`)
    return response.data
  },

  getRolesSummary: async (): Promise<RolesSummary> => {
    const response = await apiClient.get("/admin/roles")
    return response.data
  },

  getStats: async (): Promise<Stats> => {
    const response = await apiClient.get("/stats")
    return response.data
  },
}
