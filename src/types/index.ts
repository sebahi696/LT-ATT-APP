export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  createdAt: string;
}

export interface Employee {
  _id: string;
  user: User;
  employeeId: string;
  department: Department;
  position: string;
  salary: number;
  workingHours: {
    start: string;
    end: string;
  };
  joiningDate: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager: User;
  createdAt: string;
}

export interface Attendance {
  _id: string;
  employee: Employee;
  date: string;
  checkIn: {
    time: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  checkOut?: {
    time: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  workHours: number;
  notes?: string;
  verifiedBy?: User;
}

export interface QRCode {
  _id: string;
  code: string;
  department: Department;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy: User;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
} 