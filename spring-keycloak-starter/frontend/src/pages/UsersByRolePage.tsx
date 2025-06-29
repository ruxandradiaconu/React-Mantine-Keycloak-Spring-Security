"use client"

import type React from "react"

import { Container, Title, Card, Text, Button, Stack, Group, Badge, Table, Select, Loader, Alert } from "@mantine/core"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"

export const UsersByRolePage: React.FC = () => {
    const { isAdmin } = useAuth()
    const [selectedRole, setSelectedRole] = useState<string>("USER")

    const { data: rolesSummary, isLoading: loadingRoles } = useQuery({
        queryKey: ["rolesSummary"],
        queryFn: api.getRolesSummary,
        enabled: isAdmin,
    })

    const {
        data: usersByRole,
        isLoading: loadingUsers,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: ["usersByRole", selectedRole],
        queryFn: () => api.getUsersByRole(selectedRole),
        enabled: isAdmin && !!selectedRole,
    })

    if (!isAdmin) {
        return (
            <Container>
                <Alert color="red">You don't have permission to access this page.</Alert>
            </Container>
        )
    }

    const availableRoles = rolesSummary ? Object.keys(rolesSummary) : []

    return (
        <Container size="xl">
            <Title order={1} mb="xl">
                Users by Role
            </Title>

            <Stack gap="lg">
                {/* Roles Summary */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        Roles Summary
                    </Title>
                    {loadingRoles ? (
                        <Loader />
                    ) : rolesSummary ? (
                        <Group gap="md">
                            {Object.entries(rolesSummary).map(([role, data]) => (
                                <Card key={role} shadow="xs" padding="sm" withBorder>
                                    <Group gap="xs">
                                        <Badge color={role === "ADMIN" ? "red" : "blue"}>{role}</Badge>
                                        <Text size="sm">{data.count} users</Text>
                                    </Group>
                                </Card>
                            ))}
                        </Group>
                    ) : (
                        <Text c="dimmed">No roles data available</Text>
                    )}
                </Card>

                {/* Role Selection */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group gap="md" mb="md">
                        <Select
                            label="Select Role"
                            placeholder="Choose a role"
                            value={selectedRole}
                            onChange={(value) => setSelectedRole(value || "USER")}
                            data={availableRoles.map((role) => ({ value: role, label: role }))}
                            style={{ minWidth: 200 }}
                        />
                        <Button onClick={() => refetchUsers()} disabled={!selectedRole}>
                            Refresh
                        </Button>
                    </Group>

                    {/* Users Table */}
                    {loadingUsers ? (
                        <Loader />
                    ) : usersByRole ? (
                        <Stack gap="md">
                            <Group gap="md">
                                <Text size="lg" fw={600}>
                                    Users with role:
                                </Text>
                                <Badge color={selectedRole === "ADMIN" ? "red" : "blue"} size="lg">
                                    {selectedRole}
                                </Badge>
                                <Text c="dimmed">({usersByRole.count} users)</Text>
                            </Group>

                            {usersByRole.users.length > 0 ? (
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Username</Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th>First Name</Table.Th>
                                            <Table.Th>Last Name</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {usersByRole.users.map((user, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td>{user.username}</Table.Td>
                                                <Table.Td>{user.email}</Table.Td>
                                                <Table.Td>{user.firstName}</Table.Td>
                                                <Table.Td>{user.lastName}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Alert color="blue">No users found with the role "{selectedRole}"</Alert>
                            )}
                        </Stack>
                    ) : (
                        <Text c="dimmed">Select a role to view users</Text>
                    )}
                </Card>

                {/* Detailed Roles Breakdown */}
                {rolesSummary && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">
                            Detailed Roles Breakdown
                        </Title>
                        <Stack gap="md">
                            {Object.entries(rolesSummary).map(([role, data]) => (
                                <Card key={role} shadow="xs" padding="md" withBorder>
                                    <Group gap="md" mb="sm">
                                        <Badge color={role === "ADMIN" ? "red" : "blue"}>{role}</Badge>
                                        <Text size="sm" c="dimmed">
                                            {data.count} users
                                        </Text>
                                    </Group>
                                    {data.users.length > 0 && (
                                        <Stack gap="xs">
                                            {data.users.slice(0, 5).map((user, index) => (
                                                <Text key={index} size="sm">
                                                    {user.firstName} {user.lastName} ({user.username})
                                                </Text>
                                            ))}
                                            {data.users.length > 5 && (
                                                <Text size="sm" c="dimmed">
                                                    ... and {data.users.length - 5} more
                                                </Text>
                                            )}
                                        </Stack>
                                    )}
                                </Card>
                            ))}
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Container>
    )
}
