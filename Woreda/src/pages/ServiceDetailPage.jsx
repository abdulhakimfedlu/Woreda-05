import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OFFICE_BANNER = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:5000/api/service-details/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data && !data.msg) {
          setServiceData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load service", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          {language === 'am' ? 'በመጫን ላይ...' : 'Loading Details...'}
        </p>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-4xl font-black mb-8 text-slate-800">
          {language === 'am' ? 'አገልግሎቱ አልተገኘም' : 'Service Not Found'}
        </h2>
        <Link to="/services" className="text-brand font-black hover:underline uppercase tracking-widest">
          {t('sd_back')}
        </Link>
      </div>
    );
  }

  const service = serviceData;
  const details = service.details || {};
  
  const title = language === 'am' && service.titleAm ? service.titleAm : (service.title || service.name);
  const department = language === 'am' && service.departmentAm ? service.departmentAm : service.department;
  const description = language === 'am' && details.descriptionAm ? details.descriptionAm : details.description;
  const officerName = language === 'am' && details.officerNameAm ? details.officerNameAm : details.officerName;
  const officerRole = language === 'am' && details.officerRoleAm ? details.officerRoleAm : details.officerRole;
  const additionalDetails = language === 'am' && details.additionalDetailsAm ? details.additionalDetailsAm : details.additionalDetails;
  
  const rawRequirements = language === 'am' && Array.isArray(details.requirementsAm) && details.requirementsAm.length > 0 
    ? details.requirementsAm 
    : (Array.isArray(details.requirements) && details.requirements.length > 0 ? details.requirements : null);
    
  const requirements = rawRequirements;

  const hasOfficerInfo = officerName || officerRole || details.officerPhoto;
  const hasContactInfo = details.contactPhone || details.contactEmail;
  const hasLocationHoursInfo = details.officeNumber || details.hours;

  return (
    <div className="bg-white dark:bg-[#080d14] min-h-screen pb-40 transition-colors duration-300">

      {/* ── OFFICE BANNER ──────────────────────────────────────────── */}
      {details.bannerPhoto && (
        <div className="relative w-full h-[360px] md:h-[460px] overflow-hidden">
          <img
            src={details.bannerPhoto}
            alt="Office Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

          {/* Aqua top stripe */}
          <div
            className="absolute top-0 left-0 w-full h-[3px]"
            style={{ background: 'linear-gradient(90deg, #00B4D8 0%, #90E0EF 60%, transparent 100%)' }}
          />

          {/* Back button */}
          <div className="absolute top-8 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-brand/40 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{t('nav_all_services')}</span>
            </button>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/25 border border-brand/40 backdrop-blur-sm mb-4">
              <Shield className="w-3 h-3 text-brand" />
              <span className="text-brand font-black text-[9px] uppercase tracking-[0.3em]">
                {department || service.category} {details.officeNumber && `· ${details.officeNumber}`}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter max-w-3xl">
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* ── ALTERNATIVE HEADER (when no banner) ──────────────────── */}
      {!details.bannerPhoto && (
        <div className="pt-32 pb-16 bg-gradient-to-br from-black/3 dark:from-[#0d1420] to-white dark:to-[#080d14]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Back button */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-3 text-black/30 dark:text-white/30 hover:text-brand transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 flex items-center justify-center group-hover:bg-brand/10 group-hover:border-brand/20 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{t('nav_all_services')}</span>
              </button>
            </div>

            {/* Title */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-6">
              <Shield className="w-3 h-3 text-brand" />
              <span className="text-brand font-black text-[9px] uppercase tracking-[0.3em]">
                {department || service.category} {details.officeNumber && `· ${details.officeNumber}`}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white leading-tight tracking-tighter max-w-3xl">
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* ── OFFICER PROFILE — full width strip below banner ────────── */}
      {hasOfficerInfo && (
        <div className="bg-black/3 dark:bg-[#0d1420] border-b border-black/5 dark:border-white/8">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Large officer photo */}
              {details.officerPhoto && (
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-black/15 shrink-0">
                    <img
                      src={details.officerPhoto}
                      alt={officerName || "Officer"}
                      className="w-full h-full object-cover"
                    />
                </div>
              )}
              
              {/* Officer info */}
              <div className="flex-1 text-center sm:text-left pt-2">
                <p className="text-[10px] font-black text-brand uppercase tracking-[0.35em] mb-2">
                  {t('sd_officer')}
                </p>
                {officerName && (
                  <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter leading-none mb-2">
                    {officerName}
                  </h2>
                )}
                {officerRole && (
                  <p className="text-base font-bold text-black/40 uppercase tracking-widest mb-4">
                    {officerRole}
                  </p>
                )}

                {/* Contact quick-links associated with the Officer/Service */}
                {hasContactInfo && (
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    {details.contactPhone && (
                      <a
                        href={`tel:${details.contactPhone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 hover:bg-brand/20 text-brand text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> {details.contactPhone}
                      </a>
                    )}
                    {details.contactEmail && (
                      <a
                        href={`mailto:${details.contactEmail}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 hover:bg-brand/10 hover:text-brand text-black/50 text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" /> {details.contactEmail}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN BODY ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* LEFT: Overview + Requirements */}
          <div className={`space-y-14 ${!hasLocationHoursInfo && !hasContactInfo ? 'col-span-full' : 'lg:col-span-7'}`}>

            {/* Overview */}
            {description && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-[3px] bg-brand rounded-full" />
                  <h2 className="text-[10px] font-black text-black/35 dark:text-white/30 uppercase tracking-[0.3em]">{t('sd_overview')}</h2>
                </div>
                <p className="text-xl md:text-2xl text-black/55 dark:text-white/45 font-semibold leading-relaxed">
                  {description}
                </p>
              </section>
            )}

            {/* Requirements */}
            {requirements && (
              <section>
                <div className="flex items-center gap-3 mb-7">
                  <span className="w-8 h-[3px] bg-brand rounded-full" />
                  <h2 className="text-[10px] font-black text-black/35 uppercase tracking-[0.3em]">{t('sd_requirements')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {requirements.map((req, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-black/[0.03] dark:bg-white/3 border border-transparent hover:border-brand/20 hover:bg-brand/5 dark:hover:bg-brand/10 transition-all duration-300"
                    >
                      <div className="w-7 h-7 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand/20 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-brand/50 uppercase tracking-widest block mb-0.5">
                          {language === 'am' ? 'ሰነድ' : 'Doc'} {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold text-black/65 dark:text-white/55 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                          {req}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Details */}
            {additionalDetails && (
              <section>
                <div className="flex items-center gap-3 mb-5 mt-10">
                  <span className="w-8 h-[3px] bg-brand rounded-full" />
                  <h2 className="text-[10px] font-black text-black/35 dark:text-white/30 uppercase tracking-[0.3em]">{t('sd_guidelines')}</h2>
                </div>
                <div className="p-6 rounded-3xl bg-black/[0.02] dark:bg-white/3 border border-black/5 dark:border-white/8 text-sm font-bold text-black/60 dark:text-white/40 leading-relaxed whitespace-pre-line">
                  {additionalDetails}
                </div>
              </section>
            )}

            {Object.keys(details).length === 0 && (
              <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <Shield className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-400 tracking-tight">
                  {language === 'am' ? 'ውቅረት በመጠባበቅ ላይ' : 'Configuration Pending'}
                </h3>
                <p className="text-slate-400 mt-2 font-medium">
                  {language === 'am' ? 'የአገልግሎት ዝርዝሮች ገና በአስተዳደሩ አልታተሙም' : 'Service details have not yet been published by the administration.'}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Location + Contact Sidebar (Conditional) */}
          {(hasLocationHoursInfo || hasContactInfo) && (
            <div className="lg:col-span-5 space-y-5">

              {/* Location & Hours */}
              {hasLocationHoursInfo && (
                <div className="rounded-3xl border border-black/5 dark:border-white/8 bg-white dark:bg-[#0d1420] shadow-lg shadow-black/5 dark:shadow-brand/5 overflow-hidden">
                  <div className="px-7 py-4 border-b border-black/5 dark:border-white/8 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/35 dark:text-white/30">{t('sd_location')}</span>
                  </div>
                  <div className="p-7 space-y-6">
                    {details.officeNumber && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-brand" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-black/25 uppercase tracking-[0.2em] mb-1">
                            {language === 'am' ? 'ቢሮ' : 'Office'}
                          </p>
                          <p className="text-base font-black text-black dark:text-white leading-snug">{details.officeNumber}</p>
                          <p className="text-[11px] text-black/30 dark:text-white/30 font-semibold mt-0.5">{t('footer_address')}</p>
                        </div>
                      </div>
                    )}
                    {details.hours && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-brand" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-black/25 uppercase tracking-[0.2em] mb-1">
                            {language === 'am' ? 'ሰዓት' : 'Hours'}
                          </p>
                          <p className="text-base font-black text-black leading-snug">{details.hours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact fallback */}
              {!hasOfficerInfo && hasContactInfo && (
                <div className="rounded-3xl border border-black/5 bg-white shadow-lg shadow-black/5 overflow-hidden">
                  <div className="px-7 py-4 border-b border-black/5 flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-brand" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/35">{t('sd_contact')}</span>
                  </div>
                  <div className="p-7 space-y-3">
                    {details.contactPhone && (
                      <a
                        href={`tel:${details.contactPhone.replace(/\s+/g, '')}`}
                        className="group flex items-center gap-4 p-3.5 rounded-2xl hover:bg-brand/5 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <PhoneCall className="w-3.5 h-3.5 text-brand" />
                        </div>
                        <span className="text-sm font-bold text-black/60 group-hover:text-brand transition-colors flex-1">
                          {details.contactPhone}
                        </span>
                        <ChevronRight className="w-4 h-4 text-black/15 group-hover:text-brand transition-colors" />
                      </a>
                    )}
                    {details.contactEmail && (
                      <a
                        href={`mailto:${details.contactEmail}`}
                        className="group flex items-center gap-4 p-3.5 rounded-2xl hover:bg-brand/5 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-brand" />
                        </div>
                        <span className="text-sm font-bold text-black/60 group-hover:text-brand transition-colors flex-1 truncate">
                          {details.contactEmail}
                        </span>
                        <ChevronRight className="w-4 h-4 text-black/15 group-hover:text-brand transition-colors shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Back button */}
              <Link
                to="/services"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-black/8 dark:border-white/10 text-black/40 dark:text-white/40 hover:border-brand hover:text-brand font-black text-sm uppercase tracking-widest transition-all duration-300"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              >
                <ArrowLeft className="w-4 h-4" /> {t('sd_back')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
