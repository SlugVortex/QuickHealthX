// src/services/QueueService.ts
import axios from 'axios';
import { Patient } from '../types/Patient';

const API_URL = 'http://localhost:8080/api/queue';

export const QueueService = {
  getQueue: async (): Promise<Patient[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  
  getNextPatient: async (): Promise<Patient | null> => {
    try {
      const response = await axios.get(`${API_URL}/next`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
  
  addPatient: async (patient: Patient): Promise<Patient> => {
    const response = await axios.post(API_URL, patient);
    return response.data;
  },
  
  updatePatient: async (patient: Patient): Promise<Patient> => {
    const response = await axios.put(`${API_URL}/${patient.id}`, patient);
    return response.data;
  },
  
  removePatient: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
