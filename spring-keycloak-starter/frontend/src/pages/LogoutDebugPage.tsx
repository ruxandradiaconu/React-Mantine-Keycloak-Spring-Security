"use client"

import type React from "react"

import { Container, Title, Card, Text, Button, Stack, Alert, Code } from "@mantine/core"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { apiUserInfo } from "../services/userInfoApi"

export const LogoutDebugPage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const [logoutResponse, setLogoutResponse] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const testLogoutAPI = async () => {
        try {
            setError(null)
            const response = await apiUserInfo.logout()
            setLogoutResponse(response)
            console.log("Logout API response:", response)
        } catch (err: any) {
            setError(err.message || "Logout API failed")
            console.error("Logout API error:", err)
        }
    }

    const testFullLogout = async () => {
        try {
            setError(null)
            await logout()
        } catch (err: any) {
            setError(err.message || "Full logout failed")
            console.error("Full logout error:", err)
        }
    }

    const clearLocalData = () => {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=")
            const name = eqPos > -1 ? c.substr(0, eqPos) : c
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost"
        })

        // Clear localStorage and sessionStorage
        localStorage.clear()
        sessionStorage.clear()

        alert("Local data cleared. Please refresh the page.")
    }

    const forceRedirectHome = () => {
        window.location.href = "/"
    }

    return (
        <Container size="lg">
            <Title order={1} mb="xl">
                Simple Logout Debug
            </Title>

            <Stack gap="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        Current Authentication State
                    </Title>
                    <Text>Authenticated: {isAuthenticated ? "Yes" : "No"}</Text>
                    {user && (
                        <Stack gap="xs" mt="md">
                            <Text>Username: {user.username}</Text>
                            <Text>Auth Type: {user.authType}</Text>
                            <Text>Roles: {user.roles?.join(", ")}</Text>
                        </Stack>
                    )}
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        Logout Tests (API Only)
                    </Title>
                    <Stack gap="md">
                        <Button onClick={testLogoutAPI} variant="outline">
                            Test Logout API Only
                        </Button>
                        <Button onClick={testFullLogout} color="blue">
                            Test Full Logout Process (Recommended)
                        </Button>
                        <Button onClick={clearLocalData} color="orange" variant="outline">
                            Clear Local Data Only
                        </Button>
                        <Button onClick={forceRedirectHome} color="red" variant="outline">
                            Force Redirect to Home
                        </Button>
                    </Stack>
                </Card>

                {logoutResponse && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">
                            Logout API Response
                        </Title>
                        <Code block>{JSON.stringify(logoutResponse, null, 2)}</Code>
                    </Card>
                )}

                {error && (
                    <Alert color="red" title="Error">
                        {error}
                    </Alert>
                )}

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">
                        How This Works
                    </Title>
                    <Stack gap="xs">
                        <Text size="sm">1. Click logout button in header</Text>
                        <Text size="sm">2. Calls POST /apiUserInfo/auth/logout</Text>
                        <Text size="sm">3. Backend clears session and cookies</Text>
                        <Text size="sm">4. Frontend clears cache and state</Text>
                        <Text size="sm">5. Redirects to home page</Text>
                        <Text size="sm" c="green">
                            ✓ No Keycloak redirect complexity
                        </Text>
                    </Stack>
                </Card>

                <Alert color="blue" title="Note">
                    This simplified logout only uses the API endpoint that you confirmed is working. No Keycloak redirects or
                    complex logout flows.
                </Alert>
            </Stack>
        </Container>
    )
}
