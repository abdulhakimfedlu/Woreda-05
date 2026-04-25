import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Target } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#080d14] pt-24 pb-16 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 bg-brand/10 dark:bg-brand/15 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span className="text-[11px] font-black tracking-[0.2em] text-brand uppercase">{t('about_who')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tight mb-6">
            {t('about_title').split(' ')[0]}{' '}
            <span className="text-brand">{t('about_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-lg text-black/50 dark:text-white/40 font-medium leading-relaxed">
            {t('about_desc')}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            { icon: Target, title: t('about_mission'), desc: t('about_mission_desc') },
            { icon: ShieldCheck, title: t('about_vision'), desc: t('about_vision_desc') },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-black/3 dark:bg-[#0d1420] p-10 rounded-[2.5rem] hover:shadow-[0_20px_40px_-15px_rgba(0,180,216,0.15)] transition-all duration-500 group border border-black/5 dark:border-white/8"
            >
              <div className="w-16 h-16 bg-white dark:bg-[#111827] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand transition-colors duration-500">
                <Icon className="w-8 h-8 text-brand group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-3xl font-black text-black dark:text-white mb-4">{title}</h2>
              <p className="text-black/50 dark:text-white/40 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
