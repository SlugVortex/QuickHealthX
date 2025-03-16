// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientForm from './components/PatientForm';
import AdminDashboard from './components/AdminDashboard';
import PatientDashboard from './components/PatientDashboard';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/patient-form" element={<PatientForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/" element={<Navigate to="/patient-form" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
