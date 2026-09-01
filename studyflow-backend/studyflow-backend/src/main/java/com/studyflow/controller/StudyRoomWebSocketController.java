package com.studyflow.controller;

import com.studyflow.dto.StudyRoomMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class StudyRoomWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public StudyRoomWebSocketController(
            SimpMessagingTemplate messagingTemplate
    ) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/room/message")
    public void sendMessage(StudyRoomMessage message) {
        if (message == null || message.getRoomCode() == null || message.getRoomCode().isBlank()) {
            return;
        }

        String destination = "/topic/room/" + message.getRoomCode();
        messagingTemplate.convertAndSend(destination, message);
    }
}
