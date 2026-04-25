import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Calendar } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { confirmToast } from '../utils/toast-utils';
import { useAuth } from '../context/AuthContext';

export function Announcements() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    content: '',
    contentAm: '',
    status: 'Published',
    category: 'Urgent',
    author: 'Admin'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    const confirmed = await confirmToast(t('ann_confirm_delete'));
    if(!confirmed) return;
    try {
      await fetch(`http://localhost:5000/api/announcements/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAnnouncements();
      toast.success(t('status_removed'));
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(t('status_error'));
    }
  };

  const handleEdit = (announcement) => {
    setEditingItem(announcement);
    setFormData({
      title: announcement.title,
      titleAm: announcement.titleAm || '',
      content: announcement.content,
      contentAm: announcement.contentAm || '',
      status: announcement.status,
      category: announcement.category || 'Urgent',
      author: announcement.author
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `http://localhost:5000/api/announcements/${editingItem.id}`
      : 'http://localhost:5000/api/announcements';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ title: '', titleAm: '', status: 'Published', category: 'Urgent', author: 'Admin', content: '', contentAm: '' });
        fetchAnnouncements();
        toast.success(editingItem ? t('ann_alert_updated') : t('ann_alert_created'));
      } else {
        const errorData = await res.json();
        toast.error(`${t('ann_alert_save_failed')} ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(t('ann_alert_server_error'));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{t('ann_title')}</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">{t('ann_subtitle')}</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', titleAm: '', content: '', contentAm: '', status: 'Published', category: 'Urgent', author: 'Admin' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-6 py-3 bg-[#00B4D8] text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('ann_create_news')}
        </button>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }} 
        title={editingItem ? t('ann_update_modal_title') : t('ann_create_modal_title')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('ann_title_en')}</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder={t('ann_placeholder_title')}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">{t('ann_title_am')}</label>
              <input 
                type="text"
                value={formData.titleAm}
                onChange={(e) => setFormData({...formData, titleAm: e.target.value})}
                placeholder={t('ann_placeholder_title_am')}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('ann_content_en')}</label>
            <textarea 
              required
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder={t('ann_placeholder_content')}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">{t('ann_content_am')}</label>
            <textarea 
              rows="4"
              value={formData.contentAm}
              onChange={(e) => setFormData({...formData, contentAm: e.target.value})}
              placeholder={t('ann_placeholder_content_am')}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('ann_status')}</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              >
                <option value="Published">{t('ann_status_published')}</option>
                <option value="Draft">{t('ann_status_draft')}</option>
                <option value="Urgent">{t('ann_status_urgent')}</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('ann_category')}</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              >
                <option value="Urgent">{t('ann_category_urgent')}</option>
                <option value="Team">{t('ann_category_team')}</option>
                <option value="Work">{t('ann_category_work')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('ann_author')}</label>
            <input 
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-[#00B4D8] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-[#00B4D8]/20 hover:bg-[#0077B6] hover:shadow-[#00B4D8]/30 transition-all"
          >
            {editingItem ? t('ann_save_changes') : t('ann_create_entry')}
          </button>
        </form>
      </Modal>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/30">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder={t('ann_search_placeholder')} 
              className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#00B4D8] hover:border-[#00B4D8]/30 transition-all">
            <Filter className="w-3.5 h-3.5 mr-2" /> {t('ann_filter_items')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">{t('ann_table_headline')}</th>
                <th className="px-8 py-4 w-40">{t('ann_table_date')}</th>
                <th className="px-8 py-4 w-32">{t('ann_table_category')}</th>
                <th className="px-8 py-4 w-32">{t('ann_table_status')}</th>
                <th className="px-8 py-4 w-32">{t('ann_table_author')}</th>
                <th className="px-8 py-4 w-32 text-right">{t('ann_table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-300 font-black uppercase tracking-widest animate-pulse">{t('ann_loading')}</td></tr>
              ) : announcements.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-300 font-bold">{t('ann_no_items')}</td></tr>
              ) : announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800 text-sm tracking-tight">{announcement.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{announcement.content}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-slate-500 text-[11px] font-bold">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-[#00B4D8]" />
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      announcement.category === 'Urgent' 
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : announcement.category === 'Team'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {announcement.category === 'Team' ? t('ann_category_team') : announcement.category === 'Work' ? t('ann_category_work') : t('ann_category_urgent')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      announcement.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : announcement.status === 'Urgent'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {announcement.status === 'Draft' ? t('ann_status_draft') : announcement.status === 'Urgent' ? t('ann_status_urgent') : t('ann_status_published')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-tight">
                    {announcement.author}
                  </td>
                  <td className="px-4 sm:px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-slate-400 hover:text-[#00B4D8] hover:bg-[#90E0EF]/20 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteAnnouncement(announcement.id)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
