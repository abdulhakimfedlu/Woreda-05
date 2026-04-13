import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Calendar } from 'lucide-react';
import { Modal } from '../components/Modal';

export function Announcements() {
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
    if(!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await fetch(`http://localhost:5000/api/announcements/${id}`, { method: 'DELETE' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting:', error);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ title: '', titleAm: '', status: 'Published', category: 'Urgent', author: 'Admin', content: '', contentAm: '' });
        fetchAnnouncements();
        alert(editingItem ? 'Announcement updated!' : 'Announcement created successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Internal Server Error. Please check if the backend is running.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Announcements</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">Manage News & Updates</p>
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
          Create News
        </button>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }} 
        title={editingItem ? "Update Announcement" : "Create New Announcement"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Title (English)</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Office Closure Notice"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Title (Amharic / አማርኛ)</label>
              <input 
                type="text"
                value={formData.titleAm}
                onChange={(e) => setFormData({...formData, titleAm: e.target.value})}
                placeholder="ለምሳሌ፡ የቢሮ መዘጊያ ማስታወቂያ"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Content (English)</label>
            <textarea 
              required
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Provide detailed announcement details..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Content (Amharic / አማርኛ)</label>
            <textarea 
              rows="4"
              value={formData.contentAm}
              onChange={(e) => setFormData({...formData, contentAm: e.target.value})}
              placeholder="ዝርዝር ማስታወቂያ እዚህ ጋር ይጥቀሱ..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              >
                <option value="Urgent">Urgent</option>
                <option value="Team">Team (Employee News)</option>
                <option value="Work">Work (Job Opps)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Author</label>
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
            {editingItem ? "Save Changes" : "Create News Entry"}
          </button>
        </form>
      </Modal>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/30">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#00B4D8] hover:border-[#00B4D8]/30 transition-all">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter Items
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">Headline</th>
                <th className="px-8 py-4 w-40">Date</th>
                <th className="px-8 py-4 w-32">Category</th>
                <th className="px-8 py-4 w-32">Status</th>
                <th className="px-8 py-4 w-32">Author</th>
                <th className="px-8 py-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-300 font-black uppercase tracking-widest animate-pulse">Loading News...</td></tr>
              ) : announcements.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-300 font-bold">No announcements found in the list</td></tr>
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
                      {announcement.category || 'Urgent'}
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
                      {announcement.status}
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
