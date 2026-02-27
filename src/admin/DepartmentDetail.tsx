import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Building2, 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  MoreHorizontal,
  Edit,
  Archive,
  Trash2,
  FileText,
  Settings,
  Activity,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../types';

const attendanceData = [
  { name: 'Week 1', value: 82 },
  { name: 'Week 2', value: 85 },
  { name: 'Week 3', value: 78 },
  { name: 'Week 4', value: 90 },
  { name: 'Week 5', value: 88 },
  { name: 'Week 6', value: 92 },
];

const submissionData = [
  { name: 'Graded', value: 75, color: '#10b981' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'Late', value: 5, color: '#ef4444' },
];

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [department, setDepartment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetching department details
    setTimeout(() => {
      setDepartment({
        id,
        name: 'Computer Science & Engineering',
        code: 'CSE-101',
        status: 'active',
        hod: 'Dr. Sarah Mitchell',
        stats: {
          staff: 24,
          students: 450,
          subjects: 18,
          attendance: 89.2,
          semester: 'Semester 4'
        }
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'staff', label: 'Staff', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/departments" className="hover:text-black transition-colors">Departments</Link>
          <ChevronRight size={12} />
          <span className="text-black">{department.code}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-black tracking-tight">{department.name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  {department.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-slate-400 font-medium">Department Code: <span className="text-black font-bold">{department.code}</span></p>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <p className="text-sm text-slate-400 font-medium">HOD: <span className="text-black font-bold">{department.hod}</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Edit size={14} />
              Edit
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Archive size={14} />
              Archive
            </button>
            <button className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 hover:bg-red-100 transition-all flex items-center gap-2">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <QuickStatCard label="Total Staff" value={department.stats.staff} icon={GraduationCap} />
          <QuickStatCard label="Total Students" value={department.stats.students} icon={Users} />
          <QuickStatCard label="Active Subjects" value={department.stats.subjects} icon={BookOpen} />
          <QuickStatCard label="Avg. Attendance" value={`${department.stats.attendance}%`} icon={TrendingUp} />
          <QuickStatCard label="Current Semester" value={department.stats.semester} icon={Calendar} />
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-black" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'staff' && <StaffTab />}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'subjects' && <SubjectsTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuickStatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="card-base p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-black">{value}</p>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-black">Attendance Trend</h3>
            <button className="text-xs font-bold text-slate-400 hover:text-black transition-colors flex items-center gap-1">
              View Full Report <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dx={-10} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-base p-8">
            <h3 className="text-lg font-bold text-black mb-6">Assignment Submissions</h3>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={submissionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {submissionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {submissionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-base p-8">
            <h3 className="text-lg font-bold text-black mb-6">Top Performing Subject</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Data Structures</p>
                <p className="text-xs text-slate-400 font-medium">Avg. Grade: <span className="text-emerald-600 font-bold">A+</span></p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Instructor</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="" />
                </div>
                <span className="text-xs font-bold text-black">Dr. Sarah Mitchell</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="card-base p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-black">Students at Risk</h3>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">
              12 High Risk
            </span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-black">Student Name {i}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Attendance: <span className="text-red-500 font-bold">62%</span></p>
                </div>
                <button className="p-2 text-slate-400 hover:text-black transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            View All Risk Alerts
          </button>
        </div>

        <div className="card-base p-8">
          <h3 className="text-lg font-bold text-black mb-6">Quick Links</h3>
          <div className="space-y-3">
            <QuickLinkButton icon={Plus} label="Add Subject" />
            <QuickLinkButton icon={UserPlus} label="Add Staff" />
            <QuickLinkButton icon={FileText} label="Generate Report" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffTab() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">Department Staff</h3>
        <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
          <Plus size={14} />
          Add Staff
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="p-6">Name</th>
              <th className="p-6">Staff ID</th>
              <th className="p-6">Subjects Assigned</th>
              <th className="p-6">Classes This Week</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${i}`} alt="" />
                    </div>
                    <span className="text-sm font-bold text-black">Dr. Professor {i}</span>
                  </div>
                </td>
                <td className="p-6 text-sm font-medium text-slate-600">STF-00{i}</td>
                <td className="p-6 text-sm font-medium text-slate-600">3 Subjects</td>
                <td className="p-6 text-sm font-medium text-slate-600">12 Classes</td>
                <td className="p-6">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-black transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search students..."
              className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all w-64"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter size={14} />
            Filters
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold text-slate-600 outline-none">
            <option>All Semesters</option>
            <option>Semester 1</option>
            <option>Semester 2</option>
          </select>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Name</th>
                <th className="p-6">Roll No</th>
                <th className="p-6">Semester</th>
                <th className="p-6">Attendance</th>
                <th className="p-6">Grade</th>
                <th className="p-6">Risk</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i}`} alt="" />
                      </div>
                      <span className="text-sm font-bold text-black">Student Name {i}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-medium text-slate-600">2023-CSE-0{i}</td>
                  <td className="p-6 text-sm font-medium text-slate-600">Semester 4</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs font-bold text-black">85%</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-bold text-black">A</span>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      Low
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-black transition-colors">
                      <MoreHorizontal size={16} />
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

function SubjectsTab() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">Department Subjects</h3>
        <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
          <Plus size={14} />
          Add Subject
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="p-6">Subject Name</th>
              <th className="p-6">Code</th>
              <th className="p-6">Semester</th>
              <th className="p-6">Assigned Staff</th>
              <th className="p-6">Students</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <span className="text-sm font-bold text-black">Subject Title {i}</span>
                </td>
                <td className="p-6 text-sm font-medium text-slate-600">CSE-30{i}</td>
                <td className="p-6 text-sm font-medium text-slate-600">Semester 4</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${i}`} alt="" />
                    </div>
                    <span className="text-xs font-bold text-black">Dr. Professor {i}</span>
                  </div>
                </td>
                <td className="p-6 text-sm font-medium text-slate-600">60 Students</td>
                <td className="p-6">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-black transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ReportCard 
        title="Attendance Report" 
        description="Detailed breakdown of student attendance across all subjects."
        icon={TrendingUp}
      />
      <ReportCard 
        title="Performance Report" 
        description="Academic performance analysis and grade distribution."
        icon={Activity}
      />
      <ReportCard 
        title="Submission Analytics" 
        description="Track assignment submission rates and pending tasks."
        icon={CheckCircle2}
      />
      <ReportCard 
        title="Staff Activity Report" 
        description="Monitor staff engagement and class delivery status."
        icon={Clock}
      />
    </div>
  );
}

function ReportCard({ title, description, icon: Icon }: any) {
  return (
    <div className="card-base p-8 group hover:border-black transition-all cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-black transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-black transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-bold text-black">{title}</h4>
        <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last generated: 2 days ago</span>
        <button className="text-xs font-bold text-black flex items-center gap-1">
          Generate <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="card-base p-8">
        <h3 className="text-xl font-bold text-black mb-8">Department Settings</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Attendance Threshold (%)</label>
            <input 
              type="number"
              defaultValue={75}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Semester Structure</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all">
              <option>8 Semesters (4 Years)</option>
              <option>6 Semesters (3 Years)</option>
              <option>4 Semesters (2 Years)</option>
            </select>
          </div>
          <div className="pt-4">
            <button className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="card-base p-8 border-red-100 bg-red-50/30">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-6">Irreversible actions related to this department.</p>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-white border border-red-200 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
            Archive Department
          </button>
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all">
            Delete Department
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickLinkButton({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-black transition-colors">
          <Icon size={16} />
        </div>
        <span className="text-sm font-bold text-slate-600 group-hover:text-black transition-colors">{label}</span>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-black transition-colors" />
    </button>
  );
}
