"use client"

import type React from "react"

import { Container, Title, SimpleGrid, Card, Text, Loader, Alert } from "@mantine/core"
import { IconBook, IconClock, IconShield } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert color="yellow">Please log in to access the dashboard.</Alert>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert color="red">Failed to load dashboard data.</Alert>
      </Container>
    )
  }

  return (
    <Container size="lg">
      <Title order={1} mb="xl">
        Dashboard
      </Title>

      <Text size="lg" mb="xl">
        Welcome back, {user?.firstName} {user?.lastName}!
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <IconBook size="2rem" color="blue" />
            <div>
              <Text size="xl" fw={700}>
                {stats?.totalTutorials || 0}
              </Text>
              <Text size="sm" c="dimmed">
                Total Tutorials
              </Text>
            </div>
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <IconClock size="2rem" color="green" />
            <div>
              <Text size="xl" fw={700}>
                {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : "N/A"}
              </Text>
              <Text size="sm" c="dimmed">
                Last Updated
              </Text>
            </div>
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <IconShield size="2rem" color={stats?.isAdmin ? "red" : "orange"} />
            <div>
              <Text size="xl" fw={700}>
                {stats?.isAdmin ? "Admin" : "User"}
              </Text>
              <Text size="sm" c="dimmed">
                Access Level
              </Text>
            </div>
          </div>
        </Card>
      </SimpleGrid>
    </Container>
  )
}
