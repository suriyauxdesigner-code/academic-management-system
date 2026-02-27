import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Building2, 
  Users, 
  Mail, 
  ArrowLeft,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, cn } from '../types';

export default function AddDepartment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setStaff] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active',
    hod_id: '',
    attendance_threshold: 75,
    academic_year_start: '2025-08-01',
    email_alias: ''
  });

  useEffect(() => {
    fetch('/api/users?role=staff')
      .then(res => res.json())
      .then(setStaff);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          description: formData.description,
          hod_id: formData.hod_id || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/admin/departments/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHOD = staff.find(s => s.id.toString() === formData.hod_id);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/departments" className="hover:text-black transition-colors">Departments</Link>
          <ChevronRight size={12} />
          <span className="text-black">Create</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Create Department</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Set up a new institutional department and assign leadership.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/departments')}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.code}
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
              Save Department
            </button>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: Basic Information */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                <Building2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department Code *</label>
                <input 
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. CSE-101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe the department's focus and objectives..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex items-center gap-3 ml-1">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    formData.status === 'active' ? "bg-black" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    formData.status === 'active' ? "right-1" : "left-1"
                  )} />
                </button>
                <span className="text-sm font-bold text-slate-600">
                  Status: <span className={formData.status === 'active' ? "text-emerald-600" : "text-slate-400"}>{formData.status === 'active' ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Assign HOD */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Assign Head of Department (HOD)</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Select Staff Member</label>
                <select 
                  value={formData.hod_id}
                  onChange={e => setFormData({...formData, hod_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none"
                >
                  <option value="">Assign later</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              {selectedHOD && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHOD.name}`} alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-black">{selectedHOD.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Mail size={12} />
                        {selectedHOD.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Building2 size={12} />
                        {selectedHOD.department_name || 'General'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    <CheckCircle2 size={12} />
                    Selected
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* SECTION 3: Initial Configuration */}
          <div className="card-base p-8">
            <h3 className="text-lg font-bold text-black mb-6">Initial Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Attendance Threshold (%)</label>
                <div className="relative">
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance_threshold}
                    onChange={e => setFormData({...formData, attendance_threshold: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Academic Year Start</label>
                <input 
                  type="date"
                  value={formData.academic_year_start}
                  onChange={e => setFormData({...formData, academic_year_start: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department Email Alias</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email"
                    value={formData.email_alias}
                    onChange={e => setFormData({...formData, email_alias: e.target.value})}
                    placeholder="cse.dept@academia.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
            <h4 className="text-sm font-bold mb-2">Pro Tip</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assigning an HOD now will automatically grant them administrative access to this department's reports and staff management.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
