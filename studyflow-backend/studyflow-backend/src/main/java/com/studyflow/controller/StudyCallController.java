package com.studyflow.controller;

import com.studyflow.entity.StudyCallLog;
import com.studyflow.service.StudyCallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-calls")
public class StudyCallController {

    private final StudyCallService studyCallService;

    public StudyCallController(StudyCallService studyCallService) {
        this.studyCallService = studyCallService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> start(
            Principal principal,
            @RequestBody StartCallRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    studyCallService.startCall(principal.getName(), request.roomCode())
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{logId}/end")
    public ResponseEntity<?> end(
            Principal principal,
            @PathVariable Long logId
    ) {
        try {
            studyCallService.endCall(principal.getName(), logId);
            return ResponseEntity.ok(Map.of("message", "Call log updated."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<StudyCallLog>> history(Principal principal) {
        return ResponseEntity.ok(studyCallService.getHistory(principal.getName()));
    }

    public record StartCallRequest(String roomCode) {}
}
