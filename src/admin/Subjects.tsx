import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Users, 
  Clock, 
  Layout, 
  Edit, 
  Archive, 
  Trash2,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Subject, Department, Course, cn } from '../types';

export default function AdminSubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    department_id: '',
    course_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, [filters.department_id, filters.course_id, filters.status]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, deptsRes] = await Promise.all([
        fetch(`/api/subjects?department_id=${filters.department_id}&course_id=${filters.course_id}&status=${filters.status}`),
        fetch('/api/departments')
      ]);
      
      const subsData = await subsRes.json();
      const deptsData = await deptsRes.json();
      
      setSubjects(subsData);
      setDepartments(deptsData);
      
      if (filters.department_id) {
        const coursesRes = await fetch(`/api/courses?department_id=${filters.department_id}`);
        setCourses(await coursesRes.json());
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    s.code.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Subjects</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage academic subjects and allocations across the institution.</p>
        </div>
        <Link 
          to="/admin/subjects/new"
          className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
        >
          <Plus size={18} />
          Add Subject
        </Link>
      </header>

      {/* Advanced Filters Bar */}
      <div className="card-base p-4 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search subject name or code..."
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            value={filters.department_id}
            onChange={e => setFilters({...filters, department_id: e.target.value, course_id: ''})}
            className="flex-1 lg:w-48 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-600 outline-none appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select 
            disabled={!filters.department_id}
            value={filters.course_id}
            onChange={e => setFilters({...filters, course_id: e.target.value})}
            className="flex-1 lg:w-48 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-600 outline-none appearance-none disabled:opacity-50"
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="flex-1 lg:w-32 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-600 outline-none appearance-none"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="p-6">Subject Details</th>
                  <th className="p-6">Department & Course</th>
                  <th className="p-6">Semester</th>
                  <th className="p-6">Assigned Staff</th>
                  <th className="p-6">Students</th>
                  <th className="p-6">Health</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <Link to={`/admin/subjects/${subject.id}`} className="text-sm font-bold text-black hover:underline block">
                            {subject.name}
                          </Link>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subject.code} • {subject.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-600">{subject.department_name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{subject.course_name}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold text-slate-600">Sem {subject.semester}</span>
                    </td>
                    <td className="p-6">
                      {subject.staff_name ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${subject.staff_name}`} alt="" />
                          </div>
                          <span className="text-xs font-bold text-black">{subject.staff_name}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">{(subject as any).student_count || 0}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Att.</span>
                            <span className="text-[10px] font-bold text-emerald-600">84%</span>
                          </div>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/subjects/${subject.id}`)}
                          className="p-2 text-slate-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all"
                        >
                          <ArrowUpRight size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card-base p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-black">No subjects found</h3>
          <p className="text-sm text-slate-400 font-medium mt-2 max-w-sm">
            {filters.search || filters.department_id || filters.course_id 
              ? "Try adjusting your filters to find what you're looking for."
              : "Start by creating your first subject to manage academic allocations."}
          </p>
          {!filters.search && !filters.department_id && !filters.course_id && (
            <Link 
              to="/admin/subjects/new"
              className="mt-8 px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Subject
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
