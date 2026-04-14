import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminTranslations } from '../data/adminTranslations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage if available, default to Amharic
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('admin_lang') || 'am';
  });

  useEffect(() => {
    localStorage.setItem('admin_lang', language);
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
    return adminTranslations[language][key] || key;
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