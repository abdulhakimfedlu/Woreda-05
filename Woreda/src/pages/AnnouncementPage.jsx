import React, { useState, useEffect, useRef } from 'react';
import {
  Bell, Clock, Tag, Search, ChevronRight, AlertCircle,
  Info, CheckCircle, X, Calendar, ArrowUpRight, Megaphone,
  Briefcase, Users, Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ─── Category config ─────────────────────────────────────────────────────────
// DB value → display config. DB values (Urgent/Team/Work) are unchanged.

const CATEGORIES = {
  Urgent: {
    label:  { en: 'Community Events', am: 'የማህበረሰብ ዝግጅቶች' },
    desc:   {
      en: 'Public campaigns, meetings, and participatory calls — stay engaged with your community.',
      am: 'ህዝባዊ ዘመቻዎች፣ ስብሰባዎች እና ተሳትፎ ጥሪዎች — ከማህበረሰብዎ ጋር ተያያዙ።'
    },
    color:  'text-[#0077B6]',
    bg:     'bg-[#00B4D8]/10',
    border: 'border-[#00B4D8]/30',
    accent: 'bg-[#00B4D8]',
    lightAccent: 'bg-[#00B4D8]/10',
    badgeText: 'text-[#0077B6]',
    icon:   Globe,
  },
  Team: {
    label:  { en: 'Staff Meetings', am: 'የሰራተኛ ስብሰባዎች' },
    desc:   {
      en: 'Internal employee meetings and coordination updates for Woreda 05 staff.',
      am: 'ለወረዳ 05 ሠራተኞች ውስጣዊ ስብሰባዎች እና የቅንጅት ዝማኔዎች።'
    },
    color:  'text-blue-600',
    bg:     'bg-blue-50',
    border: 'border-blue-200/60',
    accent: 'bg-blue-500',
    lightAccent: 'bg-blue-50',
    badgeText: 'text-blue-600',
    icon:   Users,
  },
  Work: {
    label:  { en: 'Job News', am: 'የሥራ ዜና' },
    desc:   {
      en: 'This section is for job seekers. Whenever we have open positions, they will be posted here.',
      am: 'ይህ ክፍል ለሥራ ፈላጊዎች የሚሆን ነው። ማንኛቸውም ክፍት የሥራ ቦታዎች ሲኖሩ እዚህ ይለጠፋሉ።'
    },
    color:  'text-indigo-600',
    bg:     'bg-indigo-50',
    border: 'border-indigo-200/60',
    accent: 'bg-indigo-500',
    lightAccent: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    icon:   Briefcase,
  },
};

const STATUS_CONFIG = {
  active:    { label: { en: 'Active',     am: 'ንቁ'       }, classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60' },
  urgent:    { label: { en: 'Urgent',     am: 'አስቸኳይ'   }, classes: 'bg-red-100 text-red-700 border border-red-200/60' },
  resolved:  { label: { en: 'Resolved',   am: 'የተፈታ'    }, classes: 'bg-slate-100 text-slate-500 border border-slate-200/60' },
  Published: { label: { en: 'Published',  am: 'የታተመ'    }, classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60' },
  Draft:     { label: { en: 'Draft',      am: 'ረቂቅ'      }, classes: 'bg-amber-100 text-amber-700 border border-amber-200/60' },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const AnnouncementModal = ({ announcement, onClose, language }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!announcement) return null;

  const cat    = CATEGORIES[announcement.category] || CATEGORIES.Urgent;
  const status = STATUS_CONFIG[announcement.status] || { label: { en: announcement.status, am: announcement.status }, classes: 'bg-slate-100 text-slate-600' };
  const Icon   = cat.icon;
  const title   = language === 'am' && announcement.titleAm   ? announcement.titleAm   : announcement.title;
  const content = language === 'am' && announcement.contentAm ? announcement.contentAm : announcement.content;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
    >
      <div className="bg-white dark:bg-[#111827] w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl dark:shadow-brand/10 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        {/* Aqua top bar */}
        <div className={`h-1.5 w-full ${cat.accent} shrink-0`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-5 border-b border-black/8 dark:border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${cat.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${cat.color}`} />
            </div>
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${status.classes}`}>
                  {status.label[language] || status.label.en}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cat.lightAccent} ${cat.badgeText}`}>
                  <Tag className="inline w-2.5 h-2.5 mr-0.5" />
                  {cat.label[language] || cat.label.en}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {announcement.createdAt
                  ? new Date(announcement.createdAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'N/A'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-white/30 dark:hover:text-white dark:hover:bg-white/5 transition-all shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tighter leading-snug">{title}</h2>
          <div className={`h-0.5 w-16 ${cat.accent} rounded-full`} />
          <p className="text-base text-black/60 dark:text-white/50 font-medium leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-7 py-5 border-t border-black/8 dark:border-white/8 flex justify-end">
          <button
            onClick={onClose}
            className="px-7 py-3 rounded-2xl bg-black dark:bg-white/10 dark:hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            {language === 'am' ? 'ዝጋ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

const AnnouncementCard = ({ announcement, index, onViewMore, language, t }) => {
  const cat    = CATEGORIES[announcement.category] || CATEGORIES.Urgent;
  const status = STATUS_CONFIG[announcement.status] || { label: { en: announcement.status, am: announcement.status }, classes: 'bg-slate-100 text-slate-600' };
  const Icon   = cat.icon;

  const title   = language === 'am' && announcement.titleAm   ? announcement.titleAm   : announcement.title;
  const content = language === 'am' && announcement.contentAm ? announcement.contentAm : announcement.content;
  const preview = content && content.length > 140 ? content.slice(0, 140).trimEnd() + '…' : content;

  return (
    <article
      className={`group relative bg-white dark:bg-[#0d1420] rounded-3xl border ${cat.border} dark:border-opacity-40 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${cat.accent} rounded-l-3xl`} />

      <div className="pl-7 pr-7 pt-7 pb-6">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${cat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 ${cat.color}`} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${status.classes}`}>
                {status.label[language] || status.label.en}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cat.lightAccent} ${cat.badgeText} flex items-center gap-1`}>
                <Tag className="w-2.5 h-2.5" />{cat.label[language] || cat.label.en}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-black text-black/20 dark:text-white/20 tabular-nums shrink-0 mt-0.5">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-black dark:text-white leading-snug mb-3 tracking-tight group-hover:text-[#00B4D8] transition-colors">
          {title}
        </h3>

        {/* Preview */}
        <p className="text-sm text-black/50 dark:text-white/40 font-medium leading-relaxed mb-6">{preview}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-black/25 dark:text-white/25 uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            {announcement.createdAt
              ? new Date(announcement.createdAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A'}
          </span>

          <button
            onClick={() => onViewMore(announcement)}
            className={`group/btn flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${cat.lightAccent} ${cat.badgeText} hover:shadow-lg hover:-translate-y-0.5`}
          >
            {language === 'am' ? 'ሙሉ ዝርዝር' : 'Read More'}
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Category Description Banner ─────────────────────────────────────────────

const CategoryBanner = ({ categoryKey, language }) => {
  if (!categoryKey || categoryKey === 'all') return null;
  const cat = CATEGORIES[categoryKey];
  if (!cat) return null;
  const Icon = cat.icon;
  return (
    <div className={`flex items-start gap-4 px-6 py-5 rounded-2xl ${cat.bg} dark:bg-[#0d1420] border ${cat.border} dark:border-white/8 mb-8 transition-all duration-300`}>
      <div className={`w-10 h-10 rounded-xl bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm shrink-0 mt-0.5`}>
        <Icon className={`w-5 h-5 ${cat.color}`} />
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cat.badgeText}`}>
          {cat.label[language] || cat.label.en}
        </p>
        <div className={`w-10 h-0.5 ${cat.accent} rounded-full mb-2`} />
        <p className="text-sm font-medium text-black/60 dark:text-white/40 leading-relaxed">
          {cat.desc[language] || cat.desc.en}
        </p>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:5000/api/announcements')
      .then(res => res.json())
      .then(data => { setAnnouncements(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { console.error(err); setAnnouncements([]); setLoading(false); });
  }, []);

  const filters = [
    { id: 'all',    label: language === 'am' ? 'ሁሉም'                : 'All' },
    { id: 'Urgent', label: language === 'am' ? 'የማህበረሰብ ዝግጅቶች' : 'Community Events' },
    { id: 'Team',   label: language === 'am' ? 'የሰራተኛ ስብሰባዎች'    : 'Staff Meetings' },
    { id: 'Work',   label: language === 'am' ? 'የሥራ ዜና'              : 'Job News' },
  ];

  const localizedAnnounce = language === 'am' ? 'ማስታወቂያዎች' : 'Announce';
  const localizedUpdates = language === 'am' ? 'እና ዜናዎች' : '& Updates';

  const filtered = announcements.filter(a => {
    if (!a) return false;
    const q = search.toLowerCase();
    const matchesSearch =
      (a.title   || '').toLowerCase().includes(q) ||
      (a.titleAm || '').toLowerCase().includes(q) ||
      (a.content   || '').toLowerCase().includes(q) ||
      (a.contentAm || '').toLowerCase().includes(q);
    const matchesFilter = activeFilter === 'all' || (a.category || 'Urgent') === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white dark:bg-[#080d14] min-h-screen pt-4 pb-40 lg:pt-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── Hero Header ── */}
        <div className="text-center mb-14 pt-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00B4D8]/10 text-[#0077B6] text-[10px] font-black uppercase tracking-[0.35em] mb-6">
            <Megaphone className="w-3.5 h-3.5" />
            {language === 'am' ? 'ወረዳ 05' : 'Woreda 05'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-tight mb-4 tracking-tighter">
            {language === 'am' ? 'ማስታወቂያዎች' : 'Announce'}
            <br />
            <span className="relative inline-block">
              {language === 'am' ? 'እና ዜናዎች' : '& Updates'}
              <span
                className="absolute left-0 -bottom-2 w-full rounded-full"
                style={{ height: '6px', background: 'linear-gradient(90deg,#00B4D8 0%,#90E0EF 50%,#00B4D8 100%)', boxShadow: '0 0 16px rgba(0,180,216,0.6)', borderRadius: '999px', display: 'block' }}
              />
            </span>
          </h1>
          <p className="text-base text-black/40 dark:text-white/40 font-bold max-w-xl mx-auto mt-6">
            {language === 'am'
              ? 'ከወረዳ 05 የሚወጡ የቅርብ ጊዜ መረጃዎችን፣ ዝግጅቶችን እና ይፋዊ ማስታወቂያዎችን ይከታተሉ።'
              : 'Stay informed with the latest updates, events, and official communications from Woreda 05.'}
          </p>
        </div>

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-black/30 group-focus-within:text-[#00B4D8] transition-colors" />
            </div>
            <input
              type="text"
              placeholder={language === 'am' ? 'ማስታወቂያ ፈልግ...' : 'Search announcements...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl text-sm font-bold text-black dark:text-white placeholder:text-black/25 dark:placeholder:text-white/20 focus:bg-white dark:focus:bg-[#0d1420] focus:border-[#00B4D8] focus:shadow-[0_0_30px_rgba(0,180,216,0.12)] transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide -mx-1 px-1 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 sm:flex-wrap">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === f.id
                    ? 'bg-[#00B4D8] text-white shadow-lg shadow-[#00B4D8]/25'
                    : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:bg-[#00B4D8]/10 hover:text-[#0077B6] dark:hover:bg-brand/20 dark:hover:text-brand'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category Description Banner ── */}
        <CategoryBanner categoryKey={activeFilter} language={language} />

        {/* ── Results count ── */}
        {!loading && (
          <p className="text-[10px] font-black uppercase tracking-widest text-black/25 dark:text-white/20 mb-6">
            {filtered.length} {language === 'am' ? 'ውጤቶች' : 'results'}
          </p>
        )}

        {/* ── Cards ── */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#00B4D8]/20 border-t-[#00B4D8] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-black text-black/20 dark:text-white/20 uppercase tracking-widest">
              {language === 'am' ? 'ማስታወቂያዎችን በመጫን ላይ...' : 'Loading announcements...'}
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-5">
            {filtered.map((a, i) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                index={i}
                language={language}
                t={t}
                onViewMore={setSelectedAnnouncement}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-black/15 dark:text-white/10" />
            </div>
            <p className="text-xl font-black text-black/20 dark:text-white/20 uppercase tracking-widest">
              {language === 'am' ? 'ምንም ማስታወቂያ አልተገኘም' : 'No announcements found'}
            </p>
          </div>
        )}

      </div>

      {/* ── Detail Modal ── */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          language={language}
          t={t}
        />
      )}
    </div>
  );
};

export default AnnouncementPage;
