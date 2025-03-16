// src/main/java/com/erqueue/repository/InMemoryPatientRepository.java
package com.er_queue.repository;

import com.er_queue.model.Patient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class InMemoryPatientRepository {
    private final Map<Long, Patient> patients = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    public Patient save(Patient patient) {
        if (patient.getId() == null) {
            // New patient
            patient.setId(idCounter.getAndIncrement());
        }
        
        // Save to in-memory map
        patients.put(patient.getId(), patient);
        return patient;
    }
    
    public void deleteById(Long id) {
        patients.remove(id);
    }
    
    public Patient findById(Long id) {
        return patients.get(id);
    }
    
    public List<Patient> findAll() {
        return new ArrayList<>(patients.values());
    }
    
    public List<Patient> findAllByOrderByPriorityScoreDescArrivalTimeAsc() {
        return patients.values().stream()
            .sorted(Comparator.comparing(Patient::getPriorityScore).reversed()
                .thenComparing(Patient::getArrivalTime))
            .collect(Collectors.toList());
    }
}
