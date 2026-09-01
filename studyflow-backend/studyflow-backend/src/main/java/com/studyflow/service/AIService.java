package com.studyflow.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.7-flash}")
    private String model;

    public AIService(ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }

    public String getResponse(String userMessage) {

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Please enter a question.";
        }

        try {

            // =====================================================
            // SYSTEM INSTRUCTION
            // =====================================================

            String systemInstruction = """
                    You are StudyFlow AI, an educational study assistant.

                    Your job is to answer the student's actual question.

                    Help students:
                    - understand academic concepts
                    - solve problems
                    - create study plans
                    - explain difficult topics
                    - generate practice questions
                    - improve study habits

                    Give the actual answer to the student's question.
                    Do NOT repeat or paraphrase the student's question.

                    Keep explanations clear, friendly and appropriate
                    for students.

                    If a question requires calculations, show the steps
                    when useful.

                    Do not pretend to know information that you do not know.
                    """;

            // =====================================================
            // REQUEST BODY
            // Gemini uses:
            //
            // contents
            //   -> parts
            //       -> text
            // =====================================================

            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> systemInstructionBody = new HashMap<>();

            systemInstructionBody.put(
                    "parts",
                    List.of(
                            Map.of(
                                    "text",
                                    systemInstruction
                            )
                    )
            );

            requestBody.put(
                    "systemInstruction",
                    systemInstructionBody
            );

            Map<String, Object> userContent = new HashMap<>();

            userContent.put(
                    "parts",
                    List.of(
                            Map.of(
                                    "text",
                                    userMessage.trim()
                            )
                    )
            );

            requestBody.put(
                    "contents",
                    List.of(userContent)
            );

            // =====================================================
            // SEND REQUEST TO GEMINI
            // =====================================================

            String response = restClient.post()
                    .uri("/{model}:generateContent", model)
                    .header(
                            "x-goog-api-key",
                            apiKey
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            MediaType.APPLICATION_JSON_VALUE
                    )
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            System.out.println("========== GEMINI RESPONSE ==========");
            System.out.println(response);
            System.out.println("=====================================");

            if (response == null || response.isBlank()) {
                return "The AI returned an empty response.";
            }

            // =====================================================
            // PARSE GEMINI RESPONSE
            //
            // candidates
            //    -> content
            //       -> parts
            //          -> text
            // =====================================================

            JsonNode root = objectMapper.readTree(response);

            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && !candidates.isEmpty()) {

                JsonNode content =
                        candidates.get(0).path("content");

                JsonNode parts =
                        content.path("parts");

                if (parts.isArray()) {

                    for (JsonNode part : parts) {

                        JsonNode text =
                                part.path("text");

                        if (!text.isMissingNode()
                                && !text.asText().isBlank()) {

                            return text.asText();
                        }
                    }
                }
            }

            // =====================================================
            // CHECK FOR GEMINI ERROR
            // =====================================================

            JsonNode error = root.path("error");

            if (!error.isMissingNode()) {

                String message =
                        error.path("message").asText();

                System.err.println(
                        "Gemini API Error: " + message
                );

                return "Gemini API error: " + message;
            }

            System.err.println(
                    "Could not find AI text in response: "
                            + response
            );

            return "The AI responded, but I couldn't read the response.";

        } catch (Exception e) {

            System.err.println(
                    "============== GEMINI ERROR =============="
            );

            System.err.println(
                    "Message: " + e.getMessage()
            );

            e.printStackTrace();

            System.err.println(
                    "=========================================="
            );

            return "AI connection error: " + e.getMessage();
        }
    }
}