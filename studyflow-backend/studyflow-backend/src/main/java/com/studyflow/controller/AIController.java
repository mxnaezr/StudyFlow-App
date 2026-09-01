package com.studyflow.controller;

import com.studyflow.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody AIRequest request) {

        return aiService.getResponse(request.message());
    }

    public record AIRequest(String message) {
    }
}