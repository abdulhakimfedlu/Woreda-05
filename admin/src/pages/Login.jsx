import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Server, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate('/');
    }
  }, [token, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00B4D8]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00B4D8]/30">
              <Server className="text-white w-8 h-8" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter mb-2">
              {t('login_title_1')} <span className="text-[#00B4D8]">{t('login_title_2')}</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 bg-slate-50 inline-block px-4 py-1.5 rounded-full border border-slate-100">
              {t('login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('login_username')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#00B4D8] transition-colors">
                  <User size={18} />
                </div>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('login_username_ph')}
                  className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">{t('login_password')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#00B4D8] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login_password_ph')}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !username || !password}
              className={`w-full py-4 mt-4 flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all ${
                isSubmitting || !username || !password
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : 'bg-[#00B4D8] shadow-[#00B4D8]/20 hover:bg-[#0077B6] hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? t('login_btn_auth') : t('login_btn_signin')}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
