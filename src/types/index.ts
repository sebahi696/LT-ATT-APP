export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  employee: {
    _id: string;
    name: string;
    department: string;
  };
  type: 'checkIn' | 'checkOut';
  timestamp: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface QRCode {
  _id: string;
  code: string;
  department: string;
  type: 'checkIn' | 'checkOut';
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalEmployees: number;
  todayAttendance: number;
  presentToday: number;
  absentToday: number;
}

export interface AttendanceRecord {
  _id: string;
  employee: {
    _id: string;
    name: string;
    department: string;
  };
  type: 'checkIn' | 'checkOut';
  timestamp: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface SalaryReport {
  departments: Array<{
    name: string;
    totalEmployees: number;
    totalSalary: number;
    averageSalary: number;
    attendance: {
      present: number;
      absent: number;
      late: number;
    };
  }>;
  summary: {
    totalEmployees: number;
    totalSalary: number;
    averageSalary: number;
    totalAttendance: {
      present: number;
      absent: number;
      late: number;
    };
  };
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
} 