export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://lt-att-backend.onrender.com'
  : 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  GET_USER: '/api/auth/user',
  
  // User endpoints
  GET_USER_PROFILE: '/api/users/profile',
  UPDATE_USER_PROFILE: '/api/users/profile',
  
  // Employee endpoints
  GET_EMPLOYEES: '/api/admin/employees',
  ADD_EMPLOYEE: '/api/admin/employees',
  UPDATE_EMPLOYEE: '/api/admin/employees',
  DELETE_EMPLOYEE: '/api/admin/employees',
  
  // Attendance endpoints
  GET_ATTENDANCE: '/api/attendance',
  MARK_ATTENDANCE: '/api/attendance/mark',
  GET_ATTENDANCE_REPORT: '/api/attendance/report',
  
  // Department endpoints
  GET_DEPARTMENTS: '/api/admin/departments',
  ADD_DEPARTMENT: '/api/admin/departments',
  UPDATE_DEPARTMENT: '/api/admin/departments',
  DELETE_DEPARTMENT: '/api/admin/departments',
  
  // QR Code endpoints
  GENERATE_QR: '/api/admin/qr/generate',
  VALIDATE_QR: '/api/attendance/qr/validate',
  
  // Dashboard endpoints
  GET_DASHBOARD_STATS: '/api/admin/dashboard/stats',
  GET_RECENT_ATTENDANCE: '/api/admin/dashboard/recent-attendance',
  
  // Reports endpoints
  GET_SALARY_REPORT: '/api/admin/reports/salary'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  DEFAULT: 'An unexpected error occurred. Please try again.'
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in',
  LOGOUT: 'Successfully logged out',
  SAVE: 'Changes saved successfully',
  DELETE: 'Item deleted successfully',
  CREATE: 'Item created successfully',
  UPDATE: 'Item updated successfully'
}; 