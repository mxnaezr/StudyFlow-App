package com.studyflow.controller;

import com.studyflow.dto.LoginRequest;
import com.studyflow.dto.RegisterRequest;
import com.studyflow.entity.User;
import com.studyflow.repository.UserRepository;
import com.studyflow.security.JwtService;
import com.studyflow.service.EmailService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    "Email is already registered"
                            )
                    );
        }


        // Generate a 6-digit verification code
        String verificationCode =
                String.format(
                        "%06d",
                        new Random().nextInt(1000000)
                );


        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .emailVerified(false)
                .verificationCode(verificationCode)
                .verificationCodeExpiry(
                        LocalDateTime.now().plusMinutes(10)
                )
                .build();


        // Save user
        User savedUser = userRepository.save(user);


        // Send verification email
        emailService.sendVerificationCode(
                savedUser.getEmail(),
                verificationCode
        );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        Map.of(
                                "message",
                                "Registration successful. Verification code sent to your email.",

                                "userId",
                                savedUser.getId(),

                                "email",
                                savedUser.getEmail()
                        )
                );
    }


    // =========================================================
    // VERIFY EMAIL
    // =========================================================

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String email,
            @RequestParam String code
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "User not found"
                            )
                    );
        }


        if (user.isEmailVerified()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email is already verified"
                            )
                    );
        }


        // Check code
        if (
                user.getVerificationCode() == null ||
                        !user.getVerificationCode().equals(code)
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid verification code"
                            )
                    );
        }


        // Check expiry
        if (
                user.getVerificationCodeExpiry() == null ||
                        LocalDateTime.now()
                                .isAfter(user.getVerificationCodeExpiry())
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Verification code has expired"
                            )
                    );
        }


        // Verify account
        user.setEmailVerified(true);

        user.setVerificationCode(null);

        user.setVerificationCodeExpiry(null);


        userRepository.save(user);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Email verified successfully"
                )
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);


        // User does not exist
        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }


        // Email not verified
        if (!user.isEmailVerified()) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "message",
                                    "Please verify your email before logging in"
                            )
                    );
        }


        // Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        // Load user details
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        request.getEmail()
                );


        // Generate JWT
        String token =
                jwtService.generateToken(userDetails);


        // Return user information
        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",

                        "token",
                        token,

                        "user",
                        Map.of(
                                "id",
                                user.getId(),

                                "name",
                                user.getName(),

                                "email",
                                user.getEmail(),

                                "profileImage",
                                user.getProfileImage() == null
                                        ? ""
                                        : user.getProfileImage()
                        )
                )
        );
    }
}