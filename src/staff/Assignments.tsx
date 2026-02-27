import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ClipboardList, 
  Calendar, 
  Users,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Assignment, Subject } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function StaffAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/assignments?staff_id=${user.id}`).then(res => res.json()).then(setAssignments);
    fetch(`/api/subjects?staff_id=${user.id}`).then(res => res.json()).then(setSubjects);
  }, [user]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-slate-500 font-medium mt-1">Create and grade student assessments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search assignments..." 
                  className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                <Filter size={18} />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{asg.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{asg.subject_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {asg.submissions_count || 0} Submissions
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">Due: {format(new Date(asg.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users size={14} />
                        <span className="text-xs font-bold">42 Students</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      View Submissions
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              Quick Stats
            </h2>
            <div className="space-y-6">
              <StatItem label="Total Assignments" value={assignments.length} color="indigo" />
              <StatItem label="Average Grade" value="82%" color="emerald" />
              <StatItem label="Pending Reviews" value="14" color="amber" />
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white">
            <h3 className="text-xl font-bold mb-2">Grading Tip</h3>
            <p className="text-indigo-100 text-xs font-medium leading-relaxed">
              Use the "Quick Feedback" templates to speed up your grading process for common mistakes.
            </p>
            <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all">
              Manage Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${colors[color]}`}></div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}
