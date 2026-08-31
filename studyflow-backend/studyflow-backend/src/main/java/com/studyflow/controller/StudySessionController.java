package com.studyflow.controller;

import com.studyflow.entity.StudySession;
import com.studyflow.service.StudySessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
@CrossOrigin(origins = "*")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(
            StudySessionService studySessionService
    ) {
        this.studySessionService = studySessionService;
    }

    // CREATE STUDY SESSION
    @PostMapping("/user/{userId}/subject/{subjectId}")
    public ResponseEntity<StudySession> createSession(
            @PathVariable Long userId,
            @PathVariable Long subjectId,
            @RequestBody StudySession session
    ) {

        StudySession createdSession =
                studySessionService.createSession(
                        userId,
                        subjectId,
                        session
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSession);
    }

    // GET SESSION
    @GetMapping("/{id}")
    public ResponseEntity<StudySession> getSession(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                studySessionService.getSessionById(id)
        );
    }

    // GET USER'S STUDY SESSIONS
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudySession>> getUserSessions(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                studySessionService.getSessionsByUser(userId)
        );
    }

    // GET SUBJECT'S STUDY SESSIONS
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<StudySession>> getSubjectSessions(
            @PathVariable Long subjectId
    ) {

        return ResponseEntity.ok(
                studySessionService.getSessionsBySubject(subjectId)
        );
    }

    // UPDATE SESSION
    @PutMapping("/{id}")
    public ResponseEntity<StudySession> updateSession(
            @PathVariable Long id,
            @RequestBody StudySession session
    ) {

        return ResponseEntity.ok(
                studySessionService.updateSession(id, session)
        );
    }

    // DELETE SESSION
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long id
    ) {

        studySessionService.deleteSession(id);

        return ResponseEntity.noContent().build();
    }
}