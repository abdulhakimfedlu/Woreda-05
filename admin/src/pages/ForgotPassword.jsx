import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Shield, ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function ForgotPassword() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email'); // email, code, reset, success
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Check if email is approved in our backend
      const checkRes = await fetch(`http://localhost:5000/api/admins/check/${email}`);
      const checkData = await checkRes.json();

      if (!checkData.approved) {
        setErrorMsg('This email is not supported by the main administrator.');
        setLoading(false);
        return;
      }

      // 2. Trigger Clerk's password reset flow
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep('code');
      toast.success('Verification code sent to your email');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.errors?.[0]?.message || 'Failed to start password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (!code || code.length < 6) {
        throw new Error('Please enter the full 6-digit verification code');
      }
      
      // VERIFY THE CODE EARLY WITH CLERK
      // This will throw an error if the code is wrong, preventing the user from seeing the password fields
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      if (result.status === 'needs_new_password') {
        setStep('reset');
      } else {
        // Fallback for other states
        setErrorMsg('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.errors?.[0]?.message || err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Since we already verified the code in the previous step,
      // Clerk expects the password to complete the reset.
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setStep('success');
      } else {
        setErrorMsg('Failed to set new password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.errors?.[0]?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#90E0EF]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#00B4D8]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-10 transform transition-all duration-700">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl shadow-[#00B4D8]/10 flex items-center justify-center mb-6 border border-[#90E0EF]/30">
            <KeyRound size={40} className="text-[#00B4D8]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            PASSWORD <span className="text-[#00B4D8]">RESET</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Account Recovery System</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,180,216,0.15)] border border-[#00B4D8]/5 p-10 overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-sm font-bold text-red-700 leading-tight">
                {errorMsg}
              </p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <p className="text-sm text-slate-500 font-medium text-center px-2">
                Enter your approved administrator email to receive a verification code.
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 pl-12 text-sm focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="name@example.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B4D8] hover:bg-[#0077B6] text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-[#00B4D8]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <p className="text-sm text-slate-500 font-medium text-center">
                We've sent a 6-digit code to <span className="text-slate-800 font-bold">{email}</span>.
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B4D8] hover:bg-[#0077B6] text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-[#00B4D8]/20 transition-all disabled:opacity-50"
              >
                Continue
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                Back to Email
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00B4D8] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00B4D8] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B4D8] hover:bg-[#0077B6] text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-[#00B4D8]/20 transition-all disabled:opacity-50"
              >
                Reset Password
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Security Updated!</h3>
              <p className="text-sm text-slate-500 font-medium mb-10 px-4">
                Your password has been successfully reset. You are now being redirected to the dashboard.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl hover:bg-black transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#00B4D8] transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
