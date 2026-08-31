package com.studyflow.controller;

import com.studyflow.dto.ProfileUpdateRequest;
import com.studyflow.entity.User;
import com.studyflow.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ============================================================
    // UPDATE PROFILE
    // ============================================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Authentication authentication
    ) {

        try {

            // ====================================================
            // CHECK AUTHENTICATION
            // ====================================================

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "You must be logged in to update your profile"
                                )
                        );
            }

            // ====================================================
            // GET USER EMAIL FROM JWT
            // ====================================================

            String email = authentication.getName();

            // ====================================================
            // UPDATE USER
            // ====================================================

            User updatedUser =
                    userService.updateProfile(
                            email,
                            request
                    );

            // ====================================================
            // RETURN USER WITHOUT PASSWORD
            // ====================================================

            Map<String, Object> userResponse =
                    Map.of(
                            "id",
                            updatedUser.getId(),

                            "name",
                            updatedUser.getName(),

                            "email",
                            updatedUser.getEmail(),

                            "gender",
                            updatedUser.getGender() == null
                                    ? ""
                                    : updatedUser.getGender(),

                            "dateOfBirth",
                            updatedUser.getDateOfBirth() == null
                                    ? ""
                                    : updatedUser
                                    .getDateOfBirth()
                                    .toString(),

                            "phoneNumber",
                            updatedUser.getPhoneNumber() == null
                                    ? ""
                                    : updatedUser.getPhoneNumber(),

                            "profileImage",
                            updatedUser.getProfileImage() == null
                                    ? ""
                                    : updatedUser.getProfileImage(),

                            "emailVerified",
                            updatedUser.isEmailVerified()
                    );

            // ====================================================
            // SUCCESS
            // ====================================================

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile updated successfully",

                            "user",
                            userResponse
                    )
            );

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to update profile"
                            )
                    );
        }
    }
}