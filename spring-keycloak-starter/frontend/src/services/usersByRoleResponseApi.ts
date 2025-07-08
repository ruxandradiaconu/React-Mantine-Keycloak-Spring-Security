import { UsersByRoleResponse } from "../types/usersByRoleResponseType"
import { apiClient } from "./apiClient"

export const apiUsersByRoleResponse = {
    // Admin endpoints
      getUsersByRole: async (role: string): Promise<UsersByRoleResponse> => {
        const response = await apiClient.get(`/admin/users/by-role/${role}`)
        return response.data
      },
}