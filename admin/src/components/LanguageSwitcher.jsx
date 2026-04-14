import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2.5 rounded-xl text-slate-400 hover:text-[#00B4D8] hover:bg-[#90E0EF]/10 transition-all"
      title={language === 'en' ? t('lang_switch_to_am') : t('lang_switch_to_en')}
    >
      <Globe className="w-5 h-5" />
      <span className="hidden sm:block text-sm font-bold">
        {language === 'en' ? t('lang_amharic') : t('lang_english')}
      </span>
    </button>
  );
}