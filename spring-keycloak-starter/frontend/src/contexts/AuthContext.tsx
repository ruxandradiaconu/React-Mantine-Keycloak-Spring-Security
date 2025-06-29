"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../services/api"

interface User {
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  authType?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  isAdmin: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setError(null)
    } else if (queryError) {
      setIsAuthenticated(false)
      setError(queryError.message === "UNAUTHORIZED" ? "Please log in to continue" : "Authentication error occurred")
    }
  }, [user, queryError])

  const login = () => {
    window.location.href = "/oauth2/authorization/keycloak"
  }

  const logout = async () => {
    try {
      await api.logout()
      queryClient.clear()
      setIsAuthenticated(false)
      setError(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      queryClient.clear()
      setIsAuthenticated(false)
      setError(null)
      window.location.href = "/"
    }
  }

  const isAdmin = user?.roles?.includes("ADMIN") || false

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isAdmin,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
