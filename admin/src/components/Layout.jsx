import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Server,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  Plus,
  FileText
} from 'lucide-react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useLanguage();
  const { admin, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [];

  if (admin?.canViewDashboard || admin?.isPrimary) {
    navigation.push({ name: t('nav_dashboard'), href: '/', icon: LayoutDashboard });
  }
  if (admin?.canManageAnnouncements || admin?.isPrimary) {
    navigation.push({ name: t('nav_announcements'), href: '/announcements', icon: Megaphone });
  }
  if (admin?.canManageServices || admin?.canManageCategories || admin?.isPrimary) {
    navigation.push({ name: t('nav_services'), href: '/services', icon: Server });
    navigation.push({ name: t('nav_service_details') || 'Service Details', href: '/service-details', icon: FileText });
  }
  if (admin?.canManageGallery || admin?.isPrimary) {
    navigation.push({ name: t('nav_gallery'), href: '/gallery', icon: ImageIcon });
  }
  if (admin?.isPrimary || (admin?.messageAccess && admin.messageAccess !== 'None')) {
    navigation.push({ name: t('nav_messages'), href: '/messages', icon: MessageSquare });
  }
  if (admin?.canManageAdmins || admin?.isPrimary) {
    navigation.push({ name: t('nav_manage_admins'), href: '/manage-admins', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/unread-count', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-white border-r border-slate-100 lg:flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-3.5 mb-10 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00B4D8]/20 group-hover:scale-110 transition-transform duration-300">
              <Server className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">WOREDA <span className="text-[#00B4D8]">05</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{t('nav_management')}</p>
            </div>
          </div>

          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 ml-1">{t('nav_main_menu')}</p>
          <nav className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 group ${isActive
                    ? 'bg-[#E0F2FE] text-[#0077B6] shadow-sm shadow-[#0077B6]/5'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <item.icon size={20} strokeWidth={location.pathname === item.href ? 2.5 : 2} className="shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.href === '/messages' && unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black">{unreadCount}</span>
                )}
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ${location.pathname === item.href ? 'opacity-40' : ''}`} />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-50 space-y-3">
          <div className="p-5 rounded-3xl bg-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative">
              <Bell size={18} className="text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 tracking-tight truncate">{admin?.username || t('nav_admin_user')}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{admin?.id === 1 ? t('nav_super_admin') : 'Admin User'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-6 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t('nav_logout')}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <Server className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tighter">WOREDA <span className="text-brand">05</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-500 bg-slate-50 rounded-xl">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 p-10 flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{t('nav_main_menu')}</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} className="text-slate-300" /></button>
          </div>
          <nav className="space-y-6 flex-1">
            {navigation.map(item => (
              <NavLink key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-3xl font-black text-slate-800 tracking-tighter">
                <div className="flex items-center gap-6">
                  <item.icon size={32} className="text-brand" /> {item.name}
                </div>
                {item.href === '/messages' && unreadCount > 0 && (
                  <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white text-sm font-black shadow-lg shadow-red-500/20">{unreadCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <button onClick={handleLogout} className="mt-auto flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
            <LogOut size={20} /> {t('nav_logout')}
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72 pt-20 lg:pt-0">
        {/* Top Navbar - Search & Switcher */}
        <div className="h-20 bg-white/50 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder={t('search_quick_placeholder')}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center font-black text-xs shadow-lg shadow-brand/20 ring-4 ring-brand/5 uppercase">
                {admin?.username ? admin.username.charAt(0) : 'A'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
