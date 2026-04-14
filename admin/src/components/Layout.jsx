import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Server, Image as ImageIcon, LogOut, Bell, Search, Settings, FileText, Menu, X, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

// Shared hook for unread message count
function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages/unread-count');
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      // Silently fail — don't crash the UI if backend is temporarily unavailable
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return unreadCount;
}

function SidebarContent({ onNavClick, unreadCount }) {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav_dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav_announcements'), path: '/announcements', icon: Megaphone },
    { name: t('nav_services'), path: '/services', icon: Server },
    { name: t('nav_service_content'), path: '/service-details', icon: FileText },
    { name: t('nav_gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav_messages'), path: '/messages', icon: Mail },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center text-white shadow-lg shadow-[#00B4D8]/30 shrink-0">
            <LayoutDashboard strokeWidth={2.5} size={18} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">Woreda <span className="text-[#00B4D8]">05</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t('nav_management')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 mt-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-4">{t('nav_main_menu')}</p>
          <nav className="space-y-1.5 font-bold">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={`flex items-center px-4 py-3 text-sm rounded-2xl transition-all duration-200 group relative ${
                    isActive
                      ? 'text-[#0077B6] bg-[#90E0EF]/30'
                      : 'text-slate-500 hover:text-[#00B4D8] hover:bg-[#90E0EF]/10'
                  }`}
                >
                  <div className={`mr-3 p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white shadow-md text-[#00B4D8]' : 'text-slate-400 group-hover:text-[#00B4D8] group-hover:bg-white group-hover:shadow-sm'}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-tight">{item.name}</span>
                  {item.name === t('nav_messages') && unreadCount > 0 && (
                    <div className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">
                      {unreadCount}
                    </div>
                  )}
                  {isActive && !(item.name === t('nav_messages') && unreadCount > 0) && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#00B4D8] shadow-[0_0_8px_#00B4D8]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100">
        <button className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
          <div className="p-2 rounded-xl mr-3 text-slate-300 group-hover:text-red-500 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          {t('nav_logout')}
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ unreadCount }) {
  return (
    <div className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-100 h-screen fixed left-0 top-0 shadow-xl shadow-slate-200/50 z-20 hidden lg:flex flex-col">
      <SidebarContent unreadCount={unreadCount} />
    </div>
  );
}

export function TopBar({ onMenuClick, unreadCount }) {
  const { t } = useLanguage();
  
  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between px-4 lg:px-10">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:text-[#00B4D8] hover:bg-[#90E0EF]/10 transition-all mr-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search - hidden on small screens */}
      <div className="relative hidden md:block flex-1 max-w-sm lg:max-w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <input
          type="text"
          placeholder={t('search_quick_placeholder') || "Quick search everything..."}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
        />
      </div>

      {/* Mobile brand name */}
      <div className="lg:hidden flex-1">
        <p className="text-sm font-black text-slate-800 tracking-tighter">Woreda <span className="text-[#00B4D8]">05</span></p>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <LanguageSwitcher />
        <a
          href="/messages"
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-[#00B4D8] hover:bg-[#90E0EF]/10 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-white text-[8px] flex items-center justify-center font-black text-white px-1">
              {unreadCount}
            </span>
          )}
        </a>
        <button className="hidden sm:block p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Settings className="w-5 h-5" />
        </button>
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
      </div>
    </header>
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
