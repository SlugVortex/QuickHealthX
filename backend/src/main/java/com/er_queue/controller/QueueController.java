// src/main/java/com/example/patientqueue/controller/QueueController.java
package com.example.patientqueue.controller;

import com.example.patientqueue.model.Patient;
import com.example.patientqueue.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class QueueController {
    private final QueueService queueService;
    
    @GetMapping
    public ResponseEntity<List<Patient>> getQueue() {
        return ResponseEntity.ok(queueService.getQueue());
    }
    
    @GetMapping("/next")
    public ResponseEntity<Patient> getNextPatient() {
        Patient patient = queueService.getNextPatient();
        if (patient == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(patient);
    }
    
    @PostMapping
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(queueService.addPatient(patient));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        patient.setId(id);
        return ResponseEntity.ok(queueService.updatePatient(patient));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePatient(@PathVariable Long id) {
        queueService.removePatient(id);
        return ResponseEntity.ok().build();
    }
}
