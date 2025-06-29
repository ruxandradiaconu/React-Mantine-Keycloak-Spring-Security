"use client"

import type React from "react"

import { Container, Title, Text, Button, Card, SimpleGrid, Badge, Group } from "@mantine/core"
import { IconDatabase, IconShield, IconCode, IconBrandReact } from "@tabler/icons-react"
import { useAuth } from "../contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api"

export const HomePage: React.FC = () => {
  const { isAuthenticated, login } = useAuth()

  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: api.health,
  })

  const features = [
    {
      icon: IconCode,
      title: "Spring Boot 3.x",
      description: "Modern Java framework with auto-configuration",
    },
    {
      icon: IconDatabase,
      title: "H2 Database",
      description: "In-memory database for development",
    },
    {
      icon: IconShield,
      title: "Keycloak Auth",
      description: "Enterprise-grade authentication and authorization",
    },
    {
      icon: IconBrandReact,
      title: "React + Mantine",
      description: "Modern React UI with TypeScript and TanStack Query",
    },
  ]

  return (
    <Container size="lg">
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title order={1} mb="md">
          Welcome to Spring Boot + Keycloak Demo
        </Title>
        <Text size="lg" c="dimmed" mb="xl">
          A complete starter project with modern authentication and database integration
        </Text>

        <Group justify="center" align="center">
          {health && (
            <Badge color="green" size="lg" mb="xl">
              Backend Status: {health.status}
            </Badge>
          )}

          {!isAuthenticated && (
            <Button size="lg" onClick={login}>
              Login with Keycloak
            </Button>
          )}

        </Group>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {features.map((feature, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <feature.icon size="1.2rem" />
                <Text fw={500}>{feature.title}</Text>
              </div>
            </Card.Section>

            <Text size="sm" c="dimmed" mt="sm">
              {feature.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container >
  )
}
