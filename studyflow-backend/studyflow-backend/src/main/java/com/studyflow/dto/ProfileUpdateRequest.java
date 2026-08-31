package com.studyflow.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class ProfileUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String gender;

    private LocalDate dateOfBirth;

    private String phoneNumber;

    private String profileImage;

    // ============================================================
    // GETTERS
    // ============================================================

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getProfileImage() {
        return profileImage;
    }

    // ============================================================
    // SETTERS
    // ============================================================

    public void setName(String name) {
        this.name = name;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}