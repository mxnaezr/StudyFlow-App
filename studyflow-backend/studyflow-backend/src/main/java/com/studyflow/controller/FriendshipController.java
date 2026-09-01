package com.studyflow.controller;

import com.studyflow.dto.FriendUserResponse;
import com.studyflow.service.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @GetMapping
    public ResponseEntity<List<FriendUserResponse>> getFriends(Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getFriends(authentication.getName()));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendUserResponse>> getRequests(Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(authentication.getName()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FriendUserResponse>> search(
            @RequestParam String q,
            Authentication authentication
    ) {
        return ResponseEntity.ok(friendshipService.searchUsers(authentication.getName(), q));
    }

    @PostMapping("/request/{userId}")
    public ResponseEntity<?> sendRequest(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        try {
            friendshipService.sendRequest(authentication.getName(), userId);
            return ResponseEntity.ok(Map.of("message", "Friend request sent"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{friendshipId}/accept")
    public ResponseEntity<?> accept(
            @PathVariable Long friendshipId,
            Authentication authentication
    ) {
        try {
            friendshipService.acceptRequest(authentication.getName(), friendshipId);
            return ResponseEntity.ok(Map.of("message", "Friend request accepted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{friendshipId}/decline")
    public ResponseEntity<?> decline(
            @PathVariable Long friendshipId,
            Authentication authentication
    ) {
        try {
            friendshipService.declineRequest(authentication.getName(), friendshipId);
            return ResponseEntity.ok(Map.of("message", "Friend request declined"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
