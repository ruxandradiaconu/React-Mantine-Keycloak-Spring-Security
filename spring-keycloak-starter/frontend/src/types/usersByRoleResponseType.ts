
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