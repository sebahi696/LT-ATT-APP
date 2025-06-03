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
import axios from 'axios';

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
          return;
        }

        const config = {
          headers: { 'x-auth-token': token }
        };

        const [statsRes, attendanceRes] = await Promise.all([
          axios.get('/api/admin/dashboard/stats', config),
          axios.get('/api/admin/dashboard/recent-attendance', config),
        ]);

        setStats(statsRes.data);
        setRecentAttendance(attendanceRes.data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.msg || 'Error loading dashboard data');
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
              {recentAttendance.map((record, index) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard; 