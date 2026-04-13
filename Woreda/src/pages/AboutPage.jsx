import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Users, Target, Building } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 bg-brand/10 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
            <span className="text-[11px] font-black tracking-[0.2em] text-brand uppercase">{t('about_who')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight mb-6">
            {t('about_title').split(' ')[0]} <span className="text-brand">{t('about_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {t('about_desc')}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-slate-50 p-10 rounded-[2.5rem] hover:shadow-[0_20px_40px_-15px_rgba(0,180,216,0.15)] transition-all duration-500 group border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand transition-colors duration-500">
              <Target className="w-8 h-8 text-brand group-hover:text-white transition-colors duration-500" />
            </div>
            <h2 className="text-3xl font-black text-black mb-4">{t('about_mission')}</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              {t('about_mission_desc')}
            </p>
          </div>

          <div className="bg-slate-50 p-10 rounded-[2.5rem] hover:shadow-[0_20px_40px_-15px_rgba(0,180,216,0.15)] transition-all duration-500 group border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand transition-colors duration-500">
              <ShieldCheck className="w-8 h-8 text-brand group-hover:text-white transition-colors duration-500" />
            </div>
            <h2 className="text-3xl font-black text-black mb-4">{t('about_vision')}</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              {t('about_vision_desc')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
