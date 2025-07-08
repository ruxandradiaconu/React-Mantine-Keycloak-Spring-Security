package com.example.demo.repository;

import com.example.demo.entity.ClassroomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<ClassroomEntity, Integer> {
//	List<ClassroomEntity> findByClassroomValueContainingIgnoreCase(String classroomValue);

//	Optional<TutorialEntity> findByTutorialValue(String tutorialValue);

//	boolean existsByClassroomValue(String classroomValue);

}
