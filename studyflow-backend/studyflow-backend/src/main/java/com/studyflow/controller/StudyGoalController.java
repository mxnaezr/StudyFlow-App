package com.studyflow.controller;

import com.studyflow.entity.StudyGoal;
import com.studyflow.service.StudyGoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-goals")
@CrossOrigin(origins = "*")
public class StudyGoalController {

    private final StudyGoalService studyGoalService;

    public StudyGoalController(
            StudyGoalService studyGoalService
    ) {
        this.studyGoalService = studyGoalService;
    }

    // CREATE GOAL
    @PostMapping("/user/{userId}")
    public ResponseEntity<StudyGoal> createGoal(
            @PathVariable Long userId,
            @RequestParam(required = false) Long subjectId,
            @RequestBody StudyGoal goal
    ) {

        StudyGoal createdGoal =
                studyGoalService.createGoal(
                        userId,
                        subjectId,
                        goal
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdGoal);
    }

    // GET GOAL
    @GetMapping("/{id}")
    public ResponseEntity<StudyGoal> getGoal(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                studyGoalService.getGoalById(id)
        );
    }

    // GET USER'S GOALS
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudyGoal>> getUserGoals(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                studyGoalService.getGoalsByUser(userId)
        );
    }

    // GET SUBJECT'S GOALS
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<StudyGoal>> getSubjectGoals(
            @PathVariable Long subjectId
    ) {

        return ResponseEntity.ok(
                studyGoalService.getGoalsBySubject(subjectId)
        );
    }

    // UPDATE GOAL
    @PutMapping("/{id}")
    public ResponseEntity<StudyGoal> updateGoal(
            @PathVariable Long id,
            @RequestBody StudyGoal goal
    ) {

        return ResponseEntity.ok(
                studyGoalService.updateGoal(id, goal)
        );
    }

    // DELETE GOAL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id
    ) {

        studyGoalService.deleteGoal(id);

        return ResponseEntity.noContent().build();
    }
}