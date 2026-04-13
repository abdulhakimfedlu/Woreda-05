import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-black/6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>

      {/* Thin aqua top accent */}
      <div
        className="h-[2px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00B4D8 35%, #90E0EF 65%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">

          {/* Brand */}
          <div className="shrink-0 max-w-[260px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm tracking-tight">W5</span>
              </div>
              <div>
                <p className="text-sm font-black text-black tracking-tighter uppercase leading-none">Woreda 05</p>
                <p className="text-[9px] font-black text-brand uppercase tracking-[0.25em] mt-0.5 opacity-80">YEKA SUBCITY</p>
              </div>
            </div>
            <p className="text-[12px] text-black/35 font-medium leading-relaxed">
              {t('footer_mission')}
            </p>
          </div>

          {/* Links columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16">

            {/* Portal */}
            <div>
              <h4 className="text-[9px] font-black text-brand uppercase tracking-[0.3em] mb-4">{t('footer_links')}</h4>
              <ul className="space-y-3">
                {[
                  { label: t('nav_services'), to: '/services' },
                  { label: t('nav_announcements'), to: '/announcements' },
                  { label: t('nav_gallery'), to: '/gallery' },
                ].map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[12px] font-bold text-black/40 hover:text-brand transition-colors uppercase tracking-tight"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[9px] font-black text-brand uppercase tracking-[0.3em] mb-4">{t('footer_contact')}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+251118456789"
                    className="flex items-center gap-2 text-[12px] font-bold text-black/40 hover:text-brand transition-colors"
                  >
                    <Phone className="w-3 h-3 text-brand shrink-0" /> +251 118 456 789
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@woreda05.gov.et"
                    className="flex items-center gap-2 text-[12px] font-bold text-black/40 hover:text-brand transition-colors"
                  >
                    <Mail className="w-3 h-3 text-brand shrink-0" /> info@woreda05.gov.et
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2 text-[12px] font-bold text-black/40">
                    <MapPin className="w-3 h-3 text-brand shrink-0 mt-0.5" /> {t('footer_address')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>

          <p className="text-[10px] font-bold text-black/25 uppercase tracking-[0.18em]">
            © {year} {t('footer_rights')}
          </p>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.15em]">{t('footer_status')}: {t('footer_online')}</span>
          </div>

          <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.12em]">
            {t('footer_dev_by')}{' '}
            <a
              href="https://my-portfoilio-website.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-brand hover:text-black font-black transition-colors group"
            >
              Abdulhakim Fedlu
              <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
