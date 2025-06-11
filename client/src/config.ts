export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lt-att-backend.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
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
  VALIDATE_QR: '/api/attendance/qr/validate'
}; 