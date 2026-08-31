package com.studyflow.service;

import com.studyflow.entity.Subject;
import com.studyflow.entity.User;
import com.studyflow.repository.SubjectRepository;
import com.studyflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public SubjectService(
            SubjectRepository subjectRepository,
            UserRepository userRepository
    ) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    // Create subject for a user
    public Subject createSubject(Long userId, Subject subject) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + userId));

        subject.setUser(user);

        return subjectRepository.save(subject);
    }

    // Get subject by ID
    public Subject getSubjectById(Long id) {

        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found with ID: " + id));
    }

    // Get all subjects belonging to a user
    public List<Subject> getSubjectsByUser(Long userId) {

        return subjectRepository.findByUserId(userId);
    }

    // Update subject
    public Subject updateSubject(Long id, Subject updatedSubject) {

        Subject existingSubject = getSubjectById(id);

        existingSubject.setName(updatedSubject.getName());
        existingSubject.setDescription(updatedSubject.getDescription());
        existingSubject.setColor(updatedSubject.getColor());

        return subjectRepository.save(existingSubject);
    }

    // Delete subject
    public void deleteSubject(Long id) {

        Subject subject = getSubjectById(id);

        subjectRepository.delete(subject);
    }
}