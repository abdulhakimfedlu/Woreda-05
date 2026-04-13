import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, User, Phone, Calendar, Inbox, Clock, X, MessageCircle } from 'lucide-react';

const SideSheet = ({ m, onClose, onDelete, onMarkRead }) => {
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
               <h3 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase tracking-widest">{m.isAnonymous ? 'Anonymous Feedback' : 'Citizen Report'}</h3>
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
             <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Subject</h4>
             <p className="text-xl font-black text-slate-800 tracking-tighter leading-tight">{m.topic}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Detail</p>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Phone size={14} className="text-brand" />
                  {m.isAnonymous ? 'Confidential' : (m.contactInfo || 'N/A')}
               </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Origin</p>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User size={14} className="text-brand" />
                  {m.isAnonymous ? 'Portal (Anon)' : 'Portal (Verified)'}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-brand rounded-full" />
               <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Message Content</h4>
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
             <Trash2 size={16} /> Delete Forever
           </button>
           {!m.isRead && (
             <button 
               onClick={() => onMarkRead(m.id)}
               className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
             >
               <CheckCircle size={16} /> Mark as Processed
             </button>
           )}
        </div>
      </div>
    </>
  );
};

export function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages');
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
    if (!window.confirm('Confirm permanent deletion?')) return;
    try {
      await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/messages/${id}/read`, { method: 'PATCH' });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      if (selected?.id === id) setSelected({ ...selected, isRead: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-160px)] flex flex-col">
      {/* Ultra-Slim Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
           <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase tracking-widest">Inbox</h2>
           <div className="flex items-center gap-2">
             <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">{messages.length}</span>
             <span className="px-2.5 py-1 rounded-full bg-brand/10 text-[10px] font-black text-brand border border-brand/20">
               {messages.filter(m => !m.isRead).length} Unread
             </span>
           </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
           <button onClick={fetchMessages} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors">Refresh Feed</button>
        </div>
      </div>

      {/* Standardized Dense Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-50">
             <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Communications...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10">
             <Inbox size={32} className="text-slate-100 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Clean Slate — No Pending Messages</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-50 z-10">
                <tr>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors">Type</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors">Subject</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors hidden md:table-cell">Snippet</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-300 uppercase tracking-widest transition-colors text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {messages.map((m) => (
                  <tr 
                    key={m.id} 
                    onClick={() => setSelected(m)}
                    className={`group cursor-pointer hover:bg-slate-50/80 transition-all ${!m.isRead ? 'bg-brand/[0.02]' : ''}`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${!m.isRead ? 'bg-brand' : 'bg-transparent'}`} />
                         <span className={`text-[9px] font-black uppercase tracking-tighter ${m.isAnonymous ? 'text-slate-400' : 'text-brand'}`}>
                            {m.isAnonymous ? 'Anon' : 'Citizen'}
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
      />
    </div>
  );
}

export default Messages;
