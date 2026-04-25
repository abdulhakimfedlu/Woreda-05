import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Save, ChevronLeft, Info, FileText, User, Users, Briefcase, Mail, Phone, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function ServiceDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetch(`http://localhost:5000/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      if (res.ok) alert(t('btn_save') === 'አስቀምጥ' ? 'አገልግሎት በተሳካ ሁኔታ ተዘምኗል!' : 'Service updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-slate-300 font-black uppercase tracking-widest animate-pulse">{t('status_loading')}</div>;
  if (!service) return <div className="p-8 text-center bg-red-50 text-red-500 rounded-3xl border border-red-100 font-bold">Service Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-6">
        <Link to="/services" className="inline-flex items-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#00B4D8] transition-colors group">
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
            disabled={saving}
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
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-200/30 border border-slate-50 min-h-[500px]">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('form_service_title_en')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                    value={service.title}
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
                    value={service.department}
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
                      value={service.workingHours}
                      onChange={e => setService({ ...service, workingHours: e.target.value })}
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
                      value={service.officeNo}
                      onChange={e => setService({ ...service, officeNo: e.target.value })}
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
                      value={service.phone}
                      onChange={e => setService({ ...service, phone: e.target.value })}
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
                      value={service.email}
                      onChange={e => setService({ ...service, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[28px] border border-slate-100 mb-10">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden relative group">
                  {service.officerPhoto ? (
                    <img src={service.officerPhoto} alt="Staff" className="w-full h-full object-cover" />
                  ) : (
                    <User size={38} className="text-slate-200" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-[10px] font-black text-white uppercase tracking-widest">{t('btn_edit')}</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-800 text-lg">{service.officerName || t('sd_officer_name')}</h4>
                  <p className="text-xs text-brand font-bold uppercase tracking-widest">{service.officerRole || t('sd_officer_role')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_name')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
                    value={service.officerName}
                    onChange={e => setService({ ...service, officerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_role')}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
                    value={service.officerRole}
                    onChange={e => setService({ ...service, officerRole: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('sd_officer_photo')}</label>
                <input
                  type="text"
                  placeholder="URL to photo"
                  className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
                  value={service.officerPhoto}
                  onChange={e => setService({ ...service, officerPhoto: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 ml-1">{t('form_description_en')}</label>
                <textarea
                  rows="4"
                  className="w-full bg-slate-50/50 border-none rounded-3xl px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-[#00B4D8]/20 focus:bg-white transition-all text-slate-700"
                  value={service.description}
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

              <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <Settings className="w-5 h-5 text-[#00B4D8]" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em]">{t('sd_additional_details')}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('form_popular_service')}</label>
                    <select
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-xs font-bold text-white focus:ring-1 focus:ring-white/20"
                      value={service.isPopular}
                      onChange={e => setService({ ...service, isPopular: e.target.value === 'true' })}
                    >
                      <option value="true">{t('btn_save') === 'አስቀምጥ' ? 'አዎ' : 'Yes'}</option>
                      <option value="false">{t('btn_save') === 'አስቀምጥ' ? 'አይ' : 'No'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('form_category')}</label>
                    <input
                      type="text"
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-xs font-bold text-white"
                      value={service.category}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
