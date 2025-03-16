// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Patient } from '../types/Patient';
import { QueueService } from '../services/QueueService';
import { webSocketService } from '../services/WebSocketService';

const AdminDashboard: React.FC = () => {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of queue
    const fetchQueue = async () => {
      try {
        const data = await QueueService.getQueue();
        setQueue(data);
      } catch (error) {
        console.error('Error fetching queue:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueue();
    
    // Connect to WebSocket
    webSocketService.connect();
    webSocketService.onAdminQueueUpdate((updatedQueue) => {
      setQueue(updatedQueue);
    });
    
    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const handleCompletePatient = async (id: number | undefined) => {
    if (!id) return;
    
    if (window.confirm('Mark this patient as completed? This will remove them from the queue.')) {
      try {
        await QueueService.removePatient(id);
        // The WebSocket will update the queue automatically
      } catch (error) {
        console.error('Error removing patient:', error);
        alert('Failed to remove patient');
      }
    }
  };

  const formatDateTime = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const getPriorityClass = (score: number | undefined) => {
    if (!score) return '';
    if (score >= 60) return 'table-danger';
    if (score >= 30) return 'table-warning';
    return 'table-info';
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Next Patient</h4>
        </div>
        <div className="card-body">
          {queue.length > 0 ? (
            <div className="row">
              <div className="col-md-6">
                <h5>{queue[0].name}</h5>
                <p>
                  <strong>Age:</strong> {queue[0].age} |
                  <strong> Gender:</strong> {queue[0].gender} |
                  <strong> Priority Score:</strong> <span className="badge bg-warning">{queue[0].priorityScore}</span>
                </p>
                <p><strong>Chief Complaint:</strong> {queue[0].chiefComplaint}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Medical Conditions:</strong> {queue[0].existingConditions || 'None'}</p>
                <p><strong>Medications:</strong> {queue[0].medications || 'None'}</p>
                <p><strong>Arrival Time:</strong> {formatDateTime(queue[0].arrivalTime)}</p>
                <button 
                  className="btn btn-success" 
                  onClick={() => handleCompletePatient(queue[0].id)}
                >
                  Complete Patient Visit
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center">No patients in queue</p>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h4 className="mb-0">Patient Queue</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : queue.length === 0 ? (
            <p className="text-center">No patients in queue</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Chief Complaint</th>
                    <th>Priority Score</th>
                    <th>Medical Flags</th>
                    <th>Arrival Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((patient, index) => (
                    <tr key={patient.id} className={getPriorityClass(patient.priorityScore)}>
                      <td>{index + 1}</td>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.chiefComplaint}</td>
                      <td><span className="badge bg-primary">{patient.priorityScore}</span></td>
                      <td>
                        {patient.hasFever && <span className="badge bg-danger me-1">Fever</span>}
                        {patient.hasBreathingDifficulty && <span className="badge bg-danger me-1">Breathing</span>}
                        {patient.hasBleedingInjury && <span className="badge bg-danger me-1">Bleeding</span>}
                      </td>
                      <td>{formatDateTime(patient.arrivalTime)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-success" 
                          onClick={() => handleCompletePatient(patient.id)}
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
