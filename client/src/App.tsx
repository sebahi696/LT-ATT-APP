import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './components/Login';
import AdminLayout from './components/admin/AdminLayout';
import ManagerLayout from './components/manager/ManagerLayout';
import EmployeeLayout from './components/employee/EmployeeLayout';
import Dashboard from './components/admin/Dashboard';
import Employees from './components/admin/Employees';
import QRGenerator from './components/admin/QRGenerator';
import AttendanceReports from './components/admin/AttendanceReports';
import SalaryReports from './components/admin/SalaryReports';
import AttendanceHistory from './components/employee/AttendanceHistory';
import QRScanner from './components/employee/QRScanner';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !user) {
        setIsAuthorized(false);
        return;
      }

      try {
        // Verify token is still valid
        await axios.get('/api/auth/user', {
          headers: { 'x-auth-token': token }
        });
        
        setIsAuthorized(user.role === allowedRole);
      } catch (err) {
        console.error('Auth error:', err);
        setIsAuthorized(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, [token, allowedRole, user]);

  if (isAuthorized === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="qr-generator" element={<QRGenerator />} />
                      <Route path="attendance-reports" element={<AttendanceReports />} />
                      <Route path="salary-reports" element={<SalaryReports />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager/*"
              element={
                <ProtectedRoute allowedRole="manager">
                  <ManagerLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="qr-generator" element={<QRGenerator />} />
                    </Routes>
                  </ManagerLayout>
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute allowedRole="employee">
                  <EmployeeLayout>
                    <Routes>
                      <Route path="attendance" element={<AttendanceHistory />} />
                      <Route path="scan" element={<QRScanner />} />
                    </Routes>
                  </EmployeeLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
