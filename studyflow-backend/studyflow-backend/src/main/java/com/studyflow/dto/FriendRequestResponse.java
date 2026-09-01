package com.studyflow.dto;

import com.studyflow.entity.Friendship;

public record FriendRequestResponse(
        Long friendshipId,
        FriendUserResponse user
) {
    public static FriendRequestResponse from(Friendship friendship) {
        return new FriendRequestResponse(
                friendship.getId(),
                FriendUserResponse.from(friendship.getRequester())
        );
    }
}
