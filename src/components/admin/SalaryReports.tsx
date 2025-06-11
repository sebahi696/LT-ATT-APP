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
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

interface Employee {
  employeeId: string;
  name: string;
  department: string;
  totalWorkingHours: string;
  expectedWorkingHours: string;
  missingHours: string;
  salaryPerHour: string;
  totalSalary: string;
  totalDeduction: string;
  finalSalary: string;
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
}

interface EmployeeResponse {
  _id: string;
  name: string;
  department: string;
}

interface DepartmentSummary {
  department: string;
  totalEmployees: number;
  totalSalary: number;
  totalDeductions: number;
  totalFinalSalary: number;
  employees: Employee[];
}

interface SalaryReport {
  overall: {
    totalEmployees: number;
    totalSalary: number;
    totalDeductions: number;
    totalFinalSalary: number;
  };
  departments: DepartmentSummary[];
}

const SalaryReports: React.FC = () => {
  // Set default dates for the last 7 days
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 7);

  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [salaryReport, setSalaryReport] = useState<SalaryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const response = await axios.get<EmployeeResponse[]>('/api/admin/employees', {
          headers: { 'x-auth-token': token }
        });
        console.log('Departments response:', response.data);
        const deptArray = response.data.map(emp => emp.department);
        const uniqueDepartments = Array.from(new Set(deptArray)) as string[];
        console.log('Unique departments:', uniqueDepartments);
        setDepartments(uniqueDepartments);

        // Automatically fetch initial report
        await fetchSalaryReport();
      } catch (err: any) {
        console.error('Error fetching departments:', err.response || err);
        setError(err.response?.data?.msg || 'Error fetching departments');
      }
    };

    fetchDepartments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSalaryReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(selectedDepartment && { department: selectedDepartment })
    };
    console.log('Fetching salary report with params:', params);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await axios.get<SalaryReport>(
        `/api/admin/reports/salary?${new URLSearchParams(params)}`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      console.log('Salary report response:', response.data);
      if (response.data.departments.length === 0) {
        setError('No data found for the selected criteria');
        setSalaryReport(null);
      } else {
        setSalaryReport(response.data);
        setError('');
      }
    } catch (err: any) {
      console.error('Salary report error:', err);
      const errorMessage = err.response?.data?.msg || err.response?.data?.error || err.message;
      setError(`Error fetching salary report: ${errorMessage}`);
      setSalaryReport(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Salary Reports
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
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
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                onClick={fetchSalaryReport}
                disabled={loading}
                fullWidth
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && salaryReport && (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Total Employees</Typography>
                  <Typography variant="h6">{salaryReport.overall.totalEmployees}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Total Salary</Typography>
                  <Typography variant="h6">{formatCurrency(salaryReport.overall.totalSalary)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Total Deductions</Typography>
                  <Typography variant="h6">{formatCurrency(salaryReport.overall.totalDeductions)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Final Salary</Typography>
                  <Typography variant="h6">{formatCurrency(salaryReport.overall.totalFinalSalary)}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {salaryReport.departments.map((dept) => (
              <Accordion key={dept.department}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle1">{dept.department}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2">
                        Employees: {dept.totalEmployees}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2">
                        Total: {formatCurrency(dept.totalSalary)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2">
                        Final: {formatCurrency(dept.totalFinalSalary)}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell align="right">Expected Hours</TableCell>
                          <TableCell align="right">Actual Hours</TableCell>
                          <TableCell align="right">Missing Hours</TableCell>
                          <TableCell align="right">Rate/Hour</TableCell>
                          <TableCell align="right">Total Salary</TableCell>
                          <TableCell align="right">Deductions</TableCell>
                          <TableCell align="right">Final Salary</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dept.employees.map((employee) => (
                          <TableRow key={employee.employeeId}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell align="right">{employee.expectedWorkingHours}</TableCell>
                            <TableCell align="right">{employee.totalWorkingHours}</TableCell>
                            <TableCell align="right">{employee.missingHours}</TableCell>
                            <TableCell align="right">{formatCurrency(parseFloat(employee.salaryPerHour))}</TableCell>
                            <TableCell align="right">{formatCurrency(parseFloat(employee.totalSalary))}</TableCell>
                            <TableCell align="right">{formatCurrency(parseFloat(employee.totalDeduction))}</TableCell>
                            <TableCell align="right">{formatCurrency(parseFloat(employee.finalSalary))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default SalaryReports; 