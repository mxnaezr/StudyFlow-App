package com.studyflow.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String email, String code) {

        SimpleMailMessage message = new SimpleMailMessage();

        // The user's email
        message.setTo(email);

        // The StudyFlow sender
        message.setFrom("studyflow.service@gmail.com");

        message.setSubject("StudyFlow - Verify Your Email");

        message.setText(
                "Welcome to StudyFlow!\n\n" +

                        "Thank you for creating your StudyFlow account.\n\n" +

                        "Your verification code is:\n\n" +

                        "        " + code + "\n\n" +

                        "This verification code will expire in 10 minutes.\n\n" +

                        "Please enter this code in the StudyFlow app to verify your email address.\n\n" +

                        "If you did not create a StudyFlow account, you can safely ignore this email.\n\n" +

                        "--------------------------------------------------\n" +

                        "StudyFlow\n" +
                        "Build better study habits."
        );

        mailSender.send(message);
    }
}