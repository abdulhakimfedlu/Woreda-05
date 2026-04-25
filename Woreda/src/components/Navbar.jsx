import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Globe, ChevronDown, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const links = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_services'), path: '/services' },
    { name: t('nav_announcements'), path: '/announcements' },
    { name: t('nav_gallery'), path: '/gallery' },
    { name: t('nav_about'), path: '/about' },
    { name: t('nav_contact'), path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-[#080d14]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <div className="w-11 h-11 bg-black dark:bg-brand flex items-center justify-center rounded-2xl group-hover:bg-brand dark:group-hover:bg-brand/80 transition-all duration-500 subtle-glow">
              <span className="text-white font-black text-xl tracking-tighter">W5</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black text-black dark:text-white tracking-tight leading-none uppercase">Woreda 05</span>
              <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] mt-1 opacity-70">YEKA SUBCITY</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-14">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
                <Link key={link.name} to={link.path} className="group relative flex flex-col items-center py-2">
                  <span className={`text-[13px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${
                    active ? 'text-brand' : 'text-black/50 dark:text-white/50 group-hover:text-brand'
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-1 bg-brand rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,180,216,0.5)] ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 hover:border-brand/40 transition-all group"
              >
                <Globe className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-brand transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  {language === 'en' ? 'English' : 'አማርኛ'}
                </span>
                <ChevronDown className={`w-3 h-3 text-black/40 dark:text-white/40 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 border border-black/5 dark:border-white/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {['en', 'am'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setLang(lang); setIsLangOpen(false); }}
                        className={`w-full px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest transition-colors ${
                          language === lang
                            ? 'bg-brand/10 text-brand'
                            : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {lang === 'en' ? 'English' : 'አማርኛ'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 hover:border-brand/50 hover:bg-brand/10 dark:hover:bg-brand/20 transition-all group"
              aria-label="Toggle dark mode"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-brand group-hover:rotate-45 transition-transform duration-300" />
                : <Moon className="w-4 h-4 text-black/50 group-hover:text-brand transition-colors duration-200" />
              }
            </button>

            {/* Live dot */}
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse subtle-glow" />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10"
              aria-label="Toggle dark mode"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-brand" />
                : <Moon className="w-4 h-4 text-black/50" />
              }
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="text-black dark:text-white group">
              <div className="flex flex-col gap-1.5 items-end">
                <div className={`h-1 bg-black dark:bg-white rounded-full transition-all duration-500 ${isOpen ? 'w-8 rotate-45 translate-y-2.5' : 'w-8'}`} />
                <div className={`h-1 bg-black dark:bg-white rounded-full transition-all duration-500 ${isOpen ? 'opacity-0' : 'w-6 group-hover:w-8'}`} />
                <div className={`h-1 bg-black dark:bg-white rounded-full transition-all duration-500 ${isOpen ? 'w-8 -rotate-45 -translate-y-2.5' : 'w-4 group-hover:w-8'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-y-auto transition-all duration-500 bg-white dark:bg-[#0d1420] ${isOpen ? 'max-h-[calc(100vh-80px)] border-b border-black/5 dark:border-white/8 pb-12' : 'max-h-0'}`}>
        <div className="px-10 pt-12 flex flex-col gap-8 items-center">
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-3xl font-black transition-colors ${active ? 'text-brand' : 'text-black dark:text-white hover:text-brand'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="w-full h-px bg-black/8 dark:bg-white/8 my-4" />

          <div className="flex flex-col gap-4 w-full">
            <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em] text-center mb-2">
              {language === 'am' ? 'ቋንቋ ይምረጡ' : 'Select Language'}
            </p>
            <div className="flex gap-2">
              {['en', 'am'].map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLang(lang); setIsOpen(false); }}
                  className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                    language === lang
                      ? 'bg-brand text-white border-brand'
                      : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 border-black/8 dark:border-white/10'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'አማርኛ'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
