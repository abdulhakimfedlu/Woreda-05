import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080d14] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#90E0EF]/20 dark:bg-[#00B4D8]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#00B4D8]/10 dark:bg-[#90E0EF]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="flex flex-col items-center mb-10 transform transition-all duration-700">
          <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-[#00B4D8]/10 dark:shadow-[#00B4D8]/5 flex items-center justify-center mb-6 border border-[#90E0EF]/30 dark:border-slate-800 relative group">
            <div className="absolute inset-0 bg-[#00B4D8]/5 dark:bg-[#00B4D8]/10 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
            <Shield size={40} className="text-[#00B4D8] relative z-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter text-center">
            ADMIN <span className="text-[#00B4D8]">PORTAL</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 text-center">Woreda 05 Management System</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,180,216,0.15)] dark:shadow-none border border-[#00B4D8]/5 dark:border-slate-800 overflow-hidden w-full">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-6 md:p-10",
                headerTitle: "text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight",
                headerSubtitle: "text-slate-400 dark:text-slate-500 font-medium text-sm",
                socialButtonsBlockButton: "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl h-14 w-full gap-3 shadow-sm dark:shadow-none",
                socialButtonsBlockButtonText: "font-bold text-slate-700 dark:text-slate-300 text-sm tracking-wide",
                socialButtonsIconButton: "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl h-14 w-14",
                dividerLine: "bg-slate-100 dark:bg-slate-800",
                dividerText: "text-slate-300 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest",
                formFieldLabel: "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1",
                formFieldInput: "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white dark:focus:bg-slate-950 transition-all",
                formButtonPrimary: "bg-[#00B4D8] hover:bg-[#0077B6] text-white text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-[#00B4D8]/20 transition-all transform hover:-translate-y-0.5 mt-2",
                footerActionText: "text-slate-400 dark:text-slate-500 font-bold text-xs",
                footerActionLink: "text-[#00B4D8] hover:text-[#0077B6] font-black text-xs transition-colors",
                identityPreviewText: "text-slate-600 dark:text-slate-400 font-bold",
                identityPreviewEditButtonIcon: "text-[#00B4D8]",
                formResendCodeLink: "text-[#00B4D8] font-bold",
                otpCodeFieldInput: "border-slate-200 dark:border-slate-700 focus:border-[#00B4D8] focus:ring-[#00B4D8]/20 text-slate-800 dark:text-slate-200",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
                hideClerkBranding: true,
                socialButtonsVariant: "blockButton"
              },
              variables: {
                colorPrimary: '#00B4D8',
                colorText: 'inherit',
                colorTextSecondary: 'inherit',
                colorBackground: 'transparent',
                fontFamily: 'inherit',
                borderRadius: '1rem',
              }
            }}
            signUpUrl="/signup"
            afterSignInUrl="/"
          />
        </div>

        <div className="mt-8 text-center px-6">
          <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[#00B4D8] uppercase tracking-[0.2em] hover:text-[#0077B6] transition-colors">
            Forgot Password?
          </Link>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
              Enterprise Security Verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
