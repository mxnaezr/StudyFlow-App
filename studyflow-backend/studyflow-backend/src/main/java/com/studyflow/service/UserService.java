package com.studyflow.service;

import com.studyflow.dto.ProfileUpdateRequest;
import com.studyflow.entity.User;
import com.studyflow.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ============================================================
    // UPDATE PROFILE
    // ============================================================

    public User updateProfile(
            String email,
            ProfileUpdateRequest request
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        // ========================================================
        // NAME
        // ========================================================

        if (request.getName() != null &&
                !request.getName().trim().isEmpty()) {

            user.setName(
                    request.getName().trim()
            );
        }

        // ========================================================
        // GENDER
        // ========================================================

        user.setGender(
                request.getGender()
        );

        // ========================================================
        // DATE OF BIRTH
        // ========================================================

        user.setDateOfBirth(
                request.getDateOfBirth()
        );

        // ========================================================
        // PHONE NUMBER
        // ========================================================

        user.setPhoneNumber(
                request.getPhoneNumber()
        );

        // ========================================================
        // PROFILE IMAGE
        // ========================================================

        user.setProfileImage(
                request.getProfileImage()
        );

        // ========================================================
        // SAVE
        // ========================================================

        return userRepository.save(user);
    }
}