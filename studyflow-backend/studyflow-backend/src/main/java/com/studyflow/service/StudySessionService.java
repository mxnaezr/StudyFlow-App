package com.studyflow.service;

import com.studyflow.entity.StudySession;
import com.studyflow.entity.Subject;
import com.studyflow.entity.User;
import com.studyflow.repository.StudySessionRepository;
import com.studyflow.repository.SubjectRepository;
import com.studyflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public StudySessionService(
            StudySessionRepository studySessionRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    // Create study session
    public StudySession createSession(
            Long userId,
            Long subjectId,
            StudySession session
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + userId));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found with ID: " + subjectId));

        session.setUser(user);
        session.setSubject(subject);

        return studySessionRepository.save(session);
    }

    // Get session by ID
    public StudySession getSessionById(Long id) {

        return studySessionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Study session not found with ID: " + id
                        ));
    }

    // Get all sessions for a user
    public List<StudySession> getSessionsByUser(Long userId) {

        return studySessionRepository.findByUserId(userId);
    }

    // Get all sessions for a subject
    public List<StudySession> getSessionsBySubject(Long subjectId) {

        return studySessionRepository.findBySubjectId(subjectId);
    }

    // Update session
    public StudySession updateSession(
            Long id,
            StudySession updatedSession
    ) {

        StudySession existingSession = getSessionById(id);

        existingSession.setStartTime(updatedSession.getStartTime());
        existingSession.setEndTime(updatedSession.getEndTime());
        existingSession.setDurationMinutes(
                updatedSession.getDurationMinutes()
        );
        existingSession.setNotes(updatedSession.getNotes());

        return studySessionRepository.save(existingSession);
    }

    // Delete session
    public void deleteSession(Long id) {

        StudySession session = getSessionById(id);

        studySessionRepository.delete(session);
    }
}