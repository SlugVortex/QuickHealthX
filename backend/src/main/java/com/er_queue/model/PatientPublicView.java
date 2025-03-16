// src/main/java/com/example/patientqueue/model/PatientPublicView.java
package com.er_queue.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientPublicView {
    private Long id;
    private String initialName; // Only first initial for privacy
    private int priorityScore;
    private LocalDateTime arrivalTime;
}
