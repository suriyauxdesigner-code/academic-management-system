import React from 'react';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  LogOut, 
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  Menu,
  X,
  Settings,
  Building2,
  Search,
  Bell,
  User as UserIcon,
  Calendar as CalendarIcon,
  FileText,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  Plus,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', roles: ['admin'] },
  { label: 'Departments', icon: Building2, path: '/admin/departments', roles: ['admin'] },
  { label: 'Courses', icon: GraduationCap, path: '/admin/courses', roles: ['admin'] },
  { label: 'Subjects', icon: BookOpen, path: '/admin/subjects', roles: ['admin'] },
  { label: 'Staff', icon: Users, path: '/admin/users', roles: ['admin'] },
  { label: 'Students', icon: Users, path: '/admin/students', roles: ['admin'] },
  { label: 'Calendar', icon: Calendar, path: '/admin/calendar', roles: ['admin'] },
  { label: 'Reports', icon: FileText, path: '/admin/reports', roles: ['admin'] },
  { label: 'Notifications', icon: Bell, path: '/admin/notifications', roles: ['admin'] },
  { label: 'Settings', icon: Settings, path: '/admin/settings', roles: ['admin'] },
  
  { label: 'Dashboard', icon: LayoutDashboard, path: '/staff', roles: ['staff'] },
  { label: 'Classes', icon: Calendar, path: '/staff/classes', roles: ['staff'] },
  { label: 'Assignments', icon: ClipboardList, path: '/staff/assignments', roles: ['staff'] },
  
  { label: 'Dashboard', icon: LayoutDashboard, path: '/student', roles: ['student'] },
  { label: 'My Classes', icon: Calendar, path: '/student/classes', roles: ['student'] },
  { label: 'Assignments', icon: ClipboardList, path: '/student/assignments', roles: ['student'] },
  { label: 'Attendance', icon: CheckCircle2, path: '/student/attendance', roles: ['student'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user?.role || ''));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get current page title
  const currentItem = sidebarItems.find(item => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.label : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-300 relative",
          isSidebarCollapsed ? "w-20" : "w-[240px]"
        )}
      >
        <div className="p-6">
          <div className={cn("flex items-center gap-2 mb-8", isSidebarCollapsed && "justify-center")}>
            <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            {!isSidebarCollapsed && <span className="font-bold text-lg text-black tracking-tight">AcademiaPro</span>}
          </div>

          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "sidebar-link",
                  location.pathname === item.path ? "sidebar-link-active" : "sidebar-link-inactive",
                  isSidebarCollapsed && "justify-center px-0"
                )}
                title={isSidebarCollapsed ? item.label : ""}
              >
                <item.icon size={18} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className={cn("flex items-center gap-3", isSidebarCollapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black truncate">{user?.name || 'shadcn'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">v1.0.4</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className={cn(
              "w-full mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-black transition-colors",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-black shadow-sm z-30"
        >
          <ChevronDown size={14} className={cn("transition-transform", isSidebarCollapsed ? "-rotate-90" : "rotate-90")} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Home</span>
              <ChevronDown size={12} className="-rotate-90" />
              <span className="text-black">{pageTitle}</span>
            </div>
          </div>

          {/* Global Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search student, staff, subject..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-black transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-black">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lg:hidden fixed inset-0 bg-white z-40 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="font-bold text-lg text-black">AcademiaPro</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "sidebar-link",
                    location.pathname === item.path ? "sidebar-link-active" : "sidebar-link-inactive"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-bold">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
