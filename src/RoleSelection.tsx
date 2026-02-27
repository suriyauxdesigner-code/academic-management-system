import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Users, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function RoleSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('academia_remembered_role');
    if (savedRole) {
      // Optional: Auto-redirect if user chose to remember role
      // navigate(`/${savedRole}/login`);
    }
  }, [navigate]);

  const roles = [
    {
      id: 'admin',
      title: 'Academic Admin',
      description: 'Manage departments, users, academic structure and system configuration.',
      icon: ShieldCheck,
      color: 'bg-black',
      path: '/admin/login'
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Schedule classes, manage attendance, assignments and student performance.',
      icon: Users,
      color: 'bg-black',
      path: '/staff/login'
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Track classes, attendance, assignments and academic progress.',
      icon: BookOpen,
      color: 'bg-black',
      path: '/student/login'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <header className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-xl">
            <GraduationCap size={28} />
          </div>
          <span className="text-3xl font-serif font-bold tracking-tight">AcademiaPro</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
          Welcome to Academic Management System
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Unified Academic Platform
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white border border-black/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:shadow-2xl hover:border-black transition-all cursor-pointer group"
            onClick={() => navigate(role.path)}
          >
            <div className={`w-20 h-20 ${role.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              <role.icon size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-black mb-4">{role.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">
              {role.description}
            </p>
            <button className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-slate-800 transition-colors">
              Continue as {role.id.charAt(0).toUpperCase() + role.id.slice(1)}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <footer className="mt-20 text-slate-400 text-sm font-medium">
        © {new Date().getFullYear()} AcademiaPro. All rights reserved.
      </footer>
    </div>
  );
}
