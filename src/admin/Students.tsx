import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, Course } from '../types';

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/users?role=student').then(res => res.json()).then(setStudents);
    fetch('/api/courses').then(res => res.json()).then(setCourses);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Students</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor enrollment and academic performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Student
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, roll number..." 
              className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 font-bold text-xs">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Student Name</th>
                <th className="px-8 py-4">Course & Sem</th>
                <th className="px-8 py-4">Attendance</th>
                <th className="px-8 py-4">Grade</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ROLL: {2026000 + student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-slate-300" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{student.course_name || 'General'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Semester 4</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-[60px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">85%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-indigo-500" />
                      <span className="text-sm font-bold text-slate-900">A+</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all shadow-sm">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
