// src/main/java/com/example/patientqueue/repository/PatientRepository.java
package com.example.patientqueue.repository;

import com.example.patientqueue.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findAllByOrderByPriorityScoreDescArrivalTimeAsc();
}
