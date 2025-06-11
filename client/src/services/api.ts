import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { AuthResponse, User, Employee, Department, Attendance, QRCode } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response || error);
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/api/auth/user');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error.response || error);
      throw error;
    }
  }
};

// Employee Services
export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await api.get('/api/admin/employees');
      return response.data;
    } catch (error: any) {
      console.error('Get employees error:', error.response || error);
      throw error;
    }
  },
  
  create: async (employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      const response = await api.post('/api/admin/employees', employeeData);
      return response.data;
    } catch (error: any) {
      console.error('Create employee error:', error.response || error);
      throw error;
    }
  },
  
  update: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      const response = await api.put(`/api/admin/employees/${id}`, employeeData);
      return response.data;
    } catch (error: any) {
      console.error('Update employee error:', error.response || error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/admin/employees/${id}`);
    } catch (error: any) {
      console.error('Delete employee error:', error.response || error);
      throw error;
    }
  }
};

// Department Services
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await api.get('/api/admin/departments');
      return response.data;
    } catch (error: any) {
      console.error('Get departments error:', error.response || error);
      throw error;
    }
  },
  
  create: async (departmentData: Partial<Department>): Promise<Department> => {
    try {
      const response = await api.post('/api/admin/departments', departmentData);
      return response.data;
    } catch (error: any) {
      console.error('Create department error:', error.response || error);
      throw error;
    }
  },
  
  update: async (id: string, departmentData: Partial<Department>): Promise<Department> => {
    try {
      const response = await api.put(`/api/admin/departments/${id}`, departmentData);
      return response.data;
    } catch (error: any) {
      console.error('Update department error:', error.response || error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/admin/departments/${id}`);
    } catch (error: any) {
      console.error('Delete department error:', error.response || error);
      throw error;
    }
  }
};

// Attendance Services
export const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    try {
      const response = await api.get('/api/attendance');
      return response.data;
    } catch (error: any) {
      console.error('Get attendance error:', error.response || error);
      throw error;
    }
  },
  
  markAttendance: async (qrCode: string, location: [number, number]): Promise<Attendance> => {
    try {
      const response = await api.post('/api/attendance/mark', { qrCode, location });
      return response.data;
    } catch (error: any) {
      console.error('Mark attendance error:', error.response || error);
      throw error;
    }
  },
  
  getReport: async (startDate: string, endDate: string): Promise<Attendance[]> => {
    try {
      const response = await api.get('/api/attendance/report', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error: any) {
      console.error('Get attendance report error:', error.response || error);
      throw error;
    }
  }
};

// QR Code Services
export const qrCodeService = {
  generate: async (departmentId: string, location: [number, number]): Promise<QRCode> => {
    try {
      const response = await api.post('/api/admin/qr/generate', { departmentId, location });
      return response.data;
    } catch (error: any) {
      console.error('Generate QR code error:', error.response || error);
      throw error;
    }
  },
  
  validate: async (code: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/attendance/qr/validate', { code });
      return response.data.valid;
    } catch (error: any) {
      console.error('Validate QR code error:', error.response || error);
      throw error;
    }
  }
}; 