"use client"

import type React from "react"

import { NavLink, Stack, Text } from "@mantine/core"
import { IconHome, IconDashboard, IconBook, IconUser, IconBug, IconUsersGroup } from "@tabler/icons-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const Navbar: React.FC = () => {
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuth()

  const navItems = [
    { icon: IconHome, label: "Home", path: "/", public: true },
    { icon: IconDashboard, label: "Dashboard", path: "/dashboard", public: false },
    { icon: IconUser, label: "Profile", path: "/profile", public: false },
    { icon: IconBook, label: "Tutorials", path: "/tutorials", public: false },
    { icon: IconUsersGroup, label: "Users by Role", path: "/users-by-role", public: false, adminOnly: true },
    { icon: IconBug, label: "Debug", path: "/debug", public: true },
  ]

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed" mb="md">
        Navigation
      </Text>

      {navItems.map((item) => {
        const shouldShow = item.public || isAuthenticated
        const shouldShowAdmin = !item.adminOnly || isAdmin

        if (!shouldShow || !shouldShowAdmin) return null

        return (
          <NavLink
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            active={location.pathname === item.path}
          />
        )
      })}
    </Stack>
  )
}
