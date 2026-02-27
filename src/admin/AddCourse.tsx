import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  GraduationCap, 
  Building2, 
  Clock, 
  Save,
  BookOpen,
  Layout
} from 'lucide-react';
import { motion } from 'motion/react';
import { Department, cn } from '../types';

export default function AddCourse() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department_id: '',
    duration_years: 4,
    total_semesters: 8,
    description: '',
    status: 'active',
    attendance_threshold: 75
  });

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(setDepartments);
  }, []);

  const handleDurationChange = (years: number) => {
    setFormData({
      ...formData,
      duration_years: years,
      total_semesters: years * 2
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          department_id: parseInt(formData.department_id),
          duration_years: formData.duration_years,
          total_semesters: formData.total_semesters,
          description: formData.description
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/admin/courses/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/courses" className="hover:text-black transition-colors">Courses</Link>
          <ChevronRight size={12} />
          <span className="text-black">Create</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Create Course</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Design a new academic program and define its structure.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.code || !formData.department_id}
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
              Save Course
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
                <GraduationCap size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Course Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Course Code *</label>
                <input 
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. BTECH-CSE"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department *</label>
                <select 
                  required
                  value={formData.department_id}
                  onChange={e => setFormData({...formData, department_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Duration (Years)</label>
                <select 
                  value={formData.duration_years}
                  onChange={e => handleDurationChange(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none"
                >
                  {[1, 2, 3, 4, 5].map(y => (
                    <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the course curriculum and objectives..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Structure Setup */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                <Layout size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Academic Structure Setup</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Total Semesters</label>
                  <input 
                    type="number"
                    value={formData.total_semesters}
                    onChange={e => setFormData({...formData, total_semesters: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Attendance Threshold (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.attendance_threshold}
                      onChange={e => setFormData({...formData, attendance_threshold: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Semester Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Array.from({ length: formData.total_semesters }).map((_, i) => (
                    <div key={i} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 text-center">
                      Semester {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-base p-8">
            <h3 className="text-lg font-bold text-black mb-6">Program Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">Active Enrollment</span>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'archived' : 'active'})}
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
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <p className="text-xs font-bold text-emerald-700">Ready for Launch</p>
                <p className="text-[10px] text-emerald-500 mt-1 leading-relaxed">
                  All required fields are filled. You can save this course and start adding subjects immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={20} className="text-slate-400" />
              <h4 className="text-sm font-bold">Curriculum Tip</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard degree programs usually follow a 2-semester per year structure. Ensure your total semesters align with the duration for consistency.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
