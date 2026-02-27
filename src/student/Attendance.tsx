import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Search,
  ArrowUpRight,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Attendance, ClassSession } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/attendance?student_id=${user.id}`).then(res => res.json()).then(setAttendance);
    fetch(`/api/classes?student_id=${user.id}`).then(res => res.json()).then(setClasses);
  }, [user]);

  const stats = classes.reduce((acc, cls) => {
    const record = attendance.find(a => a.class_id === cls.id);
    const subject = cls.subject_name || 'Unknown';
    if (!acc[subject]) acc[subject] = { total: 0, present: 0, late: 0, absent: 0 };
    
    const s = acc[subject];
    s.total++;
    if (record) {
      if (record.status === 'present') s.present++;
      else if (record.status === 'late') s.late++;
      else s.absent++;
    }
    return acc;
  }, {} as Record<string, { total: number, present: number, late: number, absent: number }>);

  const chartData = Object.entries(stats).map(([name, data]) => {
    const s = data as { total: number, present: number, late: number, absent: number };
    return {
      name,
      rate: Math.round(((s.present + s.late) / s.total) * 100)
    };
  });

  const overallRate = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, s) => acc + s.rate, 0) / chartData.length)
    : 100;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Report</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed breakdown of your class presence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Calendar size={18} />
            Full History
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                Subject-wise Breakdown
              </h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.rate < 75 ? '#ef4444' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {classes.slice(0, 5).map((cls, i) => {
                const record = attendance.find(a => a.class_id === cls.id);
                return (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        !record ? 'bg-slate-50 text-slate-300' :
                        record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                        record.status === 'late' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {!record ? <Clock size={20} /> :
                         record.status === 'present' ? <CheckCircle2 size={20} /> : 
                         record.status === 'late' ? <Clock size={20} /> : <XCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cls.subject_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(cls.date), 'MMMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      !record ? 'bg-slate-50 text-slate-400' :
                      record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                      record.status === 'late' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {record ? record.status : 'Not Marked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Attendance</p>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={overallRate < 75 ? 'text-red-500' : 'text-indigo-600'}
                    strokeWidth="8"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * overallRate) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-slate-900">{overallRate}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F1F4F9] border border-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Threshold</span>
                <span className="text-xs font-bold text-slate-900">75%</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F1F4F9] border border-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <span className={`text-xs font-bold ${overallRate < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {overallRate < 75 ? 'Low Attendance' : 'Good Standing'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <AlertCircle size={24} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Attendance Policy</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                Students with less than 75% attendance will not be permitted to appear for the final examinations.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                View Details
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
