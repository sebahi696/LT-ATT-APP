import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { AuthResponse, User, Employee, Department, Attendance, QRCode } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/user');
    return response.data;
  }
};

// Employee Services
export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/api/admin/employees');
    return response.data;
  },
  
  create: async (employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.post('/api/admin/employees', employeeData);
    return response.data;
  },
  
  update: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/api/admin/employees/${id}`, employeeData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/employees/${id}`);
  }
};

// Department Services
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get('/api/admin/departments');
    return response.data;
  },
  
  create: async (departmentData: Partial<Department>): Promise<Department> => {
    const response = await api.post('/api/admin/departments', departmentData);
    return response.data;
  },
  
  update: async (id: string, departmentData: Partial<Department>): Promise<Department> => {
    const response = await api.put(`/api/admin/departments/${id}`, departmentData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/departments/${id}`);
  }
};

// Attendance Services
export const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get('/api/attendance');
    return response.data;
  },
  
  markAttendance: async (qrCode: string, location: [number, number]): Promise<Attendance> => {
    const response = await api.post('/api/attendance/mark', { qrCode, location });
    return response.data;
  },
  
  getReport: async (startDate: string, endDate: string): Promise<Attendance[]> => {
    const response = await api.get('/api/attendance/report', {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

// QR Code Services
export const qrCodeService = {
  generate: async (departmentId: string, location: [number, number]): Promise<QRCode> => {
    const response = await api.post('/api/admin/qr/generate', { departmentId, location });
    return response.data;
  },
  
  validate: async (code: string): Promise<boolean> => {
    const response = await api.post('/api/attendance/qr/validate', { code });
    return response.data.valid;
  }
}; 