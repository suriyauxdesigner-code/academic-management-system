import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  GraduationCap, 
  Building2, 
  Clock, 
  Users, 
  BookOpen, 
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
  ChevronDown,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Course, cn } from '../types';

const attendanceData = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 82 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 87 },
];

const performanceData = [
  { grade: 'A+', count: 12 },
  { grade: 'A', count: 25 },
  { grade: 'B+', count: 30 },
  { grade: 'B', count: 15 },
  { grade: 'C', count: 8 },
  { grade: 'D', count: 3 },
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setCourse({
        id: parseInt(id || '1'),
        name: 'B.Tech in Computer Science',
        code: 'BTECH-CSE',
        department_id: 1,
        department_name: 'Computer Science',
        duration_years: 4,
        total_semesters: 8,
        status: 'active',
        description: 'A comprehensive program covering software engineering, data structures, and artificial intelligence.'
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

  if (!course) return <div>Course not found</div>;

  const tabs = ['Overview', 'Semesters', 'Subjects', 'Students', 'Reports', 'Settings'];

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/courses" className="hover:text-black transition-colors">Courses</Link>
          <ChevronRight size={12} />
          <span className="text-black">{course.code}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center shadow-xl shadow-black/10">
              <GraduationCap size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-black tracking-tight">{course.name}</h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  course.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                )}>
                  {course.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  {course.department_name}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {course.duration_years} Years Program
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5 font-bold text-black">
                  {course.code}
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Students', value: '420', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Subjects', value: '32', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Semesters', value: '8', icon: Layout, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg Attendance', value: '87%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Overall Perf.', value: 'B+', icon: CheckCircle2, color: 'text-rose-600', bg: 'bg-rose-50' },
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
                  layoutId="activeTab"
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
                      <p className="text-xs text-slate-400 font-medium mt-1">Daily attendance average across all semesters.</p>
                    </div>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceData}>
                        <defs>
                          <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke="#000" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorAtt)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card-base p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-black">Performance Distribution</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">Grade distribution for the current academic year.</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="grade" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#000" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
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
                      { name: 'Alex Johnson', roll: 'CS202401', risk: 'Low Attendance (62%)', color: 'text-rose-500' },
                      { name: 'Sarah Miller', roll: 'CS202415', risk: 'Failing 2 Subjects', color: 'text-amber-500' },
                      { name: 'David Chen', roll: 'CS202408', risk: 'Low Attendance (68%)', color: 'text-rose-500' },
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
                  <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-black transition-colors border-t border-slate-100 pt-6">
                    View All Risk Alerts
                  </button>
                </div>

                <div className="card-base p-8">
                  <h3 className="text-lg font-bold text-black mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <Plus size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Add Subject</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <Users size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Add Students</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-black hover:text-white transition-all group">
                      <FileText size={18} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Semesters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Academic Semesters</h3>
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Plus size={14} />
                  Add Semester
                </button>
              </div>
              <div className="card-base overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="p-6">Semester Name</th>
                      <th className="p-6">Subjects</th>
                      <th className="p-6">Students</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <tr key={sem} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <span className="text-sm font-bold text-black">Semester {sem}</span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">4 Subjects</td>
                        <td className="p-6 text-sm font-bold text-slate-600">420 Students</td>
                        <td className="p-6">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            sem === 1 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                            sem === 2 ? "bg-blue-50 text-blue-600 border-blue-100" :
                            "bg-slate-50 text-slate-400 border-slate-200"
                          )}>
                            {sem === 1 ? 'Completed' : sem === 2 ? 'Active' : 'Upcoming'}
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

          {activeTab === 'Subjects' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search subjects..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none"
                  />
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Plus size={14} />
                  Add Subject to Course
                </button>
              </div>
              <div className="card-base overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="p-6">Subject Name</th>
                      <th className="p-6">Code</th>
                      <th className="p-6">Semester</th>
                      <th className="p-6">Assigned Staff</th>
                      <th className="p-6">Credits</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Data Structures', code: 'CS201', sem: 'Sem 2', staff: 'Prof. Miller', credits: 4 },
                      { name: 'Discrete Math', code: 'MA201', sem: 'Sem 2', staff: 'Dr. Sarah', credits: 3 },
                      { name: 'Computer Networks', code: 'CS202', sem: 'Sem 2', staff: 'Prof. Wilson', credits: 4 },
                    ].map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <span className="text-sm font-bold text-black">{sub.name}</span>
                        </td>
                        <td className="p-6">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{sub.code}</span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{sub.sem}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.staff}`} alt="" />
                            </div>
                            <span className="text-sm font-bold text-black">{sub.staff}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{sub.credits}</td>
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

          {activeTab === 'Students' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Search students..."
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-600 outline-none">
                      <option>All Semesters</option>
                      <option>Semester 1</option>
                      <option>Semester 2</option>
                    </select>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Download size={14} />
                    Export List
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                    Promote All
                  </button>
                </div>
              </div>
              <div className="card-base overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="p-6">Name</th>
                      <th className="p-6">Roll No</th>
                      <th className="p-6">Semester</th>
                      <th className="p-6">Attendance</th>
                      <th className="p-6">Overall Grade</th>
                      <th className="p-6">Risk Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Alex Johnson', roll: 'CS202401', sem: 'Sem 2', att: '62%', grade: 'C', risk: 'High' },
                      { name: 'Sarah Miller', roll: 'CS202415', sem: 'Sem 2', att: '94%', grade: 'A+', risk: 'None' },
                      { name: 'David Chen', roll: 'CS202408', sem: 'Sem 2', att: '68%', grade: 'B', risk: 'Medium' },
                    ].map((student, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" />
                            </div>
                            <span className="text-sm font-bold text-black">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{student.roll}</span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{student.sem}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  parseInt(student.att) < 75 ? "bg-rose-500" : "bg-emerald-500"
                                )}
                                style={{ width: student.att }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600">{student.att}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{student.grade}</td>
                        <td className="p-6">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            student.risk === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : 
                            student.risk === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}>
                            {student.risk}
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

          {activeTab === 'Reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Attendance Report', desc: 'Detailed attendance statistics for all students and subjects.', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Grade Distribution', desc: 'Performance analysis across all semesters and subjects.', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Subject Comparison', desc: 'Compare performance and attendance across different subjects.', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
                { title: 'Student Progress', desc: 'Individual student progress trends and performance history.', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map((report, i) => (
                <div key={i} className="card-base p-8 group hover:shadow-xl transition-all cursor-pointer">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110", report.bg, report.color)}>
                    <report.icon size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2">{report.title}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{report.desc}</p>
                  <div className="flex items-center gap-3">
                    <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                      <Download size={14} />
                      CSV
                    </button>
                    <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                      <Download size={14} />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-4xl space-y-8">
              <div className="card-base p-8">
                <h3 className="text-lg font-bold text-black mb-8">Academic Policies</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-black">Attendance Threshold</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Minimum attendance required for semester promotion.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="number" defaultValue={75} className="w-20 bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm font-bold outline-none" />
                      <span className="text-sm font-bold text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-black">Automatic Promotion</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Automatically promote students who meet all criteria.</p>
                    </div>
                    <button className="w-12 h-6 bg-black rounded-full relative transition-all">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-base p-8 border-rose-100">
                <h3 className="text-lg font-bold text-rose-600 mb-8">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                    <div>
                      <p className="text-sm font-bold text-black">Archive Course</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Prevent new enrollments but retain existing data.</p>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all">
                      Archive
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                    <div>
                      <p className="text-sm font-bold text-black">Delete Course</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Permanently remove this course and all associated data.</p>
                    </div>
                    <button className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
