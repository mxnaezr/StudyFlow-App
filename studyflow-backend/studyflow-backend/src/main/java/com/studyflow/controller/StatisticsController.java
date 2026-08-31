package com.studyflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @GetMapping
    public ResponseEntity<?> getStatistics() {

        /*
         * Temporary statistics response.
         *
         * We will connect this to the database
         * once the StudySession repository/service
         * is completed.
         */

        Map<String, Object> statistics = Map.of(
                "totalStudySessions", 0,
                "totalStudyMinutes", 0,
                "completedTasks", 0,
                "currentStreak", 0
        );

        return ResponseEntity.ok(statistics);
    }
}