import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Login from './Login';

// Admin Pages
import AdminDashboard from './admin/Dashboard';
import AdminDepartments from './admin/Departments';
import AddDepartment from './admin/AddDepartment';
import DepartmentDetail from './admin/DepartmentDetail';
import AdminCourses from './admin/Courses';
import AddCourse from './admin/AddCourse';
import CourseDetail from './admin/CourseDetail';
import AdminSubjects from './admin/Subjects';
import AddSubject from './admin/AddSubject';
import SubjectDetail from './admin/SubjectDetail';
import AdminUsers from './admin/Users';
import AdminStudents from './admin/Students';

// Staff Pages
import StaffDashboard from './staff/Dashboard';
import StaffAttendance from './staff/Attendance';
import StaffAssignments from './staff/Assignments';
import StaffClasses from './staff/Classes';

// Student Pages
import StudentDashboard from './student/Dashboard';
import StudentClasses from './student/Classes';
import StudentAssignments from './student/Assignments';
import StudentAttendance from './student/Attendance';

import RoleSelection from './RoleSelection';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} />;

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/admin/login" element={<Login role="admin" />} />
          <Route path="/staff/login" element={<Login role="staff" />} />
          <Route path="/student/login" element={<Login role="student" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute role="admin"><AdminDepartments /></ProtectedRoute>} />
          <Route path="/admin/departments/new" element={<ProtectedRoute role="admin"><AddDepartment /></ProtectedRoute>} />
          <Route path="/admin/departments/:id" element={<ProtectedRoute role="admin"><DepartmentDetail /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/courses/new" element={<ProtectedRoute role="admin"><AddCourse /></ProtectedRoute>} />
          <Route path="/admin/courses/:id" element={<ProtectedRoute role="admin"><CourseDetail /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><AdminSubjects /></ProtectedRoute>} />
          <Route path="/admin/subjects/new" element={<ProtectedRoute role="admin"><AddSubject /></ProtectedRoute>} />
          <Route path="/admin/subjects/:id" element={<ProtectedRoute role="admin"><SubjectDetail /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />

          {/* Staff Routes */}
          <Route path="/staff" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/attendance" element={<ProtectedRoute role="staff"><StaffAttendance /></ProtectedRoute>} />
          <Route path="/staff/assignments" element={<ProtectedRoute role="staff"><StaffAssignments /></ProtectedRoute>} />
          <Route path="/staff/classes" element={<ProtectedRoute role="staff"><StaffClasses /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/classes" element={<ProtectedRoute role="student"><StudentClasses /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
