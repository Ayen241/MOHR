// User Types
export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    image?: string | null;
    token?: string;
  };
  expires: string;
}

// Employee Types
export interface Employee {
  id: string;
  userId: string;
  employeeId: string; // e.g., EMP001
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// Leave Types
export type LeaveType = 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveBalance {
  id: string;
  employeeId: string;
  vacationDaysTotal: number;
  vacationDaysUsed: number;
  sickDaysTotal: number;
  sickDaysUsed: number;
  personalDaysTotal: number;
  personalDaysUsed: number;
  year: number;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedDate?: string;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes?: string;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

// Room Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface RoomBooking {
  id: string;
  roomId: string;
  employeeId: string;
  bookedDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  room?: Room;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalEmployees: number;
  activeLeaveRequests: number;
  absentToday: number;
  attendanceRate: number;
  upcomingBookings: RoomBooking[];
  recentLeaveRequests: LeaveRequest[];
}

export interface LeaveSummary {
  approved: number;
  pending: number;
  rejected: number;
  cancelled: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  total: number;
  rate: number; // percentage
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  status?: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  department: string;
  phone?: string;
}

export interface LeaveRequestFormData {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface RoomBookingFormData {
  roomId: string;
  bookedDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
}
