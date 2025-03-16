// src/main/java/com/example/patientqueue/service/QueueService.java
package com.example.patientqueue.service;

import com.example.patientqueue.model.Patient;
import com.example.patientqueue.model.PatientPublicView;
import com.example.patientqueue.repository.InMemoryPatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QueueService {
    private final InMemoryPatientRepository patientRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public Patient addPatient(Patient patient) {
        patient.setArrivalTime(LocalDateTime.now());
        patient.calculatePriorityScore();
        
        Patient savedPatient = patientRepository.save(patient);
        
        // Broadcast queue updates
        broadcastQueueUpdates();
        
        return savedPatient;
    }
    
    public Patient updatePatient(Patient patient) {
        patient.calculatePriorityScore();
        Patient updatedPatient = patientRepository.save(patient);
        
        // Broadcast queue updates
        broadcastQueueUpdates();
        
        return updatedPatient;
    }
    
    public void removePatient(Long patientId) {
        patientRepository.deleteById(patientId);
        
        // Broadcast queue updates
        broadcastQueueUpdates();
    }
    
    public List<Patient> getQueue() {
        return patientRepository.findAllByOrderByPriorityScoreDescArrivalTimeAsc();
    }
    
    public Patient getNextPatient() {
        List<Patient> queue = getQueue();
        return queue.isEmpty() ? null : queue.get(0);
    }
    
    private void broadcastQueueUpdates() {
        // Send detailed update to admin dashboard
        messagingTemplate.convertAndSend("/topic/admin-queue", getQueue());
        
        // Send limited information to public dashboard
        List<PatientPublicView> publicQueue = getQueue().stream()
            .map(Patient::toPublicView)
            .collect(Collectors.toList());
        
        messagingTemplate.convertAndSend("/topic/public-queue", publicQueue);
    }
}
