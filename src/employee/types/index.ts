// Centralized types for HRMS
export interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface Meeting {
  title: string;
  date: string;
  time: string;
}

export interface Absent {
  name: string;
  status: string;
}

export interface Notification {
  id: number;
  name: string;
  message: string;
  action: string;
  time: string;
  type: 'success' | 'error';
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface DashboardData {
  stats: Stat[];
  chartData: ChartData[];
  meetings: Meeting[];
  absentToday: Absent[];
  notifications: Notification[];
  announcements: Announcement[];
}

export interface ChartData {
  name: string;
  Project: number;
  Task: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  employeeId: string;
  avatar: string;
  phone: string;
  isOnline: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'present' | 'absent' | 'late';
  workingHours: number;
}

export interface PayrollRecord {
  id: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

export interface Goal {
  id: string;
  name: string;
  progress: number;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  department: string;
}

