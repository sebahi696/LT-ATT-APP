import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface Employee {
  _id: string;
  name: string;
  department: string;
}

interface AttendanceRecord {
  _id: string;
  employee: Employee;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkIn?: {
    time: string;
  };
  checkOut?: {
    time: string;
  };
  department: string;
}

interface Summary {
  _id: string;
  employeeName: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  presentPercentage: number;
}

const AttendanceReports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees and departments
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Employee[]>('/api/admin/employees', {
          headers: { 'x-auth-token': token }
        });
        setEmployees(response.data);
        const deptArray = response.data.map(emp => emp.department);
        const uniqueDepartments = Array.from(new Set(deptArray)) as string[];
        setDepartments(uniqueDepartments);
      } catch (err: any) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const fetchAttendanceRecords = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(selectedEmployee && { employeeId: selectedEmployee }),
        ...(selectedDepartment && { department: selectedDepartment }),
        ...(selectedType && { type: selectedType })
      });

      const response = await axios.get(`/api/admin/reports/attendance?${params}`, {
        headers: { 'x-auth-token': token }
      });
      setAttendanceRecords(response.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(selectedDepartment && { department: selectedDepartment })
      });

      const response = await axios.get(`/api/admin/reports/summary?${params}`, {
        headers: { 'x-auth-token': token }
      });
      setSummary(response.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching summary');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      fetchAttendanceRecords();
    } else {
      fetchSummary();
    }
  };

  const handleSearch = () => {
    if (tabValue === 0) {
      fetchAttendanceRecords();
    } else {
      fetchSummary();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Reports
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Detailed Report" />
            <Tab label="Summary Report" />
          </Tabs>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  label="Department"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {tabValue === 0 && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      value={selectedEmployee}
                      label="Employee"
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <MenuItem value="">All Employees</MenuItem>
                      {employees.map((emp) => (
                        <MenuItem key={emp._id} value={emp._id}>
                          {emp.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedType}
                      label="Status"
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                fullWidth
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {tabValue === 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.employee.name}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.status}</TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Total Days</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Attendance %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.totalDays}</TableCell>
                    <TableCell>{record.presentDays}</TableCell>
                    <TableCell>{record.absentDays}</TableCell>
                    <TableCell>{record.lateDays}</TableCell>
                    <TableCell>
                      {record.presentPercentage.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceReports; 