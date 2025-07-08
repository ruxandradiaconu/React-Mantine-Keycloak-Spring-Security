package com.example.demo.service;


import com.example.demo.entity.ClassroomEntity;
import com.example.demo.entity.TutorialEntity;
import com.example.demo.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClassroomService {
	@Autowired
	private ClassroomRepository classroomRepository;

	@Autowired
	private KeycloakService keycloakService;

	public List<ClassroomEntity> getAllClassrooms(){
		return classroomRepository.findAll();
	}

	public Optional<ClassroomEntity> getClassroomById(Long id) {
		return classroomRepository.findById(Math.toIntExact(id));
	}

	public void addClassroom(ClassroomEntity classroomEntity){
		classroomRepository.save(classroomEntity);
	}

	public void deleteClassroom(Integer Id){
		classroomRepository.deleteById(Id);
	}

}
