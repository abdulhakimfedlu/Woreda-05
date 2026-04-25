import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Plus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: t('nav_dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav_announcements'), href: '/announcements', icon: Megaphone },
    { name: t('nav_services'), href: '/services', icon: Server },
    { name: t('nav_gallery'), href: '/gallery', icon: ImageIcon },
    { name: t('nav_messages'), href: '/messages', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

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
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ${location.pathname === item.href ? 'opacity-40' : ''}`} />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-50 space-y-3">
          <div className="p-5 rounded-3xl bg-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Bell size={18} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 tracking-tight truncate">{t('nav_admin_user')}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('nav_super_admin')}</p>
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
              <NavLink key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-6 text-3xl font-black text-slate-800 tracking-tighter">
                <item.icon size={32} className="text-brand" /> {item.name}
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
              <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center font-black text-xs shadow-lg shadow-brand/20 ring-4 ring-brand/5">
                A
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
        </button >
        <div className="hidden sm:block h-8 w-[1px] bg-slate-100 mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer group rounded-2xl hover:bg-slate-50 p-1.5 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 tracking-tight">{t('nav_admin_user')}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('nav_super_admin')}</p>
          </div>
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl border-2 border-white overflow-hidden shadow-lg shadow-slate-200 group-hover:shadow-[#00B4D8]/20 transition-all">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=00B4D8&color=fff&size=64&bold=true" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div >
    </header >
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = useUnreadCount();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#90E0EF] selection:text-[#0077B6]">

      {/* Desktop Sidebar */}
      <Sidebar unreadCount={unreadCount} />

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-40 flex flex-col lg:hidden transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <p className="text-lg font-black text-slate-800 tracking-tighter">Woreda <span className="text-[#00B4D8]">05</span></p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent onNavClick={() => setMobileOpen(false)} unreadCount={unreadCount} />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-screen flex flex-col lg:pl-64">
        <TopBar onMenuClick={() => setMobileOpen(true)} unreadCount={unreadCount} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
          <div className="w-full max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
