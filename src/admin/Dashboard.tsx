import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  ArrowUpRight, 
  MoreHorizontal,
  Calendar as CalendarIcon,
  ChevronRight,
  Plus,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Activity,
  UserPlus,
  CalendarDays,
  BarChart3,
  ClipboardList,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { useAuth } from '../AuthContext';

const attendanceTrend = [
  { name: 'Feb 01', value: 85 },
  { name: 'Feb 05', value: 88 },
  { name: 'Feb 10', value: 82 },
  { name: 'Feb 15', value: 90 },
  { name: 'Feb 20', value: 87 },
  { name: 'Feb 25', value: 92 },
  { name: 'Feb 27', value: 89 },
];

const departmentPerformance = [
  { name: 'Science', value: 88 },
  { name: 'Arts', value: 75 },
  { name: 'Commerce', value: 82 },
  { name: 'Tech', value: 94 },
  { name: 'Law', value: 78 },
];

const submissionStatus = [
  { name: 'Graded', value: 450, color: '#10b981' },
  { name: 'Pending', value: 120, color: '#f59e0b' },
  { name: 'Late', value: 45, color: '#ef4444' },
];

const riskAlerts = [
  { name: 'Alice Johnson', course: 'Computer Science', attendance: 65, grade: 'D', risk: 'Low Attendance', type: 'critical' },
  { name: 'Bob Smith', course: 'Business Admin', attendance: 82, grade: 'F', risk: 'Low Marks', type: 'warning' },
  { name: 'Charlie Brown', course: 'Mechanical Eng', attendance: 45, grade: 'C', risk: 'Inactive Enrollment', type: 'critical' },
  { name: 'Diana Prince', course: 'Fine Arts', attendance: 70, grade: 'D', risk: 'Low Attendance', type: 'warning' },
];

const recentActivity = [
  { icon: UserPlus, text: 'New student Alice Johnson enrolled', time: '2 hours ago', color: 'text-blue-500' },
  { icon: BookOpen, text: 'Prof. Anderson created "Advanced Physics"', time: '4 hours ago', color: 'text-emerald-500' },
  { icon: FileText, text: 'Assignment "Calculus II" published', time: 'Yesterday', color: 'text-amber-500' },
  { icon: CalendarDays, text: 'Semester schedule updated', time: '2 days ago', color: 'text-purple-500' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 1234,
    staff: 156,
    departments: 12,
    subjects: 84,
    classesToday: 24,
    pendingAssignments: 42
  });

  return (
    <div className="space-y-8 pb-12">
      {/* SECTION 1: Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black tracking-tight">
            Good Morning, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-slate-400 font-medium">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
              AY 2025-26
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
              Semester 2
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">All systems operational</span>
        </div>
      </header>

      {/* SECTION 2: KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          icon={Users} 
          value={stats.students.toLocaleString()} 
          label="Total Students" 
          trend="+4.2%" 
          trendType="up" 
          path="/admin/students"
        />
        <KPICard 
          icon={GraduationCap} 
          value={stats.staff.toLocaleString()} 
          label="Total Staff" 
          trend="+2.1%" 
          trendType="up" 
          path="/admin/users"
        />
        <KPICard 
          icon={Building2} 
          value={stats.departments.toLocaleString()} 
          label="Active Departments" 
          trend="0%" 
          trendType="neutral" 
          path="/admin/departments"
        />
        <KPICard 
          icon={BookOpen} 
          value={stats.subjects.toLocaleString()} 
          label="Active Subjects" 
          trend="+12%" 
          trendType="up" 
          path="/admin/subjects"
        />
        <KPICard 
          icon={CalendarIcon} 
          value={stats.classesToday.toLocaleString()} 
          label="Classes Scheduled Today" 
          trend="-5%" 
          trendType="down" 
          path="/admin/calendar"
        />
        <KPICard 
          icon={ClipboardList} 
          value={stats.pendingAssignments.toLocaleString()} 
          label="Assignments Pending Review" 
          trend="+18%" 
          trendType="up" 
          path="/admin/reports"
        />
      </div>

      {/* SECTION 3: Academic Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Overview */}
        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-black">Attendance Overview</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Institutional average: <span className="text-black font-bold">89.2%</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">
                View Report
              </button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">
                Export CSV
              </button>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Below Threshold</p>
              <p className="text-lg font-bold text-red-500">42 Students</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lowest Dept.</p>
              <p className="text-lg font-bold text-black">Arts (75%)</p>
            </div>
          </div>
        </div>

        {/* Assignment Overview */}
        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-black">Assignment Overview</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Total submissions this week: <span className="text-black font-bold">615</span></p>
            </div>
            <BarChart3 size={20} className="text-slate-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={submissionStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {submissionStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {submissionStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-black">{item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Most Pending</p>
                <p className="text-sm font-bold text-black">Science Dept (42)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Risk Alerts */}
      <div className="card-base p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <h3 className="text-xl font-bold text-black">Risk Alerts</h3>
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">
            4 Critical Issues
          </span>
        </div>
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4">Student Name</th>
                <th className="pb-4">Course</th>
                <th className="pb-4">Attendance</th>
                <th className="pb-4">Grade</th>
                <th className="pb-4">Risk Type</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riskAlerts.map((risk, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${risk.name}`} alt="" />
                      </div>
                      <span className="text-sm font-bold text-black">{risk.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm font-medium text-slate-600">{risk.course}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", risk.attendance < 50 ? "bg-red-500" : "bg-amber-500")} 
                          style={{ width: `${risk.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-black">{risk.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "text-xs font-bold",
                      risk.grade === 'F' ? "text-red-500" : risk.grade === 'D' ? "text-amber-500" : "text-black"
                    )}>{risk.grade}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      risk.type === 'critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {risk.risk}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-black transition-colors">
                        <Users size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-black transition-colors">
                        <Bell size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View for Risk Alerts */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {riskAlerts.map((risk, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${risk.name}`} alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{risk.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{risk.course}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                  risk.type === 'critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                  {risk.risk}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Attendance</p>
                    <p className="text-xs font-bold text-black">{risk.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Grade</p>
                    <p className="text-xs font-bold text-black">{risk.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400">
                    <Users size={14} />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400">
                    <Bell size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 5: Recent Activity Timeline */}
        <div className="lg:col-span-2 card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="text-black" size={24} />
              <h3 className="text-xl font-bold text-black">Recent Activity</h3>
            </div>
            <button className="text-xs font-bold text-slate-400 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                  <item.icon size={18} className={item.color} />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-bold text-black">{item.text}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: Quick Actions Panel */}
        <div className="card-base p-8">
          <h3 className="text-xl font-bold text-black mb-8">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <QuickActionButton icon={UserPlus} label="Add Student" primary />
            <QuickActionButton icon={Users} label="Add Staff" />
            <QuickActionButton icon={BookOpen} label="Create Subject" />
            <QuickActionButton icon={Building2} label="Create Department" />
            <QuickActionButton icon={CalendarIcon} label="Publish Event" />
            <QuickActionButton icon={FileText} label="Generate Report" />
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">System Notices</h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-700">Backup completed successfully</p>
                <p className="text-[10px] text-blue-500 mt-1">Today at 04:00 AM</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="text-xs font-bold text-amber-700">Server maintenance scheduled</p>
                <p className="text-[10px] text-amber-500 mt-1">Sunday at 02:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, value, label, trend, trendType, path }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="card-base p-6 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600" : 
          trendType === 'down' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"
        )}>
          {trendType === 'up' ? <ArrowUp size={10} /> : trendType === 'down' ? <ArrowDown size={10} /> : null}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-black tracking-tight">{value}</p>
        <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-black transition-colors">
        <span>View Details</span>
        <ChevronRight size={12} />
      </div>
    </motion.div>
  );
}

function QuickActionButton({ icon: Icon, label, primary }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
      primary 
        ? "bg-black text-white hover:bg-slate-800 shadow-lg shadow-black/5" 
        : "bg-white text-black border border-slate-200 hover:bg-slate-50"
    )}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
