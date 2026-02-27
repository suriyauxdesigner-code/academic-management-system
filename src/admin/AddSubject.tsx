import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Save,
  Users,
  Clock,
  Layout,
  FileText
} from 'lucide-react';
import { Department, Course, User, cn } from '../types';

export default function AddSubject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department_id: '',
    course_id: '',
    semester: '',
    credits: 3,
    type: 'core',
    staff_id: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetch('/api/departments').then(res => res.json()).then(setDepartments);
    fetch('/api/users?role=staff').then(res => res.json()).then(setStaff);
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      fetch(`/api/courses?department_id=${formData.department_id}`)
        .then(res => res.json())
        .then(setCourses);
    } else {
      setCourses([]);
    }
  }, [formData.department_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: parseInt(formData.course_id),
          staff_id: formData.staff_id ? parseInt(formData.staff_id) : null,
          semester: parseInt(formData.semester),
          credits: parseInt(formData.credits.toString())
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/admin/subjects/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating subject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id.toString() === formData.course_id);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/admin/subjects" className="hover:text-black transition-colors">Subjects</Link>
          <ChevronRight size={12} />
          <span className="text-black">Create</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Create Subject</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Define a new academic subject and allocate resources.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/subjects')}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.code || !formData.course_id || !formData.semester}
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
              Save Subject
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
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Subject Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Subject Code *</label>
                <input 
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. CS201"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department *</label>
                <select 
                  required
                  value={formData.department_id}
                  onChange={e => setFormData({...formData, department_id: e.target.value, course_id: ''})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Course *</label>
                <select 
                  required
                  disabled={!formData.department_id}
                  value={formData.course_id}
                  onChange={e => setFormData({...formData, course_id: e.target.value, semester: ''})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none disabled:opacity-50"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Semester *</label>
                <select 
                  required
                  disabled={!formData.course_id}
                  value={formData.semester}
                  onChange={e => setFormData({...formData, semester: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none disabled:opacity-50"
                >
                  <option value="">Select Semester</option>
                  {selectedCourse && Array.from({ length: selectedCourse.total_semesters }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Credits</label>
                <input 
                  type="number"
                  value={formData.credits}
                  onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Subject Type</label>
                <div className="flex gap-2">
                  {['core', 'elective', 'lab'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, type: t})}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider",
                        formData.type === t ? "bg-black text-white border-black" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Staff Assignment */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Staff Assignment</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Primary Instructor</label>
                <select 
                  value={formData.staff_id}
                  onChange={e => setFormData({...formData, staff_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none"
                >
                  <option value="">Select Instructor</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Teaching Hours / Week</label>
                <input 
                  type="number"
                  placeholder="e.g. 4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Description */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold text-black">Description & Outline</h3>
            </div>
            <textarea 
              rows={6}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Provide a detailed outline of the subject curriculum..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-base p-8">
            <h3 className="text-lg font-bold text-black mb-6">Academic Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Attendance Threshold (%)</label>
                <div className="relative">
                  <input 
                    type="number"
                    defaultValue={75}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">Allow Late Submissions</span>
                <button
                  type="button"
                  className="w-12 h-6 bg-black rounded-full relative transition-all"
                >
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-all" />
                </button>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-700">Relational Check</p>
                <p className="text-[10px] text-blue-500 mt-1 leading-relaxed">
                  This subject will be automatically mapped to all students currently enrolled in {selectedCourse?.name || 'the selected course'} for Semester {formData.semester || 'X'}.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
            <div className="flex items-center gap-3 mb-4">
              <Layout size={20} className="text-slate-400" />
              <h4 className="text-sm font-bold">ERP Tip</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assigning a primary instructor now will automatically grant them access to manage attendance and assignments for this subject.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
