import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  BookOpen,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ClassSession, Subject, User } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function StaffClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    topic: '',
    description: ''
  });

  // Attendance states
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!user) return;
    fetch(`/api/subjects?staff_id=${user.id}`).then(res => res.json()).then(setSubjects);
    fetch(`/api/classes?staff_id=${user.id}`).then(res => res.json()).then(setClasses);
  }, [user]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        subject_id: parseInt(formData.subject_id)
      }),
    });
    if (res.ok) {
      const newClass = await res.json();
      const sub = subjects.find(s => s.id === parseInt(formData.subject_id));
      setClasses([...classes, { ...newClass, subject_name: sub?.name }]);
      setIsModalOpen(false);
      setFormData({ ...formData, topic: '', description: '' });
    }
  };

  const openAttendance = async (cls: ClassSession) => {
    setSelectedClass(cls);
    const sub = subjects.find(s => s.id === cls.subject_id);
    if (!sub) return;
    
    const res = await fetch(`/api/users?role=student`);
    const allStudents: User[] = await res.json();
    // Filter students by course
    const courseStudents = allStudents.filter(s => s.course_id === sub.course_id);
    setStudents(courseStudents);

    const attRes = await fetch(`/api/attendance?class_id=${cls.id}`);
    const existingAtt: any[] = await attRes.json();
    const attMap: Record<number, string> = {};
    existingAtt.forEach(a => attMap[a.student_id] = a.status);
    setAttendance(attMap);
  };

  const markAttendance = async (studentId: number, status: string) => {
    if (!selectedClass) return;
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        class_id: selectedClass.id,
        student_id: studentId,
        status
      }),
    });
    if (res.ok) {
      setAttendance({ ...attendance, [studentId]: status });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Class Management</h1>
          <p className="text-slate-500 font-medium mt-1">Schedule sessions and track student attendance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Schedule Class
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search classes..." 
                  className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                <Filter size={18} />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {classes.length > 0 ? classes.map((cls) => (
                <div key={cls.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <BookOpen size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.subject_name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{cls.topic || 'General Session'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-50">
                        {cls.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{format(new Date(cls.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="text-xs font-bold">Room 302</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => openAttendance(cls)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group/btn"
                    >
                      Mark Attendance
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400">
                  <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold">No classes scheduled yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {selectedClass ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-100 sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Attendance</h2>
                <button onClick={() => setSelectedClass(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Current Session</p>
                <p className="text-sm font-bold text-indigo-900">{selectedClass.subject_name}</p>
              </div>
              
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {students.map(student => (
                  <div key={student.id} className="p-4 rounded-2xl bg-[#F1F4F9]/50 border border-white">
                    <p className="font-bold text-slate-900 text-sm mb-3">{student.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'present', icon: CheckCircle2, color: 'emerald' },
                        { id: 'late', icon: Clock, color: 'amber' },
                        { id: 'absent', icon: XCircle, color: 'red' }
                      ].map(status => (
                        <button
                          key={status.id}
                          onClick={() => markAttendance(student.id, status.id)}
                          className={cn(
                            "py-2 rounded-xl text-[10px] font-bold capitalize transition-all flex flex-col items-center gap-1",
                            attendance[student.id] === status.id
                              ? status.id === 'present' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" :
                                status.id === 'absent' ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-amber-500 text-white shadow-lg shadow-amber-200"
                              : "bg-white text-slate-400 border border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <status.icon size={14} />
                          {status.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {students.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">No students enrolled.</p>}
              </div>
              
              <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Finalize Attendance
              </button>
            </motion.div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50 text-center py-16">
              <Users size={48} className="mx-auto mb-4 text-slate-200" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Mark Attendance</h3>
              <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Select a class from the list to start marking student attendance.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Schedule Class</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Set up a new academic session.</p>

              <form onSubmit={handleSchedule} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Subject</label>
                  <select
                    required
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    className="w-full bg-[#F1F4F9] border-none rounded-2xl py-4 px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#F1F4F9] border-none rounded-2xl py-4 px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-[#F1F4F9] border-none rounded-2xl py-4 px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Topic / Title</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#F1F4F9] border-none rounded-2xl py-4 px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="e.g. Introduction to React"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Schedule Session
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
