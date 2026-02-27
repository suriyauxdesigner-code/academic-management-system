import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Users, 
  Clock, 
  Layout, 
  Settings, 
  FileText, 
  Plus, 
  Edit, 
  Archive, 
  Trash2,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle2,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  UserCheck,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Subject, cn } from '../types';

const attendanceData = [
  { name: 'Week 1', attendance: 82 },
  { name: 'Week 2', attendance: 85 },
  { name: 'Week 3', attendance: 78 },
  { name: 'Week 4', attendance: 90 },
  { name: 'Week 5', attendance: 88 },
  { name: 'Week 6', attendance: 84 },
];

const gradeData = [
  { name: 'A+', value: 15 },
  { name: 'A', value: 25 },
  { name: 'B+', value: 35 },
  { name: 'B', value: 15 },
  { name: 'C', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ef4444'];

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setSubject({
        id: parseInt(id || '1'),
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        course_id: 1,
        course_name: 'B.Tech in Computer Science',
        department_name: 'Computer Science',
        staff_id: 1,
        staff_name: 'Prof. Alan Turing',
        semester: 2,
        credits: 4,
        type: 'core',
        status: 'active',
        description: 'Fundamental concepts of data structures and algorithms including complexity analysis, sorting, and searching.'
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!subject) return <div>Subject not found</div>;

  const tabs = ['Overview', 'Staff', 'Students', 'Classes', 'Assignments', 'Attendance', 'Performance', 'Reports', 'Settings'];

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/subjects" className="hover:text-black transition-colors">Subjects</Link>
          <ChevronRight size={12} />
          <span className="text-black">{subject.code}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center shadow-xl shadow-black/10">
              <BookOpen size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-black tracking-tight">{subject.name}</h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  subject.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                )}>
                  {subject.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  {subject.department_name}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  {subject.course_name}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5 font-bold text-black uppercase tracking-wider">
                  {subject.code} • Sem {subject.semester}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <Edit size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <Archive size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Students', value: '120', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Attendance', value: '84%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Classes', value: '24', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Assignments', value: '8', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Submission', value: '92%', icon: CheckCircle2, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Avg Perf.', value: 'B+', icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map((stat, i) => (
            <div key={i} className="card-base p-4 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-bold text-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-bold transition-all relative",
                activeTab === tab ? "text-black" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabSubject"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="card-base p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-black">Attendance Trend</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">Weekly attendance percentage for this subject.</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceData}>
                        <defs>
                          <linearGradient id="colorAttSub" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="attendance" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorAttSub)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="card-base p-8">
                    <h3 className="text-lg font-bold text-black mb-8">Grade Distribution</h3>
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gradeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {gradeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {gradeData.map((g, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-[10px] font-bold text-slate-400">{g.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-base p-8">
                    <h3 className="text-lg font-bold text-black mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                      {[
                        { title: 'Attendance Marked', time: '2 hours ago', desc: 'Prof. Turing marked attendance for Lecture #24' },
                        { title: 'New Assignment', time: '5 hours ago', desc: 'Assignment #8: Graph Algorithms published' },
                        { title: 'Material Uploaded', time: 'Yesterday', desc: 'Lecture notes for Week 6 uploaded' },
                      ].map((act, i) => (
                        <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-100 last:border-0">
                          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-black border-2 border-white shadow-sm" />
                          <p className="text-xs font-bold text-black">{act.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{act.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="card-base p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-black">Students at Risk</h3>
                    <AlertCircle className="text-rose-500" size={20} />
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Alex Johnson', roll: 'CS202401', risk: 'Attendance (62%)', color: 'text-rose-500' },
                      { name: 'Sarah Miller', roll: 'CS202415', risk: 'Pending Assignments', color: 'text-amber-500' },
                    ].map((student, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                        <div>
                          <p className="text-sm font-bold text-black">{student.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{student.roll}</p>
                        </div>
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", student.color)}>
                          {student.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-base p-8">
                  <h3 className="text-lg font-bold text-black mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <Plus size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Add Class Session</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <ClipboardList size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Create Assignment</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <UserCheck size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Mark Attendance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Staff' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Assigned Staff</h3>
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Plus size={14} />
                  Assign Staff
                </button>
              </div>
              <div className="card-base overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="p-6">Staff Member</th>
                      <th className="p-6">Role</th>
                      <th className="p-6">Classes Conducted</th>
                      <th className="p-6">Attendance Marked %</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Prof. Alan Turing', role: 'Primary Instructor', classes: 18, att: '100%' },
                      { name: 'Dr. Grace Hopper', role: 'Assistant Staff', classes: 6, att: '92%' },
                    ].map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${st.name}`} alt="" />
                            </div>
                            <span className="text-sm font-bold text-black">{st.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            st.role === 'Primary Instructor' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-400 border-slate-200"
                          )}>
                            {st.role}
                          </span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{st.classes} Sessions</td>
                        <td className="p-6 text-sm font-bold text-slate-600">{st.att}</td>
                        <td className="p-6">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs would follow a similar pattern, adding more as needed */}
          {activeTab !== 'Overview' && activeTab !== 'Staff' && (
            <div className="card-base p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                <Layout size={32} />
              </div>
              <h3 className="text-xl font-bold text-black">{activeTab} Section</h3>
              <p className="text-sm text-slate-400 font-medium mt-2 max-w-md">
                Detailed management for {activeTab.toLowerCase()} is being integrated into the Subject ERP module.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
