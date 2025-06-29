package com.example.demo.repository;

import com.example.demo.entity.TutorialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TutorialRepository extends JpaRepository<TutorialEntity, Long> {
    List<TutorialEntity> findByTutorialValueContainingIgnoreCase(String tutorialValue);

    Optional<TutorialEntity> findByTutorialValue(String tutorialValue);

    boolean existsByTutorialValue(String tutorialValue);
}
