import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Server, Image as ImageIcon, LogOut, Bell, Search, Settings, FileText } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Services', path: '/services', icon: Server },
    { name: 'Service Content', path: '/service-details', icon: FileText },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  ];

  return (
    <div className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-100 h-screen flex flex-col fixed left-0 top-0 shadow-xl shadow-slate-200/50 z-20">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center text-white shadow-lg shadow-[#00B4D8]/30">
            <LayoutDashboard strokeWidth={2.5} size={18} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">Woreda <span className="text-[#00B4D8]">05</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Management</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 mt-4 space-y-6">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-4">Main Menu</p>
          <nav className="space-y-1.5 font-bold">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
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
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#00B4D8] shadow-[0_0_8px_#00B4D8]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <button className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
          <div className="p-2 rounded-xl mr-3 text-slate-300 group-hover:text-red-500 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          Log Out
        </button>
      </div>
    </div>
  );
}

export function TopBar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between px-10">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <input 
          type="text" 
          placeholder="Quick search everything..." 
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-[#00B4D8] hover:bg-[#90E0EF]/10 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer group rounded-2xl hover:bg-slate-50 p-1.5 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 tracking-tight">Admin User</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-2xl border-2 border-white overflow-hidden shadow-lg shadow-slate-200 group-hover:shadow-[#00B4D8]/20 transition-all">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=00B4D8&color=fff&size=64&bold=true" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex relative font-sans selection:bg-[#90E0EF] selection:text-[#0077B6]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-10 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
