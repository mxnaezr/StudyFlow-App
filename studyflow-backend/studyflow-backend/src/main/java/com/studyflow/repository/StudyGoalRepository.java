package com.studyflow.repository;

import com.studyflow.entity.StudyGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyGoalRepository extends JpaRepository<StudyGoal, Long> {

    List<StudyGoal> findByUserId(Long userId);

    List<StudyGoal> findBySubjectId(Long subjectId);
}