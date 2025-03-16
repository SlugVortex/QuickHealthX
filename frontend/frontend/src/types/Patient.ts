// src/types/Patient.ts
export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: string;
  contactNumber: string;
  
  // Medical details
  chiefComplaint: string;
  painLevel: number; // 0-10
  hasFever: boolean;
  hasBreathingDifficulty: boolean;
  hasBleedingInjury: boolean;
  allergies: string;
  existingConditions: string;
  medications: string;
  
  // Auto-generated fields
  priorityScore?: number;
  arrivalTime?: string;
  lastUpdated?: string;
}

export interface PatientPublicView {
  id: number;
  initialName: string;
  priorityScore: number;
  arrivalTime: string;
}
