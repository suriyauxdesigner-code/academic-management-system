import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { GraduationCap, AlertCircle, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  role: 'admin' | 'staff' | 'student';
}

export default function Login({ role }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberRole, setRememberRole] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('academia_remembered_role');
    if (saved === role) {
      setRememberRole(true);
    }
  }, [role]);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  // 🔥 TEMPORARY LOGIN BYPASS
  if (rememberRole) {
    localStorage.setItem('academia_remembered_role', role);
  } else {
    localStorage.removeItem('academia_remembered_role');
  }

  login({
    id: "1",
    name: "Demo User",
    email: email,
    role: role,
  });

  navigate(`/${role}`);
};

  const roleLabels = {
    admin: 'Academic Admin',
    staff: 'Staff Member',
    student: 'Student'
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[3rem] border border-black/10 p-10 md:p-16 relative z-10"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-black font-bold text-sm mb-12 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Change role
        </Link>

        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl">
            <GraduationCap size={40} />
          </div>
          <div className="inline-flex items-center px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            {roleLabels[role]} Login
          </div>
          <h1 className="text-4xl font-serif font-bold text-black tracking-tight">AcademiaPro</h1>
          <p className="text-slate-400 font-medium mt-2">Sign in to your academic portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email / ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-black focus:ring-0 outline-none transition-all"
                  placeholder="name@academia.edu"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-bold text-black hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold focus:border-black focus:ring-0 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-1">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberRole}
              onChange={(e) => setRememberRole(e.target.checked)}
              className="w-5 h-5 rounded-lg border-black/10 text-black focus:ring-black transition-all cursor-pointer" 
            />
            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Remember my role on this device</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Login'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-slate-400">
            Don't have an account? <a href="#" className="text-black hover:underline">Contact Administration</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
