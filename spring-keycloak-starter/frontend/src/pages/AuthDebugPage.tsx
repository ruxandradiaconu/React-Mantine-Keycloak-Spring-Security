"use client"

import type React from "react"

import { Container, Title, Card, Text, Stack, Alert, Badge, Group, Code } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"

export const AuthDebugPage: React.FC = () => {
    const { user, isAuthenticated, isLoading, error, isAdmin } = useAuth()

    const { data: health } = useQuery({
        queryKey: ["health"],
        queryFn: api.health,
    })

    const { data: stats } = useQuery({
        queryKey: ["stats"],
        queryFn: api.getStats,
        enabled: isAuthenticated,
    })

    return (
        <Container size="lg">
            <Title order={1} mb="xl">
                Authentication Debug
            </Title>

            <Stack gap="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        Backend Health
                    </Title>
                    <Text>Status: {health?.status || "Unknown"}</Text>
                    <Text>Message: {health?.message || "No response"}</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        Authentication State
                    </Title>
                    <Group gap="md" mb="md">
                        <Badge color={isLoading ? "yellow" : "gray"}>Loading: {isLoading ? "Yes" : "No"}</Badge>
                        <Badge color={isAuthenticated ? "green" : "red"}>Authenticated: {isAuthenticated ? "Yes" : "No"}</Badge>
                        <Badge color={isAdmin ? "blue" : "gray"}>Admin: {isAdmin ? "Yes" : "No"}</Badge>
                    </Group>
                    {error && (
                        <Alert color="red" mb="md">
                            Error: {error}
                        </Alert>
                    )}
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        User Information
                    </Title>
                    {user ? (
                        <Stack gap="sm">
                            <Text>
                                <strong>Username:</strong> {user.username}
                            </Text>
                            <Text>
                                <strong>Email:</strong> {user.email}
                            </Text>
                            <Text>
                                <strong>Name:</strong> {user.firstName} {user.lastName}
                            </Text>
                            <Text>
                                <strong>Auth Type:</strong> {user.authType}
                            </Text>
                            <Group gap="xs">
                                <Text>
                                    <strong>Roles:</strong>
                                </Text>
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Badge key={role} color={role === "ADMIN" ? "red" : "blue"}>
                                            {role}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge color="gray">No roles</Badge>
                                )}
                            </Group>
                            {(user as any).springAuthorities && (
                                <div>
                                    <Text size="sm" fw={500} mb="xs">
                                        Spring Security Authorities:
                                    </Text>
                                    <Group gap="xs">
                                        {(user as any).springAuthorities.map((auth: string) => (
                                            <Badge key={auth} color="green" size="sm">
                                                {auth}
                                            </Badge>
                                        ))}
                                    </Group>
                                </div>
                            )}
                        </Stack>
                    ) : (
                        <Text c="dimmed">No user data available</Text>
                    )}
                </Card>

                {stats && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">
                            Application Stats
                        </Title>
                        <Text>Total Tutorials: {stats.totalTutorials}</Text>
                        <Text>Is Admin: {stats.isAdmin ? "Yes" : "No"}</Text>
                        {(stats as any).userAuthorities && (
                            <div>
                                <Text size="sm" fw={500} mt="sm" mb="xs">
                                    Current Authorities:
                                </Text>
                                <Code block>{JSON.stringify((stats as any).userAuthorities, null, 2)}</Code>
                            </div>
                        )}
                    </Card>
                )}

                <Alert color="blue" title="Debug Steps">
                    <Stack gap="xs">
                        <Text size="sm">1. Check if you have Spring Security authorities (should show ROLE_ADMIN)</Text>
                        <Text size="sm">2. Verify Keycloak client mapper includes roles in ID token</Text>
                        <Text size="sm">3. Check backend logs for role extraction debug info</Text>
                        <Text size="sm">4. Ensure users have CLIENT roles assigned in Keycloak</Text>
                    </Stack>
                </Alert>
            </Stack>
        </Container>
    )
}
