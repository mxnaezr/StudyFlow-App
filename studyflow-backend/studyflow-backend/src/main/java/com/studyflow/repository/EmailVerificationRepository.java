package com.studyflow.repository;

import com.studyflow.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository
        extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification>
    findTopByEmailAndUsedFalseOrderByIdDesc(String email);

    void deleteByEmail(String email);
}