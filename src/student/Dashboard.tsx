import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  ClipboardList, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Target,
  Award,
  Plus
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ClassSession, Assignment, Submission, Attendance, cn } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { name: 'Mon', score: 85 },
  { name: 'Tue', score: 88 },
  { name: 'Wed', score: 92 },
  { name: 'Thu', score: 90 },
  { name: 'Fri', score: 95 },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    fetch(`/api/classes?student_id=${user.id}&date=${today}`).then(res => res.json()).then(setTodayClasses);
    fetch(`/api/assignments?student_id=${user.id}`).then(res => res.json()).then(setAssignments);
    fetch(`/api/submissions?student_id=${user.id}`).then(res => res.json()).then(setSubmissions);
    fetch(`/api/attendance?student_id=${user.id}`).then(res => res.json()).then(setAttendance);
  }, [user]);

  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status !== 'absent').length / attendance.length) * 100)
    : 100;

  const pendingAssignments = assignments.filter(a => !submissions.find(s => s.assignment_id === a.id));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Attendance Rate" 
          value={`${attendanceRate}%`} 
          trend="+2.4%"
          trendType="up"
          subtext="Strong attendance"
          detail="Above class average"
        />
        <StatCard 
          title="Pending Tasks" 
          value={pendingAssignments.length} 
          trend="3 due"
          trendType="down"
          subtext="3 due this week"
          detail="Acquisition needs attention"
        />
        <StatCard 
          title="Internal Grade" 
          value="8.4" 
          trend="+0.2"
          trendType="up"
          subtext="Top 5% of class"
          detail="Meets growth projections"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-black">Performance Overview</h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Last 3 months', 'Last 30 days'].map((tab, i) => (
                  <button 
                    key={tab}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                      i === 0 ? "bg-white text-black shadow-sm" : "text-slate-500 hover:text-black"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#94a3b8'}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-black">Today's Classes</h2>
              <button className="text-xs font-bold text-slate-400 hover:text-black">Full Schedule</button>
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
                      <p className="text-xs text-slate-400 font-medium">{cls.topic || 'General Session'}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200">
                    Upcoming
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold">No classes today.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-black">Deadlines</h2>
              <button className="p-2 text-slate-400 hover:text-black transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {pendingAssignments.length > 0 ? pendingAssignments.map(asg => (
                <div key={asg.id} className="p-4 rounded-xl border border-slate-100 hover:border-black transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {format(new Date(asg.deadline), 'MMM dd')}
                    </span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-black transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-black">{asg.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{asg.subject_name}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 size={40} className="mx-auto mb-3 opacity-10" />
                  <p className="text-xs font-bold">All caught up!</p>
                </div>
              )}
            </div>
            <button className="mt-6 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
              View All Tasks
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-black p-8 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Academic Goal</h3>
              <p className="text-slate-400 text-xs font-medium mb-6">Maintain 8.5+ CGPA to qualify for honors.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Progress</span>
                  <span>84%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[84%]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
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
