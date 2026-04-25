import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ceoImg from '../assets/ceo and ceoit.jpg';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 lg:py-40 bg-white dark:bg-[#080d14] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/5 dark:bg-brand/[0.04] -skew-x-12" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand/10 dark:bg-brand/15 text-brand font-black text-[10px] uppercase tracking-[0.3em] mb-6">
              {t('home_about_subtitle')}
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-[0.95] mb-12 tracking-tighter">
              {t('home_about_title')}
            </h2>
            <p className="text-xl text-black/50 dark:text-white/40 leading-relaxed max-w-xl mb-12 font-medium">
              {t('home_about_desc')}
            </p>
            <Link
              to="/about"
              className="group flex items-center gap-4 text-black dark:text-white font-black text-lg uppercase tracking-tight hover:text-brand transition-colors"
            >
              <span className="stylized-underline decoration-black dark:decoration-white group-hover:decoration-brand pb-1 transition-all">
                {t('btn_read_more')}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:translate-x-2 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="aspect-square bg-black dark:bg-[#111827] rounded-[4rem] relative overflow-hidden group shadow-2xl shadow-black/20 dark:shadow-brand/10 max-w-[500px] mx-auto lg:mx-0">
              <img src={ceoImg} alt="Leadership" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 dark:opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12 text-white">
                <div className="text-6xl font-black leading-none mb-2 tracking-tighter">05</div>
                <div className="text-sm font-black uppercase tracking-[0.4em] opacity-50">Woreda Unit</div>
              </div>
              <div className="absolute -top-20 -right-20 w-64 h-64 border-[40px] border-white/10 rounded-full" />
            </div>

            <div className="absolute -bottom-10 -right-10 bg-white dark:bg-[#111827] shadow-2xl shadow-black/10 dark:shadow-black/40 p-8 rounded-3xl max-w-[240px] z-20 animate-float-calm border dark:border-white/8">
              <div className="text-brand font-black text-4xl mb-1 tracking-tighter">100%</div>
              <div className="text-black/40 dark:text-white/40 font-black text-xs uppercase tracking-widest leading-tight">
                {t('home_stats_efficiency')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
