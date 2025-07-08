package com.example.demo.controller;

import com.example.demo.entity.ClassroomEntity;
import com.example.demo.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ClassroomController {

	@Autowired
	private ClassroomService classroomService;

	@GetMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<ClassroomEntity>> getAllClassrooms() {
		return ResponseEntity.ok(classroomService.getAllClassrooms());
	}
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public void	addClassroom(@RequestBody ClassroomEntity newClassroom){
		classroomService.addClassroom(newClassroom);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteClassroom(@PathVariable Integer id) {
		classroomService.deleteClassroom(id);
//		return ResponseEntity.ok().build();
	}
}

