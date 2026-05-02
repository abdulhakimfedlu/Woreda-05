import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#90E0EF]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#00B4D8]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="flex flex-col items-center mb-10 transform transition-all duration-700">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl shadow-[#00B4D8]/10 flex items-center justify-center mb-6 border border-[#90E0EF]/30 relative group">
            <div className="absolute inset-0 bg-[#00B4D8]/5 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
            <Shield size={40} className="text-[#00B4D8] relative z-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter text-center">
            JOIN <span className="text-[#00B4D8]">PORTAL</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 text-center">Register for Administrative Access</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,180,216,0.15)] border border-[#00B4D8]/5 overflow-hidden w-full">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-6 md:p-10",
                headerTitle: "text-2xl font-black text-slate-800 tracking-tight",
                headerSubtitle: "text-slate-400 font-medium text-sm",
                socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 hover:border-[#00B4D8]/30 transition-all rounded-xl h-14 w-full gap-3 shadow-sm",
                socialButtonsBlockButtonText: "font-bold text-slate-700 text-sm tracking-wide",
                socialButtonsIconButton: "border border-slate-200 hover:bg-slate-50 transition-all rounded-xl h-14 w-14",
                dividerLine: "bg-slate-100",
                dividerText: "text-slate-300 font-bold text-[10px] uppercase tracking-widest",
                formFieldLabel: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
                formFieldInput: "bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all",
                formButtonPrimary: "bg-[#00B4D8] hover:bg-[#0077B6] text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-[#00B4D8]/20 transition-all transform hover:-translate-y-0.5 mt-2",
                footerActionText: "text-slate-400 font-bold text-xs",
                footerActionLink: "text-[#00B4D8] hover:text-[#0077B6] font-black text-xs transition-colors",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
                hideClerkBranding: true,
                socialButtonsVariant: "blockButton"
              },
              variables: {
                colorPrimary: '#00B4D8',
                colorText: '#1e293b',
                colorTextSecondary: '#64748b',
                fontFamily: 'inherit',
                borderRadius: '1rem',
              }
            }}
            signInUrl="/login"
            afterSignUpUrl="/"
          />
        </div>

        <div className="mt-8 text-center p-6 bg-[#00B4D8]/5 rounded-[2rem] border border-[#00B4D8]/10 max-w-xs mx-auto">
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">
            <span className="block mb-2 text-[#00B4D8] uppercase tracking-widest text-[10px] font-black">Verification Notice:</span>
            Your account will require manual approval from a senior administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
