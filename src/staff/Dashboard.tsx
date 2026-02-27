import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ClassSession, Subject, Assignment, cn } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    fetch(`/api/subjects?staff_id=${user.id}`).then(res => res.json()).then(setSubjects);
    fetch(`/api/classes?staff_id=${user.id}&date=${today}`).then(res => res.json()).then(setTodayClasses);
    fetch(`/api/assignments?staff_id=${user.id}`).then(res => res.json()).then(setAssignments);
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Subjects" 
          value={subjects.length} 
          trend="+2"
          trendType="up"
          subtext="New this semester"
          detail="Curriculum updated"
        />
        <StatCard 
          title="Today's Classes" 
          value={todayClasses.length} 
          trend="Next: 2PM"
          trendType="up"
          subtext="Ongoing schedule"
          detail="3 labs, 2 lectures"
        />
        <StatCard 
          title="Pending Grading" 
          value={assignments.length} 
          trend="+12"
          trendType="up"
          subtext="New submissions"
          detail="Due for review this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-black">Today's Schedule</h2>
            <button className="text-xs font-bold text-slate-400 hover:text-black">View All</button>
          </div>

          <div className="space-y-4">
            {todayClasses.length > 0 ? todayClasses.map(cls => (
              <div key={cls.id} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Time</span>
                    <span className="text-xs font-bold text-black">{cls.time}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{cls.subject_name}</p>
                    <p className="text-xs text-slate-400 font-medium">{cls.topic || 'No topic set'}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-black hover:bg-black hover:text-white transition-all">
                  Attendance
                </button>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-bold">No classes scheduled.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-black">My Subjects</h2>
            <button className="p-2 text-slate-400 hover:text-black transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map(sub => (
              <motion.div 
                key={sub.id}
                whileHover={{ y: -2 }}
                className="p-6 rounded-xl border border-slate-100 bg-white hover:border-black transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                    <BookOpen size={18} className="text-black" />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-black transition-colors" />
                </div>
                <p className="text-sm font-bold text-black">{sub.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{sub.course_name}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.name + i}`} alt="" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">42 Students</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendType, subtext, detail }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="card-base p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-slate-400">{title}</h4>
        <div className={cn(
          "badge-trend",
          trendType === 'up' ? "bg-slate-50 text-black border-slate-200" : "bg-slate-50 text-slate-600 border-slate-200"
        )}>
          {trendType === 'up' ? <ArrowUpRight size={10} /> : <ArrowUpRight size={10} className="rotate-180" />}
          {trend}
        </div>
      </div>
      <div className="mb-6">
        <p className="text-3xl font-bold text-black tracking-tight">{value}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-black">{subtext}</p>
          <TrendingUp size={12} className={cn(trendType === 'up' ? "text-black" : "text-slate-400 rotate-180")} />
        </div>
        <p className="text-xs font-medium text-slate-400">{detail}</p>
      </div>
    </motion.div>
  );
}
