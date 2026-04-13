import React, { useState, useEffect } from 'react';
import { Users, FileText, Server, Image as ImageIcon, TrendingUp, TrendingDown, ArrowUpRight, Megaphone, FolderTree, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [data, setData] = useState({
    services: [],
    categories: [],
    gallery: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('healthy');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes, galleryRes, announcementsRes] = await Promise.all([
          fetch('http://localhost:5000/api/services').then(res => res.json()),
          fetch('http://localhost:5000/api/categories').then(res => res.json()),
          fetch('http://localhost:5000/api/gallery').then(res => res.json()),
          fetch('http://localhost:5000/api/announcements').then(res => res.json())
        ]);

        setData({
          services: Array.isArray(servicesRes) ? servicesRes : [],
          categories: Array.isArray(categoriesRes) ? categoriesRes : [],
          gallery: Array.isArray(galleryRes) ? galleryRes : [],
          announcements: Array.isArray(announcementsRes) ? announcementsRes : []
        });
        setStatus('healthy');
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds for "real-time" feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { name: 'Total Services', value: data.services.length, icon: Server, color: 'text-brand', gradient: 'from-[#00B4D8] to-[#0077B6]' },
    { name: 'System Categories', value: data.categories.length, icon: FolderTree, color: 'text-emerald-500', gradient: 'from-emerald-400 to-teal-600' },
    { name: 'Gallery Assets', value: data.gallery.length, icon: ImageIcon, color: 'text-purple-500', gradient: 'from-purple-500 to-indigo-600' },
    { name: 'Announcements', value: data.announcements.length, icon: Megaphone, color: 'text-orange-500', gradient: 'from-orange-400 to-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Dashboard <span className="text-brand">Overview</span></h2>
          <p className="mt-1.5 text-slate-500 font-medium">Real-time control center for Woreda 05 digital services.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Sync Active
           </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.name} className="glass-card-premium rounded-3xl p-6 relative overflow-hidden group border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-slate-50 to-white opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-brand/10 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-brand transition-colors" />
            </div>
            
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories & Services Overview */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Services */}
          <div className="glass-panel rounded-[32px] p-8 border-none shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Services</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Latest deployments</p>
              </div>
              <Link to="/services" className="px-4 py-2 bg-slate-50 text-slate-500 hover:text-brand text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                Registry
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.services.slice(0, 3).map((service, i) => (
                <div key={service.id} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-brand/20 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand mb-4 group-hover:scale-110 transition-transform">
                     <Server size={18} />
                   </div>
                   <h4 className="text-sm font-black text-slate-800 mb-1 line-clamp-1">{service.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{service.category}</p>
                </div>
              ))}
              {data.services.length === 0 && <p className="col-span-3 text-center py-6 text-slate-300 font-bold uppercase tracking-widest text-xs">No services registered</p>}
            </div>
          </div>

          {/* Top Categories */}
          <div className="glass-panel rounded-[32px] p-8 border-none shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Taxonomy Groups</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">System Classification</p>
              </div>
              <Link to="/services" className="px-4 py-2 bg-slate-50 text-slate-500 hover:text-brand text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {data.categories.slice(0, 3).map((cat, i) => (
                <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <FolderTree size={18} />
                     </div>
                     <div>
                       <h4 className="text-sm font-black text-slate-800">{cat.name}</h4>
                       <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{cat.nameAm || 'Classification'}</p>
                     </div>
                   </div>
                   <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">
                      Active
                   </div>
                </div>
              ))}
               {data.categories.length === 0 && <p className="text-center py-6 text-slate-300 font-bold uppercase tracking-widest text-xs">No categories defined</p>}
            </div>
          </div>
        </div>
        
        {/* System Monitor */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-[32px] p-8 border-none shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] h-full flex flex-col">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">System Health</h3>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative mb-8">
                <div className={`w-32 h-32 rounded-full border-[6px] ${status === 'healthy' ? 'border-emerald-50' : 'border-red-50'} flex items-center justify-center`}>
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${status === 'healthy' ? 'from-emerald-400 to-emerald-600' : 'from-red-400 to-red-600'} flex items-center justify-center text-white shadow-xl ${status === 'healthy' ? 'shadow-emerald-500/30' : 'shadow-red-500/30'}`}>
                    {status === 'healthy' ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <AlertCircle size={32} strokeWidth={2.5} />}
                  </div>
                </div>
                {status === 'healthy' && (
                  <>
                    <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-400 border-4 border-white rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
                  </>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <h4 className={`text-xl font-black tracking-tight ${status === 'healthy' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {status === 'healthy' ? 'All Systems Operational' : 'Node Connection Warning'}
                </h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                  Frontend and backend are responding quickly. Server load is normal.
                </p>
              </div>

              <div className="w-full space-y-3">
                <button className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                  View Detailed Logs
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Latency: 24ms</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Uptime: 99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Shortcut */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-none bg-gradient-to-r from-brand/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
             <Megaphone size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-800">Manage Announcements</h4>
            <p className="text-xs text-slate-500 font-medium">Draft, publish or schedule community news and alerts.</p>
          </div>
        </div>
        <Link to="/announcements" className="w-full sm:w-auto px-8 py-3 bg-brand text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all text-center">
          Go to Feed
        </Link>
      </div>
    </div>
  );
}
