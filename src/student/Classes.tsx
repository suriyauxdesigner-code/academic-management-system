import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin, 
  User,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ClassSession } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function StudentClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassSession[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/classes?student_id=${user.id}`).then(res => res.json()).then(setClasses);
  }, [user]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Schedule</h1>
          <p className="text-slate-500 font-medium mt-1">View your upcoming classes and sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Calendar size={18} />
            Academic Calendar
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by subject or professor..." 
              className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 font-bold text-xs">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length > 0 ? classes.map((cls) => (
            <motion.div 
              key={cls.id}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2.5rem] bg-[#F1F4F9]/50 border border-white hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <BookOpen size={24} />
                </div>
                <span className="px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-50">
                  {cls.time}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{cls.subject_name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">{cls.topic || 'General Session'}</p>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <User size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professor</p>
                    <p className="text-xs font-bold text-slate-700">{cls.staff_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <MapPin size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-xs font-bold text-slate-700">Room 402, Block B</p>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full py-3 bg-white text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-sm">
                View Resources
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )) : (
            <div className="col-span-full bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold">No classes scheduled for your course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
