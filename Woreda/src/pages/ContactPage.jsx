import React, { useState, useEffect } from 'react';
import { Send, Phone, MessageSquare, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    topic: '', description: '', contactInfo: '',
    isAnonymous: false, messageType: 'General', serviceCategory: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [valErrors, setValErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.topic.trim()) errors.topic = t('contact_val_required');
    if (!formData.description.trim()) errors.description = t('contact_val_required');
    if (formData.messageType === 'Service-Related' && !formData.serviceCategory)
      errors.serviceCategory = t('contact_val_required');
    if (!formData.isAnonymous) {
      if (!formData.contactInfo.trim()) errors.contactInfo = t('contact_val_required');
      else if (!/^\d{10,12}$/.test(formData.contactInfo.trim())) errors.contactInfo = t('contact_val_phone');
    }
    setValErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError(''); setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ topic: '', description: '', contactInfo: '', isAnonymous: false, messageType: 'General', serviceCategory: '' });
      } else {
        const data = await res.json();
        setError(data.msg || t('contact_error'));
      }
    } catch (err) {
      setError(t('contact_error'));
    } finally {
      setLoading(false);
    }
  };

  // Shared input classes
  const inputCls = (err) =>
    `w-full px-6 py-4 bg-black/5 dark:bg-white/5 border-2 rounded-2xl text-sm font-bold text-black dark:text-white placeholder:text-black/25 dark:placeholder:text-white/20 transition-all outline-none focus:bg-white dark:focus:bg-[#0d1420] ${err ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-brand/40'}`;

  return (
    <div className="bg-white dark:bg-[#080d14] min-h-screen pt-4 pb-40 lg:pt-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14 pt-4">
          <div className="inline-block px-6 py-2 rounded-full bg-brand/10 dark:bg-brand/15 text-brand font-black text-[10px] uppercase tracking-[0.4em] mb-6">
            {t('nav_contact')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-tight mb-4 tracking-tighter">
            {t('contact_title').split(' ')[0]} <br />
            <span className="relative inline-block text-brand">
              {t('contact_title').split(' ').slice(1).join(' ')}
              <span className="absolute left-0 -bottom-2 w-full h-1.5 bg-brand/20 rounded-full" />
            </span>
          </h1>
          <p className="text-base text-black/40 dark:text-white/35 font-bold max-w-xl mx-auto mt-6">
            {t('contact_subtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0d1420] rounded-[2.5rem] border border-black/5 dark:border-white/8 shadow-[0_20px_60px_-15px_rgba(0,180,216,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,180,216,0.08)] overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[500px]">

            {/* Info Side — always brand-coloured */}
            <div className="md:w-1/3 bg-brand p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tighter mb-8">{t('contact_info_title')}</h3>
                <div className="space-y-8">
                  {[
                    { icon: Phone, label: t('contact_call'), value: '+251 11 123 4567' },
                    { icon: MessageSquare, label: t('contact_office'), value: t('contact_office_addr') },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{label}</p>
                        <p className="text-sm font-bold">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 relative z-10">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center gap-2 mb-2 text-white">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{t('contact_privacy_title')}</span>
                  </div>
                  <p className="text-[10px] text-white/60 font-medium leading-relaxed">{t('contact_privacy_desc')}</p>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
            </div>

            {/* Form Side */}
            <div className="md:w-2/3 p-10 lg:p-14">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white tracking-tighter mb-4">{t('contact_success').split('!')[0]}!</h3>
                  <p className="text-black/50 dark:text-white/40 font-medium mb-10 max-w-sm">{t('contact_success').split('!')[1] || 'Our team will review it shortly.'}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-4 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand/20 hover:-translate-y-1 hover:shadow-brand/30 transition-all"
                  >
                    {t('contact_btn_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 flex items-center gap-3 text-red-600 text-sm font-bold">
                      <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                    </div>
                  )}

                  {/* Message type toggle */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest ml-1">{t('contact_type')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['General', 'Service-Related'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, messageType: type, serviceCategory: '' })}
                          className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            formData.messageType === type
                              ? 'bg-brand text-white shadow-lg shadow-brand/20'
                              : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                        >
                          {type === 'General' ? t('contact_type_general') : t('contact_type_service')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service category */}
                  {formData.messageType === 'Service-Related' && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2">
                      <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest ml-1">{t('contact_service_cat')}</label>
                      <select
                        value={formData.serviceCategory}
                        onChange={e => setFormData({ ...formData, serviceCategory: e.target.value })}
                        className={inputCls(valErrors.serviceCategory)}
                      >
                        <option value="">{t('contact_select_cat')}</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{language === 'am' && cat.nameAm ? cat.nameAm : cat.name}</option>
                        ))}
                      </select>
                      {valErrors.serviceCategory && <p className="text-[11px] text-red-500 font-bold ml-1">{valErrors.serviceCategory}</p>}
                    </div>
                  )}

                  {/* Topic */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest ml-1">{t('contact_topic')}</label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      placeholder={t('contact_topic_placeholder')}
                      className={inputCls(valErrors.topic)}
                    />
                    {valErrors.topic && <p className="text-[11px] text-red-500 font-bold ml-1">{valErrors.topic}</p>}
                  </div>

                  {/* Phone (only when not anonymous) */}
                  {!formData.isAnonymous && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2">
                      <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest ml-1">{t('contact_phone')}</label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                        placeholder={t('contact_phone_placeholder')}
                        className={inputCls(valErrors.contactInfo)}
                      />
                      {valErrors.contactInfo && <p className="text-[11px] text-red-500 font-bold ml-1">{valErrors.contactInfo}</p>}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest ml-1">{t('contact_description')}</label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t('contact_description_placeholder')}
                      className={`${inputCls(valErrors.description)} resize-none`}
                    />
                    {valErrors.description && <p className="text-[11px] text-red-500 font-bold ml-1">{valErrors.description}</p>}
                  </div>

                  {/* Anonymous toggle */}
                  <div className="flex items-center gap-3 p-4 bg-black/3 dark:bg-white/4 border border-black/5 dark:border-white/8 rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/8">
                    <button
                      type="button"
                      onClick={() => { setFormData({ ...formData, isAnonymous: !formData.isAnonymous }); setValErrors({ ...valErrors, contactInfo: undefined }); }}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.isAnonymous ? 'bg-brand shadow-lg shadow-brand/20' : 'bg-black/15 dark:bg-white/15'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.isAnonymous ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div>
                      <p className="text-xs font-black text-black dark:text-white tracking-tight">{t('contact_anonymous')}</p>
                      <p className="text-[10px] text-black/40 dark:text-white/35 font-bold leading-none mt-1">{t('contact_anonymous_hint')}</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-brand text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-brand/20 hover:-translate-y-1 hover:shadow-brand/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                  >
                    <Send className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                    {loading ? t('contact_sending') : t('contact_btn_send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
