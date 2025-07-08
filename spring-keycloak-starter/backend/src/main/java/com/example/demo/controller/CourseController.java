package com.example.demo.controller;

import com.example.demo.entity.ClassroomEntity;
import com.example.demo.entity.CourseEntity;
import com.example.demo.service.CourseService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

 	@Autowired
	private CourseService courseService;

	@GetMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<CourseEntity>> getAllCourses() {
		return ResponseEntity.ok(courseService.getAllCourses());
	}
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public void	addCourse(@RequestBody CourseEntity newCourse){
		courseService.addCourse(newCourse);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteCourse(@PathVariable Integer id) {
		courseService.deleteCourse(id);
	}

//	private static final Logger logger = LoggerFactory.getLogger(CourseController.class);


//	@GetMapping("/professors")
//	public ResponseEntity<?> getProfessorsTest() {
//		List<Map<String, Object>> professors = courseService.getProfessors();
//		logger.info("Professors from Keycloak: {}");
//		return ResponseEntity.ok(professors);
//	}

//	@PostConstruct
//	public void logInitialProfessors() {
//		List<Map<String, Object>> professors = courseService.getProfessors();
//		logger.info("Found professors: {}", professors);
//	}


}
