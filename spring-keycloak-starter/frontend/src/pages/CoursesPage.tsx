"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {Container, Title, Table, Loader, Alert, Stack, Text, Badge, Button, Group, TextInput, Select,} from "@mantine/core"
import { apiUsersByRoleResponse } from "../services/usersByRoleResponseApi"
import { apiCourses } from "../services/coursesApi"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { Course } from "../types/coursesType"
import { UsersByRoleResponse } from "../types/usersByRoleResponseType"
import { useState } from "react"



export const CoursesPage = () => {

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: apiCourses.getCourses,
  })

  // const {data: professors} = useQuery({
  //   queryKey: ["course-professors"],
  //   queryFn: apiCourses.getProfessors,
  // })
  const [selectedRole, setSelectedRole] = useState<string>("PROFESOR")
  const {
          data: professorUsers,
      } = useQuery({
          queryKey: ["professorUsers", selectedRole],
          queryFn: () => apiUsersByRoleResponse.getUsersByRole(selectedRole),
      })

  const professorMap = new Map<string, string>(
  (professorUsers?.users || []).map((p) => [p.username, `${p.firstName} ${p.lastName}`])
)

  

  // const { data: professors, isLoading: loadingProfessors } = useQuery<UsersByRoleResponse[]>({
  //   queryKey: ["professors"],
  //   queryFn:  apiCourses.getProfessors(),
  // })


  const createCourseMutation = useMutation({
          mutationFn: apiCourses.createCourse,
          onSuccess: () => {
            //   notifications.show({
            //       title: "Success",
            //       message: "Classroom created successfully",
            //       color: "green",
            //   });
              queryClient.invalidateQueries({ queryKey: ["courses"] });
          },
          onError: () => {
              notifications.show({
                  title: "Error",
                  message: "Failed to create course",
                  color: "red",
              });
          },
      });

  const openAddCourseModal = () => {
          let newCourse = {
          course_name: "",
          professor_username: "",
          }
          

          const professorOptions =
            professorUsers?.users?.map((prof) => ({
              value: prof.username,
              label: `${prof.firstName} ${prof.lastName} (${prof.username})`,
            })) || []
  
          modals.openConfirmModal({
          title: "Add New Classroom",
          children: (
              <Stack>
              <TextInput
                  label="Course Name"
                  placeholder="ex.: Object Oriented Programming"
                  required
                  onChange={(e) => (newCourse.course_name = e.target.value)}
              />
              <Select
                label="Professor Name"
                placeholder="Choose a course professor"
                data={professorOptions}
                required
                onChange={(value) => newCourse.professor_username = value!} 
                />
              </Stack>
          ),
          labels: { confirm: "Create", cancel: "Cancel" },
          onConfirm: () => {
              if (!newCourse.course_name.trim()) {
              notifications.show({
                  title: "Validation Error",
                  message: "Name is required",
                  color: "red",
              })
              return
              }
              createCourseMutation.mutate(newCourse)
          },
          })
  }

  return (
    <Container size="xl">
        <Group justify="space-between">
            <Title>Courses</Title>
            <Button onClick={openAddCourseModal}>Add New Course</Button>
        </Group>

      {isLoading && <Loader />}

      {error && (
        <Alert color="red">Could not load courses from backend</Alert>
      )}

      {(
        <Stack gap="md">
          {data?.length === 0 ? (
            <Alert color="blue">No courses found.</Alert>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Course Name</Table.Th>
                  <Table.Th>Professor Name</Table.Th>
                  <Table.Th>Professor Username</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.map((course) => (
                  <Table.Tr key={course.id}>
                    <Table.Td>{course.course_name}</Table.Td>
                    <Table.Td>{professorMap.get(course.professor_username) || "-"}</Table.Td>
                    <Table.Td>{course.professor_username || "-"}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      )}
    </Container>
  )
}

