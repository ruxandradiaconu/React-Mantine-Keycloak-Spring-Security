package com.example.demo.service;

import com.example.demo.entity.TutorialEntity;
import com.example.demo.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TutorialService {

    @Autowired
    private TutorialRepository tutorialRepository;

    @Autowired
    private KeycloakService keycloakService;

    public List<TutorialEntity> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    public Optional<TutorialEntity> getTutorialById(Long id) {
        return tutorialRepository.findById(id);
    }

    public List<TutorialEntity> searchTutorials(String searchTerm) {
        return tutorialRepository.findByTutorialValueContainingIgnoreCase(searchTerm);
    }

    public TutorialEntity saveTutorial(TutorialEntity tutorial) {
        return tutorialRepository.save(tutorial);
    }

    public TutorialEntity updateTutorial(Long id, String tutorialValue) {
        TutorialEntity tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial not found with id: " + id));
        tutorial.setTutorialValue(tutorialValue);
        return tutorialRepository.save(tutorial);
    }

    public void deleteTutorial(Long id) {
        tutorialRepository.deleteById(id);
    }

    public boolean existsByTutorialValue(String tutorialValue) {
        return tutorialRepository.existsByTutorialValue(tutorialValue);
    }

    // Admin functionality for user management
    public List<Map<String, Object>> getUsersByRole(String roleName) {
        return keycloakService.getUsersByRole(roleName);
    }

    public Map<String, Object> getRolesSummary() {
        return keycloakService.getRolesSummary();
    }
}
