import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLang, t } = useLanguage();

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
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Brand Lockup */}
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <div className="w-11 h-11 bg-black flex items-center justify-center rounded-2xl group-hover:bg-brand transition-all duration-500 subtle-glow">
              <span className="text-white font-black text-xl tracking-tighter">W5</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black text-black tracking-tight leading-none uppercase">Woreda 05</span>
              <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] mt-1 opacity-70">YEKA SUBCITY</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-14">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
              <Link 
                key={link.name} 
                to={link.path} 
                className="group relative flex flex-col items-center py-2"
              >
                <span className={`text-[13px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${active ? 'text-brand' : 'text-black/50 group-hover:text-brand'}`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 h-1 bg-brand rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,180,216,0.5)] ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            )})}
          </div>

          {/* Minimalist Portal Access Indicator & Language Switcher */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand/40 transition-all group"
              >
                <Globe className="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">
                  {language === 'en' ? 'English' : 'አማርኛ'}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl shadow-black/5 border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => { setLang('en'); setIsLangOpen(false); }}
                      className={`w-full px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest transition-colors ${language === 'en' ? 'bg-brand/5 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => { setLang('am'); setIsLangOpen(false); }}
                      className={`w-full px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest transition-colors ${language === 'am' ? 'bg-brand/5 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      አማርኛ
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse subtle-glow"></div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black group">
              <div className="flex flex-col gap-1.5 items-end">
                <div className={`h-1 bg-black rounded-full transition-all duration-500 ${isOpen ? 'w-8 rotate-45 translate-y-2.5' : 'w-8'}`}></div>
                <div className={`h-1 bg-black rounded-full transition-all duration-500 ${isOpen ? 'opacity-0' : 'w-6 group-hover:w-8'}`}></div>
                <div className={`h-1 bg-black rounded-full transition-all duration-500 ${isOpen ? 'w-8 -rotate-45 -translate-y-2.5' : 'w-4 group-hover:w-8'}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 bg-white ${isOpen ? 'max-h-screen border-b border-slate-100 pb-12' : 'max-h-0'}`}>
        <div className="px-10 pt-12 flex flex-col gap-8 items-center">
          {links.map((link) => {
            const active = isActive(link.path);
            return (
            <Link key={link.name} to={link.path} className={`text-3xl font-black transition-colors ${active ? 'text-brand' : 'text-black hover:text-brand'}`} onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          )})}
          
          <div className="w-full h-px bg-slate-100 my-4" />
          
          <div className="flex flex-col gap-4 w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-2">Select Language</p>
            <div className="flex gap-2">
              <button 
                onClick={() => { setLang('en'); setIsOpen(false); }}
                className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${language === 'en' ? 'bg-brand text-white border-brand' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
              >
                English
              </button>
              <button 
                onClick={() => { setLang('am'); setIsOpen(false); }}
                className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${language === 'am' ? 'bg-brand text-white border-brand' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
              >
                አማርኛ
              </button>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;




