package com.studyflow.controller;

import com.studyflow.dto.StudyRoomMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StudyRoomWebSocketController {

    @MessageMapping("/room/message")
    @SendTo("/topic/room")
    public StudyRoomMessage sendMessage(StudyRoomMessage message) {

        return message;
    }
}