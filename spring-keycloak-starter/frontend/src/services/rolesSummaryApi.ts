import { RolesSummary } from "../types/rolesSummaryType"
import { apiClient } from "./apiClient"

export const apiGetRolesSummary = {
    
      getRolesSummary: async (): Promise<RolesSummary> => {
        const response = await apiClient.get("/admin/roles")
        return response.data
      },
    
}