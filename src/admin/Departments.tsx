import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Users, 
  BookOpen,
  Filter,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Archive,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { motion } from 'motion/react';
import { Department, cn } from '../types';

export default function AdminDepartments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(setDepartments);
  }, []);

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dept.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Departments</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage institutional departments and monitor their performance.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/departments/new')}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-black/5"
        >
          <Plus size={18} />
          Add Department
        </button>
      </header>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-black/5 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
          <select className="bg-transparent text-xs font-bold text-black outline-none cursor-pointer">
            <option>Alphabetical</option>
            <option>Student Count</option>
            <option>Staff Count</option>
            <option>Created Date</option>
          </select>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Department Name</th>
                <th className="p-6">Code</th>
                <th className="p-6">HOD</th>
                <th className="p-6">Staff</th>
                <th className="p-6">Students</th>
                <th className="p-6">Subjects</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <tr 
                    key={dept.id} 
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/departments/${dept.id}`)}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                          <Building2 size={18} />
                        </div>
                        <span className="text-sm font-bold text-black">{dept.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{dept.code}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dept.hod_name || 'HOD'}`} alt="" />
                        </div>
                        <span className="text-sm font-bold text-black">{dept.hod_name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <GraduationCap size={14} className="text-slate-300" />
                        {Math.floor(Math.random() * 30) + 10}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <Users size={14} className="text-slate-300" />
                        {Math.floor(Math.random() * 500) + 100}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <BookOpen size={14} className="text-slate-300" />
                        {Math.floor(Math.random() * 20) + 5}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        dept.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                      )}>
                        {dept.status || 'active'}
                      </span>
                    </td>
                    <td className="p-6 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/departments/${dept.id}`)}
                          className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                        <Building2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">No departments created yet</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">Start by creating your first institutional department.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/admin/departments/new')}
                        className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                      >
                        <Plus size={18} />
                        Create First Department
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredDepartments.length > 0 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
            <p>Showing {filteredDepartments.length} of {departments.length} departments</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
