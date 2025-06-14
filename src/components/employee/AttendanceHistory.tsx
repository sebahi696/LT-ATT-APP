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
import { attendanceService } from '../../services/api';
import { ERROR_MESSAGES } from '../../config';
import type { Attendance } from '../../types';

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendancePercentage: number;
}

const AttendanceHistory: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceData = await attendanceService.getAll();
        
        // Process attendance data
        const processedRecords = attendanceData.map(record => ({
          ...record,
          date: new Date(record.timestamp).toLocaleDateString(),
          status: record.type === 'checkIn' ? 'present' : 'absent'
        }));

        // Calculate summary
        const totalDays = processedRecords.length;
        const presentDays = processedRecords.filter(r => r.status === 'present').length;
        const lateDays = processedRecords.filter(r => r.status === 'late').length;
        const absentDays = totalDays - presentDays - lateDays;
        const attendancePercentage = (presentDays / totalDays) * 100;

        setRecords(processedRecords);
        setSummary({
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          attendancePercentage
        });
        setError('');
      } catch (err: any) {
        console.error('Error fetching attendance:', err);
        setError(err.message || ERROR_MESSAGES.DEFAULT);
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
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {new Date(record.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {record.type === 'checkIn' ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                    )}
                    {record.type === 'checkIn' ? 'Present' : 'Absent'}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(record.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {record.type === 'checkIn' ? 'Check In' : 'Check Out'}
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