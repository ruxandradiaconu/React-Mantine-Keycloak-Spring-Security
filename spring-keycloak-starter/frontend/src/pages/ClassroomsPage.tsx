"use client"

import React from "react"
import { Container, Title, Table, Loader, Alert } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api"

export const ClassroomsPage: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["classrooms"],
        queryFn: api.getClassrooms,
    })

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
                <Alert color="red">Failed to load classrooms.</Alert>
            </Container>
        )
    }

    return (
        <Container size="xl">
            <Title order={1} mb="md">
                Classrooms
            </Title>

            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Floor</Table.Th>
                        <Table.Th>Capacity</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Has Video Projector?</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data?.map((classroom) => (
                        <Table.Tr key={classroom.id}>
                            <Table.Td>{classroom.id}</Table.Td>
                            <Table.Td>{classroom.name}</Table.Td>
                            <Table.Td>{classroom.floor ?? "-"}</Table.Td>
                            <Table.Td>{classroom.capacity ?? "-"}</Table.Td>
                            <Table.Td>{classroom.type ?? "-"}</Table.Td>
                            <Table.Td>{classroom.has_video_projector ? "Yes" : "No"}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    )
}
