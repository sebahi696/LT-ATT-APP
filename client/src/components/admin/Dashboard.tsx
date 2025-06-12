import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import api from '../../api/config';

interface DashboardStats {
  totalEmployees: number;
  todayAttendance: number;
  presentToday: number;
  absentToday: number;
}

interface AttendanceRecord {
  employeeName: string;
  status: 'present' | 'absent';
  checkInTime?: string;
  checkOutTime?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    todayAttendance: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // For now, let's get basic data from existing endpoints
        const [employeesRes] = await Promise.all([
          api.get('/api/admin/employees')
        ]);

        // Calculate basic stats from employees data
        const employees = employeesRes.data || [];
        setStats({
          totalEmployees: employees.length,
          todayAttendance: 0, // Will be implemented later
          presentToday: 0,    // Will be implemented later
          absentToday: 0,     // Will be implemented later
        });
        
        // Set empty attendance for now
        setRecentAttendance([]);
        setError('');
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setError(err.response?.data?.msg || 'Error loading dashboard data');
        }
        // Set default values to prevent map errors
        setRecentAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<PeopleIcon color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Attendance"
            value={stats.todayAttendance}
            icon={<TodayIcon color="info" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={<CheckCircleIcon color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            icon={<CancelIcon color="error" />}
            color="error"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Attendance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAttendance && recentAttendance.length > 0 ? (
                recentAttendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: record.status === 'present' ? 'success.main' : 'error.main',
                        }}
                      >
                        {record.status === 'present' ? (
                          <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
                        ) : (
                          <CancelIcon sx={{ mr: 1 }} fontSize="small" />
                        )}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Box>
                    </TableCell>
                    <TableCell>{record.checkInTime || '-'}</TableCell>
                    <TableCell>{record.checkOutTime || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No recent attendance data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard; 