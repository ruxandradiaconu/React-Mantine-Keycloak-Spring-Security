"use client"

import type React from "react"

import { Group, Burger, Text, Button, Avatar, Menu, Badge } from "@mantine/core"
import { IconUser, IconLogout, IconSettings } from "@tabler/icons-react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

interface HeaderProps {
  opened: boolean
  toggle: () => void
}

export const Header: React.FC<HeaderProps> = ({ opened, toggle }) => {
  const { user, isAuthenticated, isLoading, login, logout, error } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      window.location.href = "/"
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text size="lg" fw={600}>
          Spring Boot + Keycloak Demo
        </Text>
      </Group>

      <Group>
        {isLoading ? (
          <Text size="sm" c="dimmed">
            Loading...
          </Text>
        ) : isAuthenticated && user ? (
          <Group>
            {user.authType && (
              <Badge size="sm" color="blue">
                {user.authType}
              </Badge>
            )}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" leftSection={<Avatar size="sm" />}>
                  {user.firstName} {user.lastName}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account ({user.username})</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  color="red"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <Group>
            {error && (
              <Text size="sm" c="red">
                {error}
              </Text>
            )}
            <Button onClick={login}>Login</Button>
          </Group>
        )}
      </Group>
    </Group>
  )
}
