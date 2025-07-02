package com.example.demo.controller;

import com.example.demo.entity.ClassroomEntity;
import com.example.demo.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ClassroomController {

	@Autowired
	private ClassroomService classroomService;


	@GetMapping
	@PreAuthorize("hasRole('PROFESOR')")
	public ResponseEntity<List<ClassroomEntity>> getAllClassrooms() {
		return ResponseEntity.ok(classroomService.getAllClassrooms());
	}
}
