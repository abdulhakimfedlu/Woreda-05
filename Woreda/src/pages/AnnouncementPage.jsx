import React, { useState, useEffect } from 'react';
import { Bell, Clock, Tag, Search, ChevronRight, AlertCircle, Info, CheckCircle } from 'lucide-react';

const typeConfig = {
  info: { icon: Info, color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200/50' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/50' },
};

const statusBadge = {
  active: { label: 'Active', classes: 'bg-emerald-100 text-emerald-700' },
  urgent: { label: 'Urgent', classes: 'bg-red-100 text-red-700' },
  resolved: { label: 'Resolved', classes: 'bg-slate-100 text-slate-500' },
  Published: { label: 'Published', classes: 'bg-emerald-100 text-emerald-700' },
  Draft: { label: 'Draft', classes: 'bg-amber-100 text-amber-700' },
};

const AnnouncementCard = ({ announcement, index }) => {
  const type = announcement.status === 'Urgent' ? 'warning' : 'info';
  const cfg = typeConfig[type] || typeConfig.info;
  const Icon = cfg.icon;
  const badge = statusBadge[announcement.status] || { label: announcement.status, classes: 'bg-slate-100 text-slate-600' };

  return (
    <div
      className={`group relative bg-white rounded-3xl border ${cfg.border} p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 transition-all duration-500`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Number */}
      <div className="absolute top-5 right-6 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
        <span className="text-[11px] font-black text-black/30">{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${badge.classes}`}>
              {badge.label}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-brand/5 text-brand text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" /> News
            </span>
          </div>
          <h3 className="text-lg font-black text-black leading-snug group-hover:text-brand transition-colors">
            {announcement.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-black/50 font-medium leading-relaxed mb-6">
        {announcement.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-black text-black/25 uppercase tracking-widest">
          <Clock className="w-3 h-3" /> {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'}
        </span>
        <button className="flex items-center gap-1 text-[11px] font-black text-brand uppercase tracking-widest hover:gap-2 transition-all duration-300">
          Read More <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          console.error("Malformed announcement data:", data);
          setAnnouncements([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching announcements:", err);
        setAnnouncements([]);
        setLoading(false);
      });
  }, []);

  const filters = ['all', 'active', 'urgent', 'Published', 'Draft'];

  const filtered = announcements.filter(a => {
    if (!a) return false;
    const matchesSearch =
      (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.content || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || (a.status || '').toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white min-h-screen pt-4 pb-40 lg:pt-8">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14 pt-4">
          <div className="inline-block px-6 py-2 rounded-full bg-brand/10 text-brand font-black text-[10px] uppercase tracking-[0.4em] mb-6">
            Woreda 05 Official
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black leading-tight mb-4 tracking-tighter">
            Announcements
            <br />
            <span className="relative inline-block">
              & Notices
              <span
                className="absolute left-0 -bottom-2 w-full rounded-full"
                style={{
                  height: '6px',
                  background: 'linear-gradient(90deg, #00B4D8 0%, #90E0EF 50%, #00B4D8 100%)',
                  boxShadow: '0 0 16px rgba(0,180,216,0.6)',
                  borderRadius: '999px',
                  display: 'block'
                }}
              />
            </span>
          </h1>
          <p className="text-base text-black/40 font-bold max-w-xl mx-auto mt-6">
            Stay informed with the latest updates, notices, and official communications from Woreda 05.
          </p>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-black/30 group-focus-within:text-brand transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/5 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl text-sm font-bold text-black placeholder:text-black/25 focus:bg-white focus:border-brand focus:shadow-[0_0_30px_rgba(0,180,216,0.12)] transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === f
                    ? 'bg-brand text-white shadow-lg shadow-brand/25'
                    : 'bg-black/5 text-black/40 hover:bg-brand/10 hover:text-brand'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-6 mb-10">
          {[
            { label: 'Total', count: announcements.length },
            { label: 'Published', count: announcements.filter(a => a && (a.status || '').toLowerCase() === 'published').length },
            { label: 'Draft', count: announcements.filter(a => a && (a.status || '').toLowerCase() === 'draft').length },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-2xl font-black text-black tracking-tighter">{stat.count}</span>
              <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
           <div className="py-24 text-center">
            <p className="text-xl font-black text-black/20 uppercase tracking-widest animate-pulse">Loading announcements...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filtered.map((a, i) => (
              <AnnouncementCard key={a.id} announcement={a} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Bell className="w-12 h-12 text-black/10 mx-auto mb-4" />
            <p className="text-xl font-black text-black/20 uppercase tracking-widest">No announcements found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnnouncementPage;
