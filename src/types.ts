import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Role = 'admin' | 'staff' | 'student';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  department_id?: number;
  department_name?: string;
  course_id?: number;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  hod_id?: number;
  hod_name?: string;
  status?: 'active' | 'archived';
  description?: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  department_id: number;
  department_name?: string;
  duration_years: number;
  total_semesters: number;
  status?: 'active' | 'archived';
  description?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  course_id: number;
  staff_id: number;
  semester: number;
  credits: number;
  type: 'core' | 'elective' | 'lab';
  status: 'active' | 'archived';
  course_name?: string;
  staff_name?: string;
  department_name?: string;
  description?: string;
}

export interface ClassSession {
  id: number;
  subject_id: number;
  subject_name?: string;
  date: string;
  time: string;
  topic?: string;
  description?: string;
}

export interface Attendance {
  id: number;
  class_id: number;
  student_id: number;
  status: 'present' | 'absent' | 'late';
}

export interface Assignment {
  id: number;
  subject_id: number;
  subject_name?: string;
  title: string;
  description?: string;
  deadline: string;
  total_marks: number;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  submission_date: string;
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'late' | 'graded';
}
