// src/components/PatientDashboard.tsx
import React, { useEffect, useState } from 'react';
import { PatientPublicView } from '../types/Patient';
import { webSocketService } from '../services/WebSocketService';

const PatientDashboard: React.FC = () => {
  const [queue, setQueue] = useState<PatientPublicView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to WebSocket
    webSocketService.connect();
    webSocketService.onPublicQueueUpdate((updatedQueue) => {
      setQueue(updatedQueue);
      setLoading(false);
    });
    
    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const formatDateTime = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString();
  };

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Patient Queue Status</h2>
        </div>
        <div className="card-body">
          <div className="text-center mb-4">
            <h4>Currently Waiting: <span className="badge bg-primary">{queue.length}</span></h4>
            {queue.length > 0 && (
              <div className="alert alert-success">
                <h5>Now Serving: {queue[0].initialName}</h5>
                <p>Patient ID: {queue[0].id}</p>
              </div>
            )}
          </div>
          
          {loading ? (
            <p className="text-center">Loading queue status...</p>
          ) : queue.length === 0 ? (
            <p className="text-center">No patients in queue</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Patient</th>
                    <th>Priority</th>
                    <th>Check-in Time</th>
                    <th>Estimated Wait</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((patient, index) => (
                    <tr key={patient.id}>
                      <td>{index + 1}</td>
                      <td>{patient.initialName}</td>
                      <td>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${Math.min(100, patient.priorityScore)}%` }}
                          >
                            {patient.priorityScore}
                          </div>
                        </div>
                      </td>
                      <td>{formatDateTime(patient.arrivalTime)}</td>
                      <td>{index * 15} minutes</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Information</h4>
        </div>
        <div className="card-body">
          <p>This dashboard shows the current queue status. Patients are called in order of priority score, 
          not just arrival time. Medical conditions and severity determine the priority score.</p>
          <p>For privacy reasons, only your initial is shown on this public display.</p>
          <p>Estimated wait times are approximate and may change as new patients enter the queue.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
