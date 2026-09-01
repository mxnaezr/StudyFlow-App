package com.studyflow.dto;

public class AIChatResponse {

    private String message;

    public AIChatResponse() {
    }

    public AIChatResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}