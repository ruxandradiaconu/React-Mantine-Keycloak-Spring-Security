"use client"

import type React from "react"

import {
    Container,
    Title,
    Table,
    Loader,
    Alert,
    Button,
    Modal,
    TextInput,
    Stack,
    Group,
    ActionIcon,
    Text,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react"
import { useAuth } from "../contexts/AuthContext"
import { apiTutorials, type Tutorial } from "../services/tutorialsApi"

export const TutorialsPage: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth()
    const [opened, { open, close }] = useDisclosure(false)
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [newTutorial, setNewTutorial] = useState<Omit<Tutorial, "id">>({
        tutorialValue: "",
    })
    const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null)

    const queryClient = useQueryClient()

    const {
        data: tutorials,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tutorials"],
        queryFn: apiTutorials.getTutorials,
    })

    const { data: searchResults, isLoading: searchLoading } = useQuery({
        queryKey: ["searchTutorials", searchTerm],
        queryFn: () => apiTutorials.searchTutorials(searchTerm),
        enabled: searchTerm.length > 0,
    })

    const createTutorialMutation = useMutation({
        mutationFn: apiTutorials.createTutorial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutorials"] })
            notifications.show({
                title: "Success",
                message: "Tutorial created successfully",
                color: "green",
            })
            close()
            setNewTutorial({ tutorialValue: "" })
        },
        onError: (error: any) => {
            const message =
                error.response?.status === 409 ? "Tutorial with this value already exists" : "Failed to create tutorial"
            notifications.show({
                title: "Error",
                message,
                color: "red",
            })
        },
    })

    const updateTutorialMutation = useMutation({
        mutationFn: ({ id, tutorial }: { id: number; tutorial: Omit<Tutorial, "id"> }) => apiTutorials.updateTutorial(id, tutorial),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutorials"] })
            notifications.show({
                title: "Success",
                message: "Tutorial updated successfully",
                color: "green",
            })
            closeEdit()
            setEditingTutorial(null)
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "Failed to update tutorial",
                color: "red",
            })
        },
    })

    const deleteTutorialMutation = useMutation({
        mutationFn: apiTutorials.deleteTutorial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutorials"] })
            notifications.show({
                title: "Success",
                message: "Tutorial deleted successfully",
                color: "green",
            })
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "Failed to delete tutorial",
                color: "red",
            })
        },
    })

    if (!isAuthenticated) {
        return (
            <Container>
                <Alert color="yellow">Please log in to access tutorials.</Alert>
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
                <Alert color="red">Failed to load tutorials.</Alert>
            </Container>
        )
    }

    const handleCreateTutorial = () => {
        createTutorialMutation.mutate(newTutorial)
    }

    const handleEditTutorial = (tutorial: Tutorial) => {
        setEditingTutorial(tutorial)
        openEdit()
    }

    const handleUpdateTutorial = () => {
        if (editingTutorial) {
            updateTutorialMutation.mutate({
                id: editingTutorial.id!,
                tutorial: { tutorialValue: editingTutorial.tutorialValue },
            })
        }
    }

    const handleDeleteTutorial = (id: number) => {
        if (window.confirm("Are you sure you want to delete this tutorial?")) {
            deleteTutorialMutation.mutate(id)
        }
    }

    const displayTutorials = searchTerm.length > 0 ? searchResults : tutorials

    return (
        <Container size="xl">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <Title order={1}>Tutorials</Title>
                <Button onClick={open}>Add Tutorial</Button>
            </div>

            {/* Search */}
            <Group mb="md">
                <TextInput
                    placeholder="Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftSection={<IconSearch size={16} />}
                    style={{ flexGrow: 1 }}
                />
                {searchLoading && <Loader size="sm" />}
            </Group>

            {searchTerm && (
                <Text size="sm" c="dimmed" mb="md">
                    {searchResults?.length || 0} results for "{searchTerm}"
                </Text>
            )}

            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Tutorial Value</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Updated At</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {displayTutorials?.map((tutorial) => (
                        <Table.Tr key={tutorial.id}>
                            <Table.Td>{tutorial.id}</Table.Td>
                            <Table.Td>{tutorial.tutorialValue}</Table.Td>
                            <Table.Td>{tutorial.createdAt ? new Date(tutorial.createdAt).toLocaleDateString() : "N/A"}</Table.Td>
                            <Table.Td>{tutorial.updatedAt ? new Date(tutorial.updatedAt).toLocaleDateString() : "N/A"}</Table.Td>
                            <Table.Td>
                                <Group gap="xs">
                                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEditTutorial(tutorial)}>
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    {isAdmin && (
                                        <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteTutorial(tutorial.id!)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            {/* Create Tutorial Modal */}
            <Modal opened={opened} onClose={close} title="Add New Tutorial">
                <Stack gap="md">
                    <TextInput
                        label="Tutorial Value"
                        value={newTutorial.tutorialValue}
                        onChange={(e) => setNewTutorial({ ...newTutorial, tutorialValue: e.target.value })}
                        required
                    />
                    <Button
                        onClick={handleCreateTutorial}
                        loading={createTutorialMutation.isPending}
                        disabled={!newTutorial.tutorialValue.trim()}
                    >
                        Create Tutorial
                    </Button>
                </Stack>
            </Modal>

            {/* Edit Tutorial Modal */}
            <Modal opened={editOpened} onClose={closeEdit} title="Edit Tutorial">
                <Stack gap="md">
                    <TextInput
                        label="Tutorial Value"
                        value={editingTutorial?.tutorialValue || ""}
                        onChange={(e) => setEditingTutorial((prev) => (prev ? { ...prev, tutorialValue: e.target.value } : null))}
                        required
                    />
                    <Button
                        onClick={handleUpdateTutorial}
                        loading={updateTutorialMutation.isPending}
                        disabled={!editingTutorial?.tutorialValue.trim()}
                    >
                        Update Tutorial
                    </Button>
                </Stack>
            </Modal>
        </Container>
    )
}
