import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkIn?: {
    time: string;
  };
  checkOut?: {
    time: string;
  };
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendancePercentage: number;
}

const AttendanceHistory: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const response = await axios.get('/api/employee/attendance', {
          headers: { 'x-auth-token': token }
        });

        setRecords(response.data.records);
        setSummary(response.data.summary);
        setError('');
      } catch (err: any) {
        console.error('Error fetching attendance:', err);
        setError(err.response?.data?.msg || 'Error fetching attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Attendance History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Days
                </Typography>
                <Typography variant="h4">
                  {summary.totalDays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Present Days
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.presentDays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Late Days
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.lateDays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Attendance Rate
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.attendancePercentage.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {record.status === 'present' ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : record.status === 'late' ? (
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                    )}
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Box>
                </TableCell>
                <TableCell>
                  {record.checkIn?.time
                    ? new Date(record.checkIn.time).toLocaleTimeString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {record.checkOut?.time
                    ? new Date(record.checkOut.time).toLocaleTimeString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceHistory; 