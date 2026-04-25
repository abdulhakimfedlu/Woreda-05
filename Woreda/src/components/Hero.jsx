import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import abiyImg from '../assets/Abiy ahmed.jpg';
import adanechImg from '../assets/Adanech-Abiebie.png';
import liyaImg from '../assets/Dr Liya.jpg';
import ceo from '../assets/ceo.jpg';
import soldierImg from '../assets/Soldier.webp';
import tayeImg from '../assets/Taye.jpg';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <div className="relative bg-white pt-2 pb-16 lg:pt-4 lg:pb-32 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      {/* High-End Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,180,216,0.08)_0%,transparent_40%)]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Strategic brand glows */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-brand/5 rounded-full blur-[150px]"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32 items-center">

          {/* Main Statement Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 rounded-full bg-brand/10 text-brand font-black text-[10px] uppercase tracking-[0.4em] mb-8"
            >
              {t('hero_welcome')}
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.9] mb-8 tracking-tighter">
              {t('hero_title')} <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="stylized-underline pb-4"
              >
                {t('hero_title_2')}
              </motion.span> <br />
              <span className="text-black/30 block mt-6 leading-none">{t('hero_location')}</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-2xl text-black/40 leading-tight max-w-xl mb-10 font-black uppercase tracking-tight"
            >
              {t('footer_mission')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Link
                to="/services"
                className="inline-block px-10 py-5 bg-white border-2 border-black text-black rounded-2xl font-black text-base shadow-xl hover:bg-brand hover:border-brand hover:text-white hover:-translate-y-1 hover:shadow-brand/30 transition-all duration-500 active:scale-95 leading-none"
              >
                {t('btn_view_all')}
              </Link>
            </motion.div>
          </motion.div>

          {/* 5-Photo Community Grid Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="lg:col-span-6 relative h-[500px] sm:h-[550px] lg:h-[600px] flex items-center justify-center lg:-translate-x-24 mt-16 lg:mt-0"
          >
            <div className="relative w-full h-full flex items-center justify-center animate-float-calm scale-90 sm:scale-95 lg:scale-100">
              {/* Center Photo - Abiy Ahmed (On Top) */}
              <div className="relative z-30 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 shadow-2xl shadow-black/20 border-4 border-white overflow-hidden rounded-2xl shrink-0">
                <img src={abiyImg} alt="PM Abiy Ahmed" className="w-full h-full object-cover" />
              </div>

              {/* Corner Photos - Positioned underneath the center photo */}
              <div className="absolute z-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl -translate-x-[7.5rem] -translate-y-[7.5rem] sm:-translate-x-[9rem] sm:-translate-y-[9rem] lg:-translate-x-[11.2rem] lg:-translate-y-[11.2rem]">
                <img src={adanechImg} alt="Mayor Adanech Abiebie" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl translate-x-[7.5rem] -translate-y-[7.5rem] sm:translate-x-[9rem] -translate-y-[9rem] lg:translate-x-[11.2rem] lg:-translate-y-[11.2rem]">
                <img src={tayeImg} alt="Lead Personnel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl -translate-x-[7.5rem] translate-y-[7.5rem] sm:-translate-x-[9rem] translate-y-[9rem] lg:-translate-x-[11.2rem] lg:translate-y-[11.2rem]">
                <img src={soldierImg} alt="Personnel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl translate-x-[7.5rem] translate-y-[7.5rem] sm:translate-x-[9rem] translate-y-[9rem] lg:translate-x-[11.2rem] lg:translate-y-[11.2rem]">
                <img src={ceo} alt="Dr. Mekdes Dabba" className="w-full h-full object-cover" />
              </div>

              {/* Atmospheric brand glow */}
              <div className="absolute inset-0 bg-brand/10 blur-[140px] -z-10 rounded-full"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
