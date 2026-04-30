import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Save, ChevronLeft, Info, FileText, User, Users, Mail, Phone, MapPin, Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function ServiceDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { token } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Photo upload states
  const [officerPhotoFile, setOfficerPhotoFile] = useState(null);
  const [officerPhotoUploading, setOfficerPhotoUploading] = useState(false);
  const [bannerPhotoFile, setBannerPhotoFile] = useState(null);
  const [bannerPhotoUploading, setBannerPhotoUploading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/service-details/${id}`)
      .then(res => res.json())
      .then(data => {
        // Flatten the nested details into the service object for easy form binding
        const flat = {
          ...data,
          ...(data.details || {}),
        };
        delete flat.details;
        
        // Ensure requirements are arrays
        flat.requirements = Array.isArray(flat.requirements) ? flat.requirements : [];
        flat.requirementsAm = Array.isArray(flat.requirementsAm) ? flat.requirementsAm : [];
        
        setService(flat);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Upload a file to Cloudinary via the backend and return { url, public_id }
  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json(); // { url, public_id, size }
  };

  const handleOfficerPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10 MB)'); return; }
    setOfficerPhotoFile(file);
    setOfficerPhotoUploading(true);
    try {
      const result = await uploadPhoto(file);
      setService(prev => ({
        ...prev,
        officerPhoto: result.url,
        officerPhotoPublicId: result.public_id,
      }));
      toast.success('Officer photo uploaded!');
    } catch {
      toast.error('Officer photo upload failed');
    } finally {
      setOfficerPhotoUploading(false);
    }
  };

  const handleBannerPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10 MB)'); return; }
    setBannerPhotoFile(file);
    setBannerPhotoUploading(true);
    try {
      const result = await uploadPhoto(file);
      setService(prev => ({
        ...prev,
        bannerPhoto: result.url,
        bannerPhotoPublicId: result.public_id,
      }));
      toast.success('Banner photo uploaded!');
    } catch {
      toast.error('Banner photo upload failed');
    } finally {
      setBannerPhotoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save basic service info
      await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: service.title,
          titleAm: service.titleAm,
          department: service.department,
          departmentAm: service.departmentAm,
          category: service.category,
        })
      });

      // Save service details (officer info, contact, description, banner, etc.)
      const detailsRes = await fetch(`http://localhost:5000/api/service-details/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: service.description,
          descriptionAm: service.descriptionAm,
          requirements: service.requirements,
          requirementsAm: service.requirementsAm,
          officerName: service.officerName,
          officerNameAm: service.officerNameAm,
          officerRole: service.officerRole,
          officerRoleAm: service.officerRoleAm,
          officerPhoto: service.officerPhoto,
          officerPhotoPublicId: service.officerPhotoPublicId,
          contactPhone: service.contactPhone,
          contactEmail: service.contactEmail,
          officeNumber: service.officeNumber,
          hours: service.hours,
          additionalDetails: service.additionalDetails,
          additionalDetailsAm: service.additionalDetailsAm,
          bannerPhoto: service.bannerPhoto,
          bannerPhotoPublicId: service.bannerPhotoPublicId,
        })
      });

      if (detailsRes.ok) {
        toast.success(t('sd_update_success'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('status_error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-slate-300 font-black uppercase tracking-widest animate-pulse">{t('status_loading')}</div>;
  if (!service) return <div className="p-8 text-center bg-red-50 text-red-500 rounded-3xl border border-red-100 font-bold">{t('sd_not_found')}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-6">
        <Link to="/service-details" className="inline-flex items-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#00B4D8] transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          {t('sd_back_to_services')}
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase tracking-widest">
              {language === 'am' && service.titleAm ? service.titleAm : service.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              {t('sd_subtitle')}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || officerPhotoUploading || bannerPhotoUploading}
            className="flex items-center px-8 py-4 bg-[#00B4D8] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t('status_saving') : t('btn_save_changes')}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all ${activeTab === 'general' ? 'bg-white text-[#00B4D8] shadow-lg shadow-slate-200/50 border border-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Info className="w-4 h-4 mr-3" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t('sd_general_info')}</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all ${activeTab === 'staff' ? 'bg-white text-[#00B4D8] shadow-lg shadow-slate-200/50 border border-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Users className="w-4 h-4 mr-3" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t('sd_staff_member')}</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-white text-[#00B4D8] shadow-lg shadow-slate-200/50 border border-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <FileText className="w-4 h-4 mr-3" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t('sd_service_requirements')}</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all ${activeTab === 'media' ? 'bg-white text-[#00B4D8] shadow-lg shadow-slate-200/50 border border-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <ImageIcon className="w-4 h-4 mr-3" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t('sd_banner_photo')}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-200/30 border border-slate-50 min-h-[500px]">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('form_service_title_en')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.title || ''}
                    onChange={e => setService({ ...service, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('form_service_title_am')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700 font-am"
                    value={service.titleAm || ''}
                    onChange={e => setService({ ...service, titleAm: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('form_department_en')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.department || ''}
                    onChange={e => setService({ ...service, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('form_department_am')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.departmentAm || ''}
                    onChange={e => setService({ ...service, departmentAm: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_working_hours')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00B4D8]" />
                    <input
                      type="text"
                      className="w-full bg-slate-50/50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700"
                      value={service.hours || ''}
                      onChange={e => setService({ ...service, hours: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_office_location')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00B4D8]" />
                    <input
                      type="text"
                      className="w-full bg-slate-50/50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700"
                      value={service.officeNumber || ''}
                      onChange={e => setService({ ...service, officeNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_contact_phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00B4D8]" />
                    <input
                      type="text"
                      className="w-full bg-slate-50/50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700"
                      value={service.contactPhone || ''}
                      onChange={e => setService({ ...service, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_contact_email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00B4D8]" />
                    <input
                      type="text"
                      className="w-full bg-slate-50/50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700"
                      value={service.contactEmail || ''}
                      onChange={e => setService({ ...service, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAFF TAB */}
          {activeTab === 'staff' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Officer Photo Preview + Upload */}
              <div className="flex items-end gap-8 p-8 bg-slate-50 rounded-[28px] border border-slate-100">
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
                    {service.officerPhoto ? (
                      <img src={service.officerPhoto} alt="Officer" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-slate-200" />
                    )}
                    {officerPhotoUploading && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-3xl">
                        <span className="text-white text-[10px] font-black uppercase animate-pulse">{t('sd_uploading')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('sd_officer_photo')}</p>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-[#00B4D8] hover:shadow-md transition-all w-fit">
                      <Upload className="w-4 h-4 text-[#00B4D8]" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        {officerPhotoUploading ? t('sd_uploading') : (officerPhotoFile ? officerPhotoFile.name : (service.officerPhoto ? t('sd_change_banner').replace(t('sd_banner_photo'), t('sd_officer_photo')) : t('sd_upload_banner').replace(t('sd_banner_photo'), t('sd_officer_photo'))))}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleOfficerPhotoUpload}
                        disabled={officerPhotoUploading}
                      />
                    </label>
                    {service.officerPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setService(prev => ({ ...prev, officerPhoto: null, officerPhotoPublicId: null }));
                          setOfficerPhotoFile(null);
                        }}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-transparent hover:border-red-100"
                        title={t('btn_delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_name')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
                    value={service.officerName || ''}
                    onChange={e => setService({ ...service, officerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_role')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
                    value={service.officerRole || ''}
                    onChange={e => setService({ ...service, officerRole: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_name')} (አማርኛ)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 font-am"
                    value={service.officerNameAm || ''}
                    onChange={e => setService({ ...service, officerNameAm: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_role')} (አማርኛ)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 font-am"
                    value={service.officerRoleAm || ''}
                    onChange={e => setService({ ...service, officerRoleAm: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('form_description_en')}</label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50/50 border-none rounded-3xl px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.description || ''}
                    onChange={e => setService({ ...service, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('form_description_am')}</label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50/50 border-none rounded-3xl px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700 font-am"
                    value={service.descriptionAm || ''}
                    onChange={e => setService({ ...service, descriptionAm: e.target.value })}
                  />
                </div>
              </div>

              {/* Requirements (English) */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">{t('sd_req_en')}</label>
                  <button
                    type="button"
                    onClick={() => setService({ ...service, requirements: [...(service.requirements || []), ''] })}
                    className="flex items-center text-[10px] font-black text-[#00B4D8] uppercase tracking-widest hover:bg-[#00B4D8]/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {t('sd_add_req')}
                  </button>
                </div>
                <div className="space-y-3">
                  {(service.requirements || []).length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium italic px-2">{t('sd_no_req')}</p>
                  ) : (
                    (service.requirements || []).map((req, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <span className="w-8 h-10 flex border-none items-center justify-center bg-slate-50 rounded-xl text-xs font-black text-slate-400 shrink-0 select-none">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          className="flex-1 bg-slate-50/50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                          value={req}
                          placeholder={t('sd_req_ph')}
                          onChange={e => {
                            const newReqs = [...service.requirements];
                            newReqs[index] = e.target.value;
                            setService({ ...service, requirements: newReqs });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newReqs = [...service.requirements];
                            newReqs.splice(index, 1);
                            setService({ ...service, requirements: newReqs });
                          }}
                          className="w-10 h-10 border-none flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Requirements (Amharic) */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] ml-1">{t('sd_req_am')}</label>
                  <button
                    type="button"
                    onClick={() => setService({ ...service, requirementsAm: [...(service.requirementsAm || []), ''] })}
                    className="flex items-center border-none text-[10px] font-black text-[#00B4D8] uppercase tracking-widest hover:bg-[#00B4D8]/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {t('sd_add_req')}
                  </button>
                </div>
                <div className="space-y-3">
                  {(service.requirementsAm || []).length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium italic px-2">{t('sd_no_req')}</p>
                  ) : (
                    (service.requirementsAm || []).map((req, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <span className="w-8 h-10 border-none flex items-center justify-center bg-slate-50 rounded-xl text-xs font-black text-slate-400 shrink-0 select-none">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          className="flex-1 bg-slate-50/50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700 font-am"
                          value={req}
                          placeholder={t('sd_req_ph')}
                          onChange={e => {
                            const newReqs = [...service.requirementsAm];
                            newReqs[index] = e.target.value;
                            setService({ ...service, requirementsAm: newReqs });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newReqs = [...service.requirementsAm];
                            newReqs.splice(index, 1);
                            setService({ ...service, requirementsAm: newReqs });
                          }}
                          className="w-10 h-10 border-none flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_additional_en')}</label>
                  <textarea
                    rows="3"
                    className="w-full bg-slate-50/50 border-none rounded-3xl px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.additionalDetails || ''}
                    placeholder="Formatting guidelines, extra instructions..."
                    onChange={e => setService({ ...service, additionalDetails: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_additional_am')}</label>
                  <textarea
                    rows="3"
                    className="w-full bg-slate-50/50 border-none rounded-3xl px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700 font-am"
                    value={service.additionalDetailsAm || ''}
                    placeholder="ተጨማሪ መመሪያዎች..."
                    onChange={e => setService({ ...service, additionalDetailsAm: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB — Banner Photo */}
          {activeTab === 'media' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-1">
                  {t('sd_banner_photo')}
                </label>

                {/* Banner preview */}
                {service.bannerPhoto ? (
                  <div className="relative w-full h-52 rounded-3xl overflow-hidden mb-5 border border-slate-100 shadow-lg">
                    <img src={service.bannerPhoto} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-52 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-5 text-slate-300">
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">{t('sd_no_banner')}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-3 px-6 py-4 bg-[#00B4D8] text-white rounded-2xl cursor-pointer hover:bg-[#0077B6] transition-all w-fit shadow-lg shadow-[#00B4D8]/30">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {bannerPhotoUploading ? t('sd_uploading') : (service.bannerPhoto ? t('sd_change_banner') : t('sd_upload_banner'))}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerPhotoUpload}
                      disabled={bannerPhotoUploading}
                    />
                  </label>
                  {service.bannerPhoto && (
                    <button
                      type="button"
                      onClick={() => {
                        setService(prev => ({ ...prev, bannerPhoto: null, bannerPhotoPublicId: null }));
                        setBannerPhotoFile(null);
                      }}
                      className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg shadow-red-500/20"
                      title={t('btn_delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
