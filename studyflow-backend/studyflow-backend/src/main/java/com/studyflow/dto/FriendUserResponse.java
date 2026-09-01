package com.studyflow.dto;

import com.studyflow.entity.User;

public record FriendUserResponse(
        Long id,
        String name,
        String email,
        String profileImage
) {
    public static FriendUserResponse from(User user) {
        return new FriendUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfileImage()
        );
    }
}
