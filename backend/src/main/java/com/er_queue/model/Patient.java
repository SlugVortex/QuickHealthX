// src/main/java/com/example/patientqueue/model/Patient.java
package com.example.patientqueue.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    private Long id;
    private String name;
    private int age;
    private String gender;
    private String contactNumber;
    
    // Medical details
    private String chiefComplaint;
    private int painLevel; // 0-10
    private boolean hasFever;
    private boolean hasBreathingDifficulty;
    private boolean hasBleedingInjury;
    private String allergies;
    private String existingConditions;
    private String medications;
    
    // Priority calculation fields
    private int priorityScore;
    private LocalDateTime arrivalTime;
    private LocalDateTime lastUpdated;
    
    // Calculate priority score based on patient details
    public void calculatePriorityScore() {
        int score = 0;
        
        // Base priority based on pain level
        score += painLevel * 5;
        
        // Additional points for critical conditions
        if (hasBreathingDifficulty) score += 30;
        if (hasBleedingInjury) score += 25;
        if (hasFever) score += 15;
        
        // Age factors - very young and very old get higher priority
        if (age < 5 || age > 70) score += 15;
        
        // Update the priority score
        this.priorityScore = score;
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Method to create a limited view for public display
    public PatientPublicView toPublicView() {
        return new PatientPublicView(
            id,
            name.substring(0, 1) + ".", // First initial only for privacy
            priorityScore,
            arrivalTime
        );
    }
}
