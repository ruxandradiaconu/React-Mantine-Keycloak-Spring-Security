"use client"

import React, { useEffect, useState } from "react"
import { Container, Title, Table, Loader, Alert, Button, Group, TextInput, Stack, NumberInput, Checkbox, ActionIcon, Text } 
    from "@mantine/core"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { modals } from "@mantine/modals"
import { apiClassrooms } from "../services/classroomsApi"
import { IconX } from "@tabler/icons-react"

export const ClassroomsPage = () => {

    // const [isStud, setIsStud] = useState<Classroom[]>([]);

    // useEffect(() => {
    //     const fetchClassrooms = async () => {
    //         setIsStud(await apiClassrooms.getClassrooms())
    //     }
    //     fetchClassrooms()
    // }, []);

    const queryClient = useQueryClient();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["classrooms"],
        queryFn: apiClassrooms.getClassrooms,
       
    })

    const createClassroomMutation = useMutation({
        mutationFn: apiClassrooms.createClassroom,
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Classroom created successfully",
                color: "green",
            });
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "Failed to create classroom",
                color: "red",
            });
        },
    });

    const deleteClassroomMutation = useMutation({
        mutationFn: apiClassrooms.deleteClassroom,
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Classroom deleted successfully",
                color: "green",
            });
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "Failed to delete classroom",
                color: "red",
            });
        },
    });


    const openAddClassroomModal = () => {
        let newClassroom = {
        name: "",
        floor: null as number | null,
        capacity: null as number | null,
        type: "",
        has_video_projector: false,
        }

        modals.openConfirmModal({
        title: "Add New Classroom",
        children: (
            <Stack>
            <TextInput
                label="Name"
                placeholder="e.g., Seminar Room"
                required
                onChange={(e) => (newClassroom.name = e.target.value)}
            />
            <NumberInput
                label="Floor"
                placeholder="e.g., 1"
                onChange={(value) => (newClassroom.floor = typeof value === "number" ? value : null)}
            />
            <NumberInput
                label="Capacity"
                placeholder="e.g., 30"
                onChange={(value) => (newClassroom.capacity = typeof value === "number" ? value : null)}
            />
            <TextInput
                label="Type"
                placeholder="LABORATORY, SEMINAR, etc."
                onChange={(e) => (newClassroom.type = e.target.value)}
            />
            <Checkbox
                label="Has Video Projector"
                onChange={(e) => (newClassroom.has_video_projector = e.currentTarget.checked)}
            />
            </Stack>
        ),
        labels: { confirm: "Create", cancel: "Cancel" },
        onConfirm: () => {
            if (!newClassroom.name.trim()) {
            notifications.show({
                title: "Validation Error",
                message: "Name is required",
                color: "red",
            })
            return
            }
            createClassroomMutation.mutate(newClassroom)
        },
        })
  }

  const deleteClassroomModal = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete classroom',
      centered: true,
      children: (
        <Text size="s">  Are you sure you want to delete this classroom? </Text>
        ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteClassroomMutation.mutate(id)
    })
  }


    if (isLoading) {
        console.log("loading");
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
            <Title order={1} mb="md">Classrooms</Title>

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
                            <ActionIcon variant="transparent" color="red" size="xl" onClick={() => 
                                deleteClassroomModal(classroom.id)}><IconX/></ActionIcon>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <br></br>
            <Group justify="center">
            <Button onClick={openAddClassroomModal}>Add New Classroom</Button>
            </Group>

            

        </Container>
    )
}
