"use client"

import type React from "react"

import { Container, Title, Card, Text, Badge, Group, Stack } from "@mantine/core"
import { useAuth } from "../contexts/AuthContext"

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <Text>Please log in to view your profile.</Text>
      </Container>
    )
  }

  return (
    <Container size="sm">
      <Title order={1} mb="xl">
        Profile
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <div>
            <Text size="sm" c="dimmed">
              Username
            </Text>
            <Text fw={500}>{user.username}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              Email
            </Text>
            <Text fw={500}>{user.email}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              First Name
            </Text>
            <Text fw={500}>{user.firstName}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              Last Name
            </Text>
            <Text fw={500}>{user.lastName}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Roles
            </Text>
            <Group gap="xs">
              {user.roles?.map((role) => (
                <Badge key={role} color={role === "ADMIN" ? "red" : "blue"}>
                  {role}
                </Badge>
              ))}
            </Group>
          </div>
        </Stack>
      </Card>
    </Container>
  )
}
