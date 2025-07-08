package com.example.demo.service;

import com.example.demo.entity.ClassroomEntity;
import com.example.demo.entity.CourseEntity;
import com.example.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CourseService {

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private KeycloakService keycloakService;

	public List<CourseEntity> getAllCourses(){
		return courseRepository.findAll();
	}


	public void addCourse(CourseEntity courseEntity){
		courseRepository.save(courseEntity);
	}

	public void deleteCourse(Integer Id){
		courseRepository.deleteById(Long.valueOf(Id));
	}

	public List<Map<String, Object>> getProfessors(){
		return keycloakService.getUsersByRole("PROFESOR");
	}
}
