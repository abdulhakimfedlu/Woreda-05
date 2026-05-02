import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, CheckCircle, XCircle, Users, Crown, KeyRound, Eye, EyeOff, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { confirmToast } from '../utils/toast-utils';
import toast from 'react-hot-toast';
import { Modal } from '../components/Modal';

export function ManageAdmins() {
  const { t } = useLanguage();
  const { admin: currentAdmin, authFetch } = useAuth();
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [transferTarget, setTransferTarget] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    canAddAdmins: false,
    canDeleteAdmins: false,
    canEditAdmins: false,
    canManageAdmins: true,
    canManageAnnouncements: false,
    canManageServices: false,
    canManageCategories: false,
    canManageGallery: false,
    canViewDashboard: false,
    messageAccess: 'None'
  });

  const fetchAdmins = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error(err);
      toast.error(t('status_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdmin) {
      fetchAdmins();
    }
  }, [currentAdmin]);

  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email || '',
        canAddAdmins: admin.canAddAdmins,
        canDeleteAdmins: admin.canDeleteAdmins,
        canEditAdmins: admin.canEditAdmins,
        canManageAdmins: admin.canManageAdmins,
        canManageAnnouncements: admin.canManageAnnouncements || false,
        canManageServices: admin.canManageServices || false,
        canManageCategories: admin.canManageCategories || false,
        canManageGallery: admin.canManageGallery || false,
        canViewDashboard: admin.canViewDashboard || false,
        messageAccess: admin.messageAccess || 'None'
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        username: '',
        email: '',
        canAddAdmins: false,
        canDeleteAdmins: false,
        canEditAdmins: false,
        canManageAdmins: true,
        canManageAnnouncements: false,
        canManageServices: false,
        canManageCategories: false,
        canManageGallery: false,
        canViewDashboard: false,
        messageAccess: 'None'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const openTransferModal = (admin) => {
    setTransferTarget(admin);
    setIsTransferModalOpen(true);
  };

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) return toast.error(t('admin_mgmt_req_username'));
    if (!formData.email) return toast.error("Email is required for Clerk authentication");

    toast.loading(t('status_saving'), { id: 'save_admin' });
    
    try {
      const url = editingAdmin 
        ? `http://localhost:5000/api/admins/${editingAdmin.id}`
        : 'http://localhost:5000/api/admins';
        
      const method = editingAdmin ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.msg || 'Operation failed');

      toast.success(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully', { id: 'save_admin' });
      fetchAdmins();
      closeModal();
    } catch (err) {
      toast.error(err.message, { id: 'save_admin' });
    }
  };

  const handleDelete = async (id) => {
    const adminToDelete = admins.find(a => a.id === id);
    if (adminToDelete?.isPrimary) return toast.error(t('admin_mgmt_delete_primary_err'));
    
    if (id === currentAdmin.id) return toast.error(t('admin_mgmt_delete_self_err'));
    
    const confirmed = await confirmToast(`Are you sure you want to permanently remove this administrator?`);
    if (!confirmed) return;

    try {
      const res = await authFetch(`http://localhost:5000/api/admins/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Delete failed');
      
      setAdmins(admins.filter(a => a.id !== id));
      toast.success(t('status_removed'));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTransferPrimary = async (e) => {
    e.preventDefault();
    if (!transferTarget) return;

    toast.loading(t('status_transferring'), { id: 'transfer_primary' });
    try {
      const res = await authFetch(`http://localhost:5000/api/admins/${transferTarget.id}/transfer-primary`, {
        method: 'POST',
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to transfer ownership');

      toast.success(t('status_transfer_success'), { id: 'transfer_primary' });
      setIsTransferModalOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.message, { id: 'transfer_primary' });
    }
  };

  const isFullPrivileges = (admin) => admin.canAddAdmins && admin.canDeleteAdmins && admin.canEditAdmins && admin.canManageAdmins;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Shield size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
               {t('admin_mgmt_title')}
            </h1>
            <p className="text-xs font-bold text-slate-400 capitalize">
               {t('admin_mgmt_subtitle')}
            </p>
          </div>
        </div>
        
        {currentAdmin?.canAddAdmins && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            {t('admin_mgmt_add_btn')}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-50">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('status_loading')}</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users size={32} className="text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-800 mb-2">{t('admin_mgmt_no_data')}</p>
            <button onClick={() => openModal()} className="text-indigo-500 font-bold hover:underline">
               {t('admin_mgmt_add_btn')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin_mgmt_table_user')}</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin_mgmt_table_role')}</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin_mgmt_table_added')}</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('admin_mgmt_table_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs uppercase">
                           {admin.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                             {admin.username}
                             {admin.isPrimary && <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] uppercase tracking-widest">{t('admin_mgmt_badge_primary')}</span>}
                             {admin.id === currentAdmin.id && <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] uppercase tracking-widest">{t('admin_mgmt_badge_you')}</span>}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={10} /> {admin.email || 'No email assigned'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {admin.isPrimary ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                           <CheckCircle size={12} /> {t('admin_mgmt_role_primary')}
                         </span>
                      ) : isFullPrivileges(admin) ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                           <Shield size={12} /> {t('admin_mgmt_role_full')}
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                           <Users size={12} /> {t('admin_mgmt_role_custom')}
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentAdmin?.isPrimary && !admin.isPrimary && (
                            <button 
                              onClick={() => openTransferModal(admin)}
                              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                              title={t('admin_mgmt_transfer_title')}
                            >
                              <Crown size={16} />
                            </button>
                        )}
                        {currentAdmin?.canEditAdmins && !admin.isPrimary && (
                            <button 
                              onClick={() => openModal(admin)}
                              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                              title={t('btn_edit')}
                            >
                              <Edit2 size={16} />
                            </button>
                        )}
                        {currentAdmin?.canDeleteAdmins && !admin.isPrimary && admin.id !== currentAdmin.id && (
                          <button 
                            onClick={() => handleDelete(admin.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title={t('btn_delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAdmin ? t('admin_mgmt_modal_edit') : t('admin_mgmt_modal_add')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                 {t('admin_mgmt_lbl_username')}
               </label>
               <input
                 required
                 type="text"
                 value={formData.username}
                 onChange={(e) => setFormData({...formData, username: e.target.value})}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                 placeholder="username"
               />
             </div>

             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                 Email Address (Must match Clerk account)
               </label>
               <div className="relative">
                 <input
                   required
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                   placeholder="email@example.com"
                 />
                 <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300">
                   <Mail size={16} />
                 </div>
               </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
               {t('admin_mgmt_lbl_perms')}
             </label>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {[
                 { key: 'canViewDashboard', label: 'Dashboard Access' },
                 { key: 'canManageAnnouncements', label: 'Announcements' },
                 { key: 'canManageServices', label: 'Services' },
                 { key: 'canManageCategories', label: 'Categories' },
                 { key: 'canManageGallery', label: 'Gallery' },
                 { key: 'canManageAdmins', label: t('admin_mgmt_perm_manage') },
                 { key: 'canAddAdmins', label: t('admin_mgmt_perm_add') },
                 { key: 'canEditAdmins', label: t('admin_mgmt_perm_edit') },
                 { key: 'canDeleteAdmins', label: t('admin_mgmt_perm_delete') }
               ].map((perm) => (
                 <label 
                   key={perm.key} 
                   className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                     formData[perm.key] ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   <span className={`text-xs font-bold ${formData[perm.key] ? 'text-indigo-700' : 'text-slate-600'}`}>
                     {perm.label}
                   </span>
                   <div 
                     className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                       formData[perm.key] ? 'bg-indigo-500' : 'bg-slate-200'
                     }`}
                   >
                     <div 
                       className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                         formData[perm.key] ? 'translate-x-4' : 'translate-x-0'
                       }`}
                     />
                   </div>
                   <input
                     type="checkbox"
                     className="hidden"
                     checked={formData[perm.key]}
                     onChange={() => handleToggle(perm.key)}
                   />
                 </label>
               ))}
             </div>
                  
              <div className="mt-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Permissions</label>
                <select 
                  value={formData.messageAccess}
                  onChange={(e) => setFormData({...formData, messageAccess: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="None">None (Hidden)</option>
                  <option value="General">General Messages Only</option>
                  <option value="Service-Related">Service-Related Messages Only</option>
                  <option value="Both">Both</option>
                </select>
              </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
            >
              {editingAdmin ? t('btn_update') : t('btn_create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Transfer Primary Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title={t('admin_mgmt_transfer_title')}
      >
        <form onSubmit={handleTransferPrimary} className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm font-medium text-amber-800">
              {t('admin_mgmt_transfer_warn')} <span className="font-bold">{transferTarget?.username}</span>. 
              {t('admin_mgmt_transfer_warn_2')}
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsTransferModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200">{t('btn_cancel')}</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all">{t('admin_mgmt_transfer_btn')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
