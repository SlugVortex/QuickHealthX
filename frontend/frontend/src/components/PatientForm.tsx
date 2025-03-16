// src/components/PatientForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types/Patient';
import { QueueService } from '../services/QueueService';

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Patient>({
    name: '',
    age: 0,
    gender: 'Male',
    contactNumber: '',
    chiefComplaint: '',
    painLevel: 0,
    hasFever: false,
    hasBreathingDifficulty: false,
    hasBleedingInjury: false,
    allergies: '',
    existingConditions: '',
    medications: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await QueueService.addPatient(formData);
      alert('Patient added to queue successfully!');
      // Reset form
      setFormData({
        name: '',
        age: 0,
        gender: 'Male',
        contactNumber: '',
        chiefComplaint: '',
        painLevel: 0,
        hasFever: false,
        hasBreathingDifficulty: false,
        hasBleedingInjury: false,
        allergies: '',
        existingConditions: '',
        medications: ''
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient to queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Patient Registration</h2>
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-primary me-2" 
          onClick={() => navigate('/admin-dashboard')}
        >
          View Admin Dashboard
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/patient-dashboard')}
        >
          View Patient Dashboard
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h4>Patient Information</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mt-4">
          <div className="card-header">
            <h4>Medical Information</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label">Chief Complaint</label>
                <textarea
                  className="form-control"
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleChange}
                  rows={3}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Pain Level (0-10)</label>
                <div className="d-flex align-items-center">
                  <input
                    type="range"
                    className="form-range me-2"
                    name="painLevel"
                    min="0"
                    max="10"
                    value={formData.painLevel}
                    onChange={handleChange}
                  />
                  <span className="fw-bold">{formData.painLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="hasFever"
                    name="hasFever"
                    checked={formData.hasFever}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="hasFever">Has Fever</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="hasBreathingDifficulty"
                    name="hasBreathingDifficulty"
                    checked={formData.hasBreathingDifficulty}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="hasBreathingDifficulty">Has Breathing Difficulty</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="hasBleedingInjury"
                    name="hasBleedingInjury"
                    checked={formData.hasBleedingInjury}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="hasBleedingInjury">Has Bleeding Injury</label>
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Allergies</label>
                <input
                  type="text"
                  className="form-control"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies or write 'None'"
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Existing Medical Conditions</label>
                <textarea
                  className="form-control"
                  name="existingConditions"
                  value={formData.existingConditions}
                  onChange={handleChange}
                  rows={2}
                  placeholder="List any existing conditions or write 'None'"
                ></textarea>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Current Medications</label>
                <textarea
                  className="form-control"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows={2}
                  placeholder="List any current medications or write 'None'"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 d-flex justify-content-center">
          <button type="submit" className="btn btn-lg btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
