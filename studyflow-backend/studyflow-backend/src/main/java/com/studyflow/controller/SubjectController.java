package com.studyflow.controller;

import com.studyflow.entity.Subject;
import com.studyflow.service.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // CREATE SUBJECT
    @PostMapping("/user/{userId}")
    public ResponseEntity<Subject> createSubject(
            @PathVariable Long userId,
            @RequestBody Subject subject
    ) {

        Subject createdSubject =
                subjectService.createSubject(userId, subject);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSubject);
    }

    // GET SUBJECT
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubject(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                subjectService.getSubjectById(id)
        );
    }

    // GET ALL SUBJECTS FOR USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subject>> getUserSubjects(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                subjectService.getSubjectsByUser(userId)
        );
    }

    // UPDATE SUBJECT
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject
    ) {

        return ResponseEntity.ok(
                subjectService.updateSubject(id, subject)
        );
    }

    // DELETE SUBJECT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long id
    ) {

        subjectService.deleteSubject(id);

        return ResponseEntity.noContent().build();
    }
}