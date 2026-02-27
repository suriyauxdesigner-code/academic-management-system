import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Users, 
  Clock,
  Filter,
  Building2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layout,
  Archive,
  Eye,
  Edit,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { Course, Department, cn } from '../types';

export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/courses').then(res => res.json()).then(setCourses);
    fetch('/api/departments').then(res => res.json()).then(setDepartments);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || course.department_id.toString() === deptFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Courses</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage academic programs and monitor course-level health.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/courses/new')}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-black/5"
        >
          <Plus size={18} />
          Add Course
        </button>
      </header>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search course name or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-black/5 transition-all"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-black/5 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
          <select className="bg-transparent text-xs font-bold text-black outline-none cursor-pointer">
            <option>Alphabetical</option>
            <option>Student Count</option>
            <option>Created Date</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Course Name</th>
                <th className="p-6">Code</th>
                <th className="p-6">Department</th>
                <th className="p-6">Duration</th>
                <th className="p-6">Semesters</th>
                <th className="p-6">Students</th>
                <th className="p-6">Subjects</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr 
                    key={course.id} 
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                          <GraduationCap size={18} />
                        </div>
                        <span className="text-sm font-bold text-black">{course.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{course.code}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-300" />
                        <span className="text-sm font-bold text-slate-600">{course.department_name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold text-slate-600">{course.duration_years} Years</span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold text-slate-600">{course.total_semesters}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <Users size={14} className="text-slate-300" />
                        {(course as any).student_count || 0}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <BookOpen size={14} className="text-slate-300" />
                        {(course as any).subject_count || 0}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        course.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                      )}>
                        {course.status || 'active'}
                      </span>
                    </td>
                    <td className="p-6 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                          className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                        <GraduationCap size={40} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">No courses available.</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">Start by creating your first academic program.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/admin/courses/new')}
                        className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                      >
                        <Plus size={18} />
                        Create First Course
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredCourses.length > 0 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
            <p>Showing {filteredCourses.length} of {courses.length} courses</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
