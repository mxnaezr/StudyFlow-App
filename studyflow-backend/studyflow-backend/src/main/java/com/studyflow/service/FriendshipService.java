package com.studyflow.service;

import com.studyflow.dto.FriendUserResponse;
import com.studyflow.entity.Friendship;
import com.studyflow.entity.User;
import com.studyflow.repository.FriendshipRepository;
import com.studyflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(
            FriendshipRepository friendshipRepository,
            UserRepository userRepository
    ) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<FriendUserResponse> getFriends(String email) {
        User user = getUser(email);

        return friendshipRepository.findAcceptedForUser(user)
                .stream()
                .map(f -> f.getRequester().getId().equals(user.getId())
                        ? f.getAddressee()
                        : f.getRequester())
                .map(FriendUserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FriendUserResponse> getPendingRequests(String email) {
        User user = getUser(email);

        return friendshipRepository.findPendingRequests(user)
                .stream()
                .map(Friendship::getRequester)
                .map(FriendUserResponse::from)
                .toList();
    }

    @Transactional
    public Friendship sendRequest(String requesterEmail, Long addresseeId) {
        User requester = getUser(requesterEmail);
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (requester.getId().equals(addressee.getId())) {
            throw new RuntimeException("You cannot add yourself as a friend");
        }

        return friendshipRepository.findBetween(requester, addressee)
                .map(existing -> {
                    if (existing.getStatus() == Friendship.Status.DECLINED) {
                        existing.setRequester(requester);
                        existing.setAddressee(addressee);
                        existing.setStatus(Friendship.Status.PENDING);
                        return friendshipRepository.save(existing);
                    }
                    throw new RuntimeException("A friendship request already exists");
                })
                .orElseGet(() -> friendshipRepository.save(
                        Friendship.builder()
                                .requester(requester)
                                .addressee(addressee)
                                .status(Friendship.Status.PENDING)
                                .build()
                ));
    }

    @Transactional
    public void acceptRequest(String currentUserEmail, Long friendshipId) {
        User currentUser = getUser(currentUserEmail);
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot accept this request");
        }

        if (friendship.getStatus() != Friendship.Status.PENDING) {
            throw new RuntimeException("This request is no longer pending");
        }

        friendship.setStatus(Friendship.Status.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    @Transactional
    public void declineRequest(String currentUserEmail, Long friendshipId) {
        User currentUser = getUser(currentUserEmail);
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot decline this request");
        }

        friendship.setStatus(Friendship.Status.DECLINED);
        friendshipRepository.save(friendship);
    }

    @Transactional(readOnly = true)
    public List<FriendUserResponse> searchUsers(String currentEmail, String query) {
        String q = query == null ? "" : query.trim();
        if (q.isEmpty()) return List.of();

        User currentUser = getUser(currentEmail);

        return userRepository.findAll()
                .stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> u.getName().toLowerCase().contains(q.toLowerCase())
                        || u.getEmail().toLowerCase().contains(q.toLowerCase()))
                .limit(20)
                .map(FriendUserResponse::from)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
