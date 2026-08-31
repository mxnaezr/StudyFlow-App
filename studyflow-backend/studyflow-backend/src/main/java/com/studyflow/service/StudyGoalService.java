package com.studyflow.service;

import com.studyflow.entity.StudyGoal;
import com.studyflow.entity.Subject;
import com.studyflow.entity.User;
import com.studyflow.repository.StudyGoalRepository;
import com.studyflow.repository.SubjectRepository;
import com.studyflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyGoalService {

    private final StudyGoalRepository studyGoalRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public StudyGoalService(
            StudyGoalRepository studyGoalRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository
    ) {
        this.studyGoalRepository = studyGoalRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    // Create goal
    public StudyGoal createGoal(
            Long userId,
            Long subjectId,
            StudyGoal goal
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + userId));

        goal.setUser(user);

        if (subjectId != null) {

            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Subject not found with ID: " + subjectId
                            ));

            goal.setSubject(subject);
        }

        return studyGoalRepository.save(goal);
    }

    // Get goal by ID
    public StudyGoal getGoalById(Long id) {

        return studyGoalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Study goal not found with ID: " + id
                        ));
    }

    // Get all goals for user
    public List<StudyGoal> getGoalsByUser(Long userId) {

        return studyGoalRepository.findByUserId(userId);
    }

    // Get goals for subject
    public List<StudyGoal> getGoalsBySubject(Long subjectId) {

        return studyGoalRepository.findBySubjectId(subjectId);
    }

    // Update goal
    public StudyGoal updateGoal(
            Long id,
            StudyGoal updatedGoal
    ) {

        StudyGoal existingGoal = getGoalById(id);

        existingGoal.setTitle(updatedGoal.getTitle());
        existingGoal.setTargetMinutes(
                updatedGoal.getTargetMinutes()
        );
        existingGoal.setCurrentMinutes(
                updatedGoal.getCurrentMinutes()
        );
        existingGoal.setStartDate(
                updatedGoal.getStartDate()
        );
        existingGoal.setEndDate(
                updatedGoal.getEndDate()
        );
        existingGoal.setCompleted(
                updatedGoal.getCompleted()
        );

        return studyGoalRepository.save(existingGoal);
    }

    // Delete goal
    public void deleteGoal(Long id) {

        StudyGoal goal = getGoalById(id);

        studyGoalRepository.delete(goal);
    }
}