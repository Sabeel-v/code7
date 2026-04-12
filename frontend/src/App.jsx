import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import HRM from './pages/HRM';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <ProtectedRoute allowedRoles={['Admin', 'Sales_Manager', 'Sales_Executive', 'HR_Executive', 'Employee']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="leads" element={
              <ProtectedRoute allowedRoles={['Admin', 'Sales_Manager', 'Sales_Executive']}>
                <Leads />
              </ProtectedRoute>
            } />
            
            <Route path="hrm" element={
              <ProtectedRoute allowedRoles={['Admin', 'HR_Executive']}>
                <HRM />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
