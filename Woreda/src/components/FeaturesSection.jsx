import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home_features_1_title'),
      desc: t('home_features_1_desc'),
      number: '01'
    },
    {
      title: t('home_features_2_title'),
      desc: t('home_features_2_desc'),
      number: '02'
    },
    {
      title: t('home_features_3_title'),
      desc: t('home_features_3_desc'),
      number: '03'
    }
  ];

  const fullTitle = t('home_features_title');
  const titleWords = fullTitle.split(' ');
  const firstHalf = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const secondHalf = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-none tracking-tighter">
            {firstHalf} <span className="stylized-underline decoration-brand pb-2">{secondHalf}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-10 rounded-[3rem] border-2 border-black/5 hover:border-brand hover:bg-brand/5 transition-all duration-500 bg-white"
            >
              <div className="text-6xl font-black text-black/5 mb-8 group-hover:text-brand/20 transition-colors">
                {feature.number}
              </div>
              <h3 className="text-3xl font-black text-black mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-lg text-black/40 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
