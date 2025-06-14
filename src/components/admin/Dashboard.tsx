import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { PeopleAlt, AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import { dashboardService } from '../../services/api';
import { ERROR_MESSAGES } from '../../config';
import type { DashboardStats, AttendanceRecord } from '../../types';

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
        setLoading(true);
        setError('');

        // Fetch stats and attendance data in parallel
        const [statsResponse, attendanceResponse] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentAttendance()
        ]);

        // Ensure stats data is valid
        if (!statsResponse || typeof statsResponse !== 'object') {
          throw new Error('Invalid stats data received');
        }

        // Ensure attendance data is an array
        const validAttendanceData = Array.isArray(attendanceResponse) ? attendanceResponse : [];

        // Update state with validated data
        setStats({
          totalEmployees: statsResponse.totalEmployees || 0,
          todayAttendance: statsResponse.todayAttendance || 0,
          presentToday: statsResponse.presentToday || 0,
          absentToday: statsResponse.absentToday || 0,
        });
        setRecentAttendance(validAttendanceData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || ERROR_MESSAGES.DEFAULT);
        // Set default values in case of error
        setStats({
          totalEmployees: 0,
          todayAttendance: 0,
          presentToday: 0,
          absentToday: 0,
        });
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3, mb: 4 }}>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<PeopleAlt color="primary" />}
          color="primary"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon={<AccessTime color="info" />}
          color="info"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={<CheckCircle color="success" />}
          color="success"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={<Cancel color="error" />}
          color="error"
        />
      </Box>

      <Typography variant="h5" component="h2" gutterBottom>
        Recent Attendance
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 2 }}>
        {Array.isArray(recentAttendance) && recentAttendance.length > 0 ? (
          recentAttendance.map((record) => (
            <Card key={record._id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    {record.employee?.name || 'Unknown Employee'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(record.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Department: {record.employee?.department || 'Unknown Department'}
                </Typography>
                <Typography variant="body2" color={record.type === 'checkIn' ? 'success.main' : 'error.main'}>
                  {record.type === 'checkIn' ? 'Checked In' : 'Checked Out'}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert severity="info">No recent attendance records found</Alert>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 