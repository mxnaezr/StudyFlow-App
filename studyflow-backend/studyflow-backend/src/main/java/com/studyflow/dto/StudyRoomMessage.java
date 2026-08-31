package com.studyflow.dto;

public class StudyRoomMessage {

    private String roomCode;
    private String sender;
    private String message;

    public StudyRoomMessage() {
    }

    public StudyRoomMessage(String roomCode, String sender, String message) {
        this.roomCode = roomCode;
        this.sender = sender;
        this.message = message;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}