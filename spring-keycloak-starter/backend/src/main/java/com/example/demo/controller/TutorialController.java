package com.example.demo.controller;

import com.example.demo.entity.TutorialEntity;
import com.example.demo.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tutorials")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @GetMapping
    public ResponseEntity<List<TutorialEntity>> getAllTutorials() {
        return ResponseEntity.ok(tutorialService.getAllTutorials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorialEntity> getTutorialById(@PathVariable Long id) {
        Optional<TutorialEntity> tutorial = tutorialService.getTutorialById(id);
        return tutorial.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TutorialEntity>> searchTutorials(@RequestParam String q) {
        List<TutorialEntity> tutorials = tutorialService.searchTutorials(q);
        return ResponseEntity.ok(tutorials);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TutorialEntity> createTutorial(@RequestBody TutorialEntity tutorial) {
        if (tutorial.getTutorialValue() == null || tutorial.getTutorialValue().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (tutorialService.existsByTutorialValue(tutorial.getTutorialValue())) {
            return ResponseEntity.status(409).build(); // Conflict - tutorial already exists
        }

        TutorialEntity savedTutorial = tutorialService.saveTutorial(tutorial);
        return ResponseEntity.ok(savedTutorial);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TutorialEntity> updateTutorial(@PathVariable Long id, @RequestBody TutorialEntity tutorialDetails) {
        try {
            TutorialEntity updatedTutorial = tutorialService.updateTutorial(id, tutorialDetails.getTutorialValue());
            return ResponseEntity.ok(updatedTutorial);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTutorial(@PathVariable Long id) {
        if (!tutorialService.getTutorialById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tutorialService.deleteTutorial(id);
        return ResponseEntity.ok().build();
    }
}
