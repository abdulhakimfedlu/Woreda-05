



import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CtaSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-black dark:bg-[#0a0f1a] relative overflow-hidden mx-6 sm:mx-12 mb-24 rounded-[4rem] border dark:border-white/5">
      <div className="absolute top-0 right-0 w-full h-full opacity-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-8 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-8">
          {t('home_cta_title')}
        </h2>
        <p className="text-xl md:text-2xl text-white/40 font-black uppercase tracking-tight mb-12 max-w-3xl mx-auto">
          {t('home_cta_desc')}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/gallery"
            className="px-10 py-5 bg-brand text-white rounded-2xl font-black text-lg hover:bg-white hover:text-black transition-all duration-500 active:scale-95 shadow-xl shadow-brand/20"
          >
            {t('home_cta_btn_gallery')}
          </Link>
          <Link
            to="/announcements"
            className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/10 rounded-2xl font-black text-lg transition-all duration-500 active:scale-95"
          >
            {t('home_cta_btn_ann')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
