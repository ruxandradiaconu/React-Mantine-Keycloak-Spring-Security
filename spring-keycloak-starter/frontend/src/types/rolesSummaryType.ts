
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