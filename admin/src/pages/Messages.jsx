import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, User, Phone, Calendar, Inbox, Clock, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { confirmToast } from '../utils/toast-utils';
import toast from 'react-hot-toast';

const SideSheet = ({ m, onClose, onDelete, onMarkRead, t }) => {
  if (!m) return null;
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 lg:pl-64" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 border-l border-slate-100 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-brand/10 text-brand'}`}>
               <Mail size={20} />
             </div>
             <div>
               <h3 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase tracking-widest">{m.isAnonymous ? t('msg_anonymous_feedback') : t('msg_citizen_report')}</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                  <Clock size={12} /> {new Date(m.createdAt).toLocaleString()}
               </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('msg_subject')}</h4>
             <p className="text-xl font-black text-slate-800 tracking-tighter leading-tight">{m.topic}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('msg_contact_detail')}</p>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Phone size={14} className="text-brand" />
                  {m.isAnonymous ? t('msg_confidential') : (m.contactInfo || 'N/A')}
               </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('msg_origin')}</p>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User size={14} className="text-brand" />
                  {m.isAnonymous ? t('msg_origin_anon') : t('msg_origin_verified')}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('msg_table_type') || 'Type'}</p>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  {m.messageType === 'General' ? (t('msg_type_general_label') || 'General') : (t('msg_type_service_label') || 'Service-Related')}
               </div>
            </div>
            {m.serviceCategory && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('msg_category_label') || 'Category'}</p>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-700 truncate">
                    {m.serviceCategory}
                 </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-brand rounded-full" />
               <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('msg_message_content')}</h4>
            </div>
            <div className="bg-white rounded-2xl p-6 text-sm font-medium text-slate-600 leading-relaxed border border-slate-100 shadow-sm whitespace-pre-wrap">
              {m.description}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <button 
             onClick={() => onDelete(m.id)}
             className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
           >
             <Trash2 size={16} /> {t('msg_delete_forever')}
           </button>
           {!m.isRead && (
             <button 
               onClick={() => onMarkRead(m.id)}
               className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
             >
               <CheckCircle size={16} /> {t('msg_mark_processed')}
             </button>
           )}
        </div>
      </div>
    </>
  );
};

export function Messages() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await confirmToast(t('msg_confirm_delete'));
    if (!confirmed) return;
    try {
      await fetch(`http://localhost:5000/api/messages/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success(t('status_removed') || 'Message deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/messages/${id}/read`, { 
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      if (selected?.id === id) setSelected(prev => ({ ...prev, isRead: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMessage = (m) => {
    setSelected(m);
    if (!m.isRead) {
      handleMarkRead(m.id);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-160px)] flex flex-col">
      {/* Ultra-Slim Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <div className="flex items-center gap-4">
             <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase tracking-widest">{t('msg_inbox')}</h2>
             <div className="flex items-center gap-2">
               <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">{messages.length}</span>
               <span className="px-2.5 py-1 rounded-full bg-brand/10 text-[10px] font-black text-brand border border-brand/20">
                 {messages.filter(m => !m.isRead).length} {t('msg_unread')}
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-2 flex-wrap">
             <select 
               value={typeFilter} 
               onChange={(e) => {
                 setTypeFilter(e.target.value);
                 if (e.target.value !== 'Service-Related') setCategoryFilter('All');
               }}
               className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:border-brand"
             >
               <option value="All">{t('msg_filter_all') || 'All'}</option>
               <option value="General">{t('msg_type_general_label') || 'General'}</option>
               <option value="Service-Related">{t('msg_type_service_label') || 'Service-Related'}</option>
             </select>
             
             {typeFilter === 'Service-Related' && (
               <select 
                 value={categoryFilter} 
                 onChange={(e) => setCategoryFilter(e.target.value)}
                 className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:border-brand"
               >
                 <option value="All">{t('msg_category_label') || 'Category'} ({t('msg_filter_all') || 'All'})</option>
                 {Array.from(new Set(messages.filter(m => m.messageType === 'Service-Related' && m.serviceCategory).map(m => m.serviceCategory))).map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
             )}
           </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
           <button onClick={fetchMessages} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors">{t('msg_refresh')}</button>
        </div>
      </div>

      {/* Standardized Dense Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-50">
             <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('msg_syncing')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10">
             <Inbox size={32} className="text-slate-100 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{t('msg_no_messages')}</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-50 z-10">
                <tr>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors">{t('msg_table_type')}</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors">{t('msg_table_subject')}</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors hidden md:table-cell">{t('msg_table_snippet')}</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors text-right">{t('msg_table_received')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {messages.filter(m => {
                  if (typeFilter !== 'All' && m.messageType !== typeFilter) return false;
                  if (typeFilter === 'Service-Related' && categoryFilter !== 'All' && m.serviceCategory !== categoryFilter) return false;
                  return true;
                }).map((m) => (
                  <tr 
                    key={m.id} 
                    onClick={() => handleSelectMessage(m)}
                    className={`group cursor-pointer hover:bg-slate-50/80 transition-all ${!m.isRead ? 'bg-brand/[0.02]' : ''}`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${!m.isRead ? 'bg-brand' : 'bg-transparent'}`} />
                         <span className={`text-[9px] font-black uppercase tracking-tighter ${m.isAnonymous ? 'text-slate-400' : 'text-brand'}`}>
                            {m.isAnonymous ? t('msg_type_anon') : t('msg_type_citizen')}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-3.5">
                       <span className={`tracking-tight ${!m.isRead ? 'font-black text-slate-800' : 'font-bold text-slate-500'}`}>
                         {m.topic}
                       </span>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                       <p className="text-slate-400 truncate max-w-sm font-medium">{m.description}</p>
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                       <span className="text-[10px] font-bold text-slate-300 font-mono">
                         {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side Sheet Detail View */}
      <SideSheet 
        m={selected} 
        onClose={() => setSelected(null)} 
        onDelete={handleDelete}
        onMarkRead={handleMarkRead}
        t={t}
      />
    </div>
  );
}

export default Messages;
