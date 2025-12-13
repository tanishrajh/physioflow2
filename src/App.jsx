import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PTDashboardPage from './pages/PTDashboardPage';
import PhysioLayout from './components/PhysioLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white' }}>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" />;

  // Role Check
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their appropriate dashboard
    return <Navigate to={user.role === 'physio' ? '/pt-dashboard' : '/dashboard'} />;
  }

  return children;
};

// Wrapper to pass prescribed exercise
const SessionWrapper = () => {
  const { user } = useAuth();
  // Default to bicepCurl if not defined
  const exercise = user?.report?.prescribedExercise || 'bicepCurl';
  return <PhysioLayout exercise={exercise} />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="patient">
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/session" element={
            <ProtectedRoute allowedRole="patient">
              <SessionWrapper />
            </ProtectedRoute>
          } />

          {/* PT Routes */}
          <Route path="/pt-dashboard" element={
            <ProtectedRoute allowedRole="physio">
              <PTDashboardPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
