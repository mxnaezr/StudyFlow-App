package com.studyflow.repository;

import com.studyflow.entity.Friendship;
import com.studyflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("select f from Friendship f where f.requester = :user or f.addressee = :user order by f.createdAt desc")
    List<Friendship> findAllForUser(@Param("user") User user);

    @Query("select f from Friendship f where f.status = com.studyflow.entity.Friendship$Status.ACCEPTED and (f.requester = :user or f.addressee = :user)")
    List<Friendship> findAcceptedForUser(@Param("user") User user);

    @Query("select f from Friendship f where ((f.requester = :a and f.addressee = :b) or (f.requester = :b and f.addressee = :a))")
    Optional<Friendship> findBetween(@Param("a") User a, @Param("b") User b);

    @Query("select f from Friendship f where f.addressee = :user and f.status = com.studyflow.entity.Friendship$Status.PENDING order by f.createdAt desc")
    List<Friendship> findPendingRequests(@Param("user") User user);
}
