import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage if available, default to English
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('woreda_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('woreda_lang', language);
    // Optional: Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  };

  const setLang = (lang) => {
    if (lang === 'en' || lang === 'am') {
      setLanguage(lang);
    }
  };

  // Translation helper
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
