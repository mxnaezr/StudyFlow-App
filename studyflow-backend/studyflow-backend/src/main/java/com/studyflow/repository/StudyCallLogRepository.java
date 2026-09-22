package com.studyflow.repository;

import com.studyflow.entity.StudyCallLog;
import com.studyflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyCallLogRepository extends JpaRepository<StudyCallLog, Long> {
    List<StudyCallLog> findTop50ByUserOrderByJoinedAtDesc(User user);
}
