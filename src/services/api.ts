import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from '../config';
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error(ERROR_MESSAGES.AUTH_ERROR));
    }
    
    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }
    
    const errorMessage = error.response.data?.message || error.response.data?.msg || ERROR_MESSAGES.DEFAULT;
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_USER);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// Employee Services
export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EMPLOYEES);
      return response.data;
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  },
  
  create: async (employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      const response = await api.post(API_ENDPOINTS.ADD_EMPLOYEE, employeeData);
      return response.data;
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  },
  
  update: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      const response = await api.put(`${API_ENDPOINTS.UPDATE_EMPLOYEE}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Update employee error:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_ENDPOINTS.DELETE_EMPLOYEE}/${id}`);
    } catch (error) {
      console.error('Delete employee error:', error);
      throw error;
    }
  }
};

// Department Services
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DEPARTMENTS);
      return response.data;
    } catch (error) {
      console.error('Get departments error:', error);
      throw error;
    }
  },
  
  create: async (departmentData: Partial<Department>): Promise<Department> => {
    try {
      const response = await api.post(API_ENDPOINTS.ADD_DEPARTMENT, departmentData);
      return response.data;
    } catch (error) {
      console.error('Create department error:', error);
      throw error;
    }
  },
  
  update: async (id: string, departmentData: Partial<Department>): Promise<Department> => {
    try {
      const response = await api.put(`${API_ENDPOINTS.UPDATE_DEPARTMENT}/${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error('Update department error:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_ENDPOINTS.DELETE_DEPARTMENT}/${id}`);
    } catch (error) {
      console.error('Delete department error:', error);
      throw error;
    }
  }
};

// Attendance Services
export const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ATTENDANCE);
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      throw error;
    }
  },
  
  markAttendance: async (qrCode: string, location: [number, number]): Promise<Attendance> => {
    try {
      const response = await api.post(API_ENDPOINTS.MARK_ATTENDANCE, { qrCode, location });
      return response.data;
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  },
  
  getReport: async (startDate: string, endDate: string): Promise<Attendance[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ATTENDANCE_REPORT, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Get attendance report error:', error);
      throw error;
    }
  }
};

// QR Code Services
export const qrCodeService = {
  generate: async (departmentId: string, location: [number, number]): Promise<QRCode> => {
    try {
      const response = await api.post(API_ENDPOINTS.GENERATE_QR, { departmentId, location });
      return response.data;
    } catch (error) {
      console.error('Generate QR code error:', error);
      throw error;
    }
  },
  
  validate: async (code: string): Promise<boolean> => {
    try {
      const response = await api.post(API_ENDPOINTS.VALIDATE_QR, { code });
      return response.data.valid;
    } catch (error) {
      console.error('Validate QR code error:', error);
      throw error;
    }
  }
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },
  
  getRecentAttendance: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_RECENT_ATTENDANCE);
      return response.data;
    } catch (error) {
      console.error('Get recent attendance error:', error);
      throw error;
    }
  }
};

// Reports Services
export const reportsService = {
  getSalaryReport: async (startDate: string, endDate: string, department?: string) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_SALARY_REPORT, {
        params: { startDate, endDate, department }
      });
      return response.data;
    } catch (error) {
      console.error('Get salary report error:', error);
      throw error;
    }
  }
}; 