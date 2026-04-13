import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import HRM from './pages/HRM';
import EmployeePortal from './pages/EmployeePortal';
import Customers from './pages/Customers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <ProtectedRoute allowedRoles={['Admin', 'Sales Manager', 'Sales Executive', 'HR Executive', 'Employee']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="leads" element={
              <ProtectedRoute allowedRoles={['Admin', 'Sales Manager', 'Sales Executive']}>
                <Leads />
              </ProtectedRoute>
            } />

            <Route path="customers" element={
              <ProtectedRoute allowedRoles={['Admin', 'Sales Manager', 'Sales Executive']}>
                <Customers />
              </ProtectedRoute>
            } />
            
            <Route path="hrm" element={
              <ProtectedRoute allowedRoles={['Admin', 'HR Executive']}>
                <HRM />
              </ProtectedRoute>
            } />

            <Route path="my-portal" element={
              <ProtectedRoute allowedRoles={['Admin', 'HR Executive', 'Sales Manager', 'Sales Executive', 'Employee']}>
                <EmployeePortal />
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
