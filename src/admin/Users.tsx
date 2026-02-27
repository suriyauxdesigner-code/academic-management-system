import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone,
  Filter,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, Department } from '../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
    fetch('/api/departments').then(res => res.json()).then(setDepartments);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Staff & Faculty</h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic and administrative personnel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID or email..." 
              className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 font-bold text-xs">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Name & Role</th>
                <th className="px-8 py-4">Contact Info</th>
                <th className="px-8 py-4">Department</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.filter(u => u.role === 'staff').map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Shield size={10} className="text-indigo-500" />
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Professor</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={12} className="text-slate-300" />
                        <span className="text-xs font-semibold">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={12} className="text-slate-300" />
                        <span className="text-xs font-semibold">+1 (555) 000-0000</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-700">{user.department_name || 'General'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all shadow-sm">
                      <MoreHorizontal size={18} />
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
