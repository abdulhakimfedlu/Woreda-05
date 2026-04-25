import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

const PopularServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(Array.isArray(data) ? data.slice(0, 6) : []);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setServices([]); });
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-[#080d14] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-black text-black/20 dark:text-white/20 uppercase tracking-widest animate-pulse">
            {language === 'am' ? 'በመጫን ላይ...' : 'Loading Services...'}
          </p>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section className="py-32 bg-white dark:bg-[#080d14] relative overflow-hidden text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-8 leading-[0.95] tracking-tighter">
            <span className="stylized-underline decoration-brand pb-2">{t('section_popular').split(' ')[0]}</span>{' '}
            {t('section_popular').split(' ').slice(1).join(' ')}
          </h2>
          <p className="text-xl md:text-2xl text-black/50 dark:text-white/30 max-w-2xl font-black uppercase tracking-tight opacity-40">
            {t('footer_mission')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
            const title = language === 'am' && service.titleAm ? service.titleAm : service.title;
            const dept = language === 'am' && service.departmentAm ? service.departmentAm : service.department;
            return (
              <div key={service.id}>
                <Link to={`/services/${service.id}`}>
                  <ServiceCard
                    title={title}
                    description={dept ? `${t('nav_services')}: ${dept}` : `${t('ann_header')}: ${service.category || 'General'}`}
                  />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/services"
            className="inline-block px-10 py-5 bg-white dark:bg-transparent border-2 border-black dark:border-white text-black dark:text-white rounded-2xl font-black text-lg shadow-xl hover:bg-brand hover:border-brand hover:text-white dark:hover:bg-brand dark:hover:border-brand hover:-translate-y-1 hover:shadow-brand/30 transition-all duration-500 active:scale-95 leading-none"
          >
            {t('btn_view_all')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
