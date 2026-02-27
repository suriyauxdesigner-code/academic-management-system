import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Save
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Subject, User, Attendance } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function StaffAttendance() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (!user) return;
    fetch(`/api/subjects?staff_id=${user.id}`).then(res => res.json()).then(setSubjects);
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      const sub = subjects.find(s => s.id === parseInt(selectedSubject));
      if (sub) {
        fetch(`/api/users?role=student&course_id=${sub.course_id}`)
          .then(res => res.json())
          .then(setStudents);
      }
    }
  }, [selectedSubject, subjects]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance</h1>
          <p className="text-slate-500 font-medium mt-1">Mark daily attendance for your classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <button onClick={() => {}} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
            <span className="text-sm font-bold text-slate-700">{format(new Date(date), 'MMM dd, yyyy')}</span>
            <button onClick={() => {}} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16} /></button>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2">
            <Save size={18} />
            Save Attendance
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[240px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Subject</p>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#F1F4F9] border-none rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.course_name})</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[240px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Student</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Name or Roll No..." 
                className="w-full bg-[#F1F4F9] border-none rounded-xl py-3 pl-11 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Roll Number</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Last 5 Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length > 0 ? students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" />
                      </div>
                      <span className="font-bold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ROLL-{2026000 + student.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <StatusButton 
                        active={attendance[student.id] === 'present'} 
                        onClick={() => handleStatusChange(student.id, 'present')}
                        type="present"
                      />
                      <StatusButton 
                        active={attendance[student.id] === 'late'} 
                        onClick={() => handleStatusChange(student.id, 'late')}
                        type="late"
                      />
                      <StatusButton 
                        active={attendance[student.id] === 'absent'} 
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        type="absent"
                      />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {[1, 1, 0, 1, 1].map((s, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${s ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      ))}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <Users size={48} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-400 font-bold">Select a subject to view student list</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusButton({ active, onClick, type }: any) {
  const configs: any = {
    present: { label: 'P', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    late: { label: 'L', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    absent: { label: 'A', color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-600' }
  };

  const config = configs[type];

  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
        active 
          ? `${config.color} text-white border-transparent shadow-lg shadow-${type}-200` 
          : `bg-white text-slate-400 border-slate-100 hover:bg-slate-50`
      }`}
    >
      {config.label}
    </button>
  );
}
