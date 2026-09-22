package com.studyflow.service;

import com.studyflow.entity.StudyCallLog;
import com.studyflow.entity.User;
import com.studyflow.repository.StudyCallLogRepository;
import com.studyflow.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudyCallService {

    private final StudyCallLogRepository callLogRepository;
    private final UserRepository userRepository;

    @Value("${livekit.url:}")
    private String livekitUrl;

    @Value("${livekit.api.key:}")
    private String livekitApiKey;

    @Value("${livekit.api.secret:}")
    private String livekitApiSecret;

    public StudyCallService(
            StudyCallLogRepository callLogRepository,
            UserRepository userRepository
    ) {
        this.callLogRepository = callLogRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> startCall(String email, String roomCode) {
        validateConfiguration();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String normalizedRoom = normalizeRoom(roomCode);
        String identity = "sf-user-" + user.getId();
        String roomName = "studyflow-" + normalizedRoom;

        StudyCallLog log = callLogRepository.save(
                StudyCallLog.builder()
                        .user(user)
                        .roomCode(normalizedRoom)
                        .joinedAt(LocalDateTime.now())
                        .callType("GROUP")
                        .build()
        );

        return Map.of(
                "logId", log.getId(),
                "serverUrl", livekitUrl,
                "roomName", roomName,
                "participantToken", createToken(identity, roomName, user.getName())
        );
    }

    public void endCall(String email, Long logId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        StudyCallLog log = callLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Call log not found."));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You cannot update this call log.");
        }

        if (log.getLeftAt() == null) {
            LocalDateTime leftAt = LocalDateTime.now();
            log.setLeftAt(leftAt);
            long seconds = Math.max(
                    0,
                    java.time.Duration.between(log.getJoinedAt(), leftAt).getSeconds()
            );
            log.setDurationSeconds(seconds);
            callLogRepository.save(log);
        }
    }

    public List<StudyCallLog> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return callLogRepository.findTop50ByUserOrderByJoinedAtDesc(user);
    }

    private String createToken(String identity, String roomName, String participantName) {
        SecretKey key = Keys.hmacShaKeyFor(
                livekitApiSecret.getBytes(StandardCharsets.UTF_8)
        );

        Date now = new Date();
        Date expiry = new Date(now.getTime() + 60 * 60 * 1000L);

        Map<String, Object> videoGrant = new HashMap<>();
        videoGrant.put("roomJoin", true);
        videoGrant.put("room", roomName);
        videoGrant.put("canPublish", true);
        videoGrant.put("canSubscribe", true);
        videoGrant.put("canPublishData", true);

        return Jwts.builder()
                .issuer(livekitApiKey)
                .subject(identity)
                .issuedAt(now)
                .expiration(expiry)
                .claim("video", videoGrant)
                .claim("name", participantName == null ? identity : participantName)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    private String normalizeRoom(String roomCode) {
        if (roomCode == null || roomCode.isBlank()) {
            throw new IllegalArgumentException("Study room code is required.");
        }

        String normalized = roomCode.trim().replaceAll("[^A-Za-z0-9_-]", "");
        if (normalized.isBlank() || normalized.length() > 60) {
            throw new IllegalArgumentException("Invalid study room code.");
        }
        return normalized;
    }

    private void validateConfiguration() {
        if (livekitUrl.isBlank() || livekitApiKey.isBlank() || livekitApiSecret.isBlank()) {
            throw new IllegalStateException(
                    "LiveKit is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET."
            );
        }
    }
}
