import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Mail, Lock, ChevronRight, X, CheckCircle, RefreshCw, Check } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// ─── Forgot Password Modal ───────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Resend Countdown
  const [countdown, setCountdown] = useState(0);
  
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/club-auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setStep(2);
      setCountdown(60);
      // Focus first OTP field after state change
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/club-auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('A new verification code has been sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(Number(value))) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep the last digit
    setOtp(newOtp);

    // Auto-advance if digit is entered
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move back on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpRefs[5].current?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the code.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/club-auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setStep(3);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const code = otp.join('');
      const res = await fetch(`${BACKEND_URL}/api/club-auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setStep(4);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Checker
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0, 1, 2, 3
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#071510] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-850 bg-emerald-950">
          <div>
            <h2 className="font-black text-white text-sm uppercase tracking-widest">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'New Password'}
              {step === 4 && 'Success'}
            </h2>
            <p className="text-emerald-400 text-xs mt-0.5 font-bold">
              {step !== 4 && `Step ${step} of 3`}
            </p>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-emerald-950/40">
          
          {/* Messages */}
          {error && (
            <div className="flex items-start gap-2 bg-red-950/50 border border-red-700 rounded-xl p-3.5 text-xs text-red-300 mb-4 animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="flex items-start gap-2 bg-emerald-950/60 border border-emerald-750 rounded-xl p-3.5 text-xs text-emerald-300 mb-4 animate-fadeIn">
              <CheckCircle size={14} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Email Entry */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <p className="text-emerald-200 text-sm leading-relaxed font-medium">
                Enter your club's registered email address. We will send you a 6-digit verification code to reset your password.
              </p>
              <div>
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-[#071510] border border-emerald-800 rounded-xl pl-9 pr-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Code Verification */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2">
                <p className="text-emerald-200 text-sm leading-relaxed font-medium">
                  We've sent a 6-digit verification code to <strong className="text-white">{email}</strong>.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2">
                  <span>⏰</span>
                  <span>The code is valid for 15 minutes.</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-3 text-center">
                  Enter 6-Digit Code
                </label>
                
                {/* 6 Input Boxes */}
                <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 bg-[#071510] border-2 border-emerald-800 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                {/* Resend Code Timer */}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || loading}
                  className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5 py-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reset Password Form */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-emerald-200 text-sm leading-relaxed font-medium">
                Verification successful. Create a new strong password for your club portal account.
              </p>

              {/* Password Input */}
              <div>
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#071510] border border-emerald-800 rounded-xl pl-9 pr-10 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#071510] border border-emerald-800 rounded-xl pl-9 pr-10 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                  >
                    {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Strength Indicator */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-medium">Password Strength:</span>
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-emerald-950 rounded-full overflow-hidden flex gap-0.5">
                    {[0, 1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-full flex-1 transition-colors duration-300 ${
                          s <= strength - 1 ? strengthColors[strength - 1] : 'bg-[#071510]'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Criteria checklists */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px] text-emerald-400">
                    <div className="flex items-center gap-1">
                      {password.length >= 6 ? <Check size={10} className="text-emerald-400 font-black animate-scaleUp" /> : <span className="text-red-500">•</span>}
                      <span>At least 6 chars</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(password) ? <Check size={10} className="text-emerald-400 font-black animate-scaleUp" /> : <span className="text-red-500">•</span>}
                      <span>Contains number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[^A-Za-z0-9]/.test(password) ? <Check size={10} className="text-emerald-400 font-black animate-scaleUp" /> : <span className="text-red-500">•</span>}
                      <span>Contains symbol</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <div className="space-y-1.5">
                <p className="text-white text-lg font-black uppercase tracking-wider">Password Updated</p>
                <p className="text-emerald-300 text-sm">
                  Your club portal password has been successfully reset.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                Login Now
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// ─── Main Club Login Page ────────────────────────────────────────────────────
export function ClubLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/club-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('club_token', data.token);
      localStorage.setItem('club_info', JSON.stringify(data.club));
      navigate('/club-dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your login details or contact the league admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071510] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden font-sans">

      {/* Background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#155e15_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-900" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-0 w-56 h-56 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-emerald-400/80 hover:text-amber-400 uppercase tracking-widest font-bold transition-colors">
          <ChevronRight size={14} className="rotate-180" />
          Back to Home
        </Link>

        {/* Logo + Heading */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden bg-emerald-900">
              <img
                src="/smartCityImage.jpg"
                alt="SmartCity Logo"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none'; }}
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest leading-tight">
              Club Portal <span className="text-amber-400">Login</span>
            </h1>
            <p className="mt-2 text-sm text-emerald-400 font-medium">
              Login with the credentials sent to you after your club was approved
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-emerald-950/80 backdrop-blur border border-emerald-800/60 rounded-2xl shadow-2xl p-8 space-y-6">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-xl p-4 text-sm text-red-300 font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                <input
                  type="email"
                  id="club-email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 placeholder:text-emerald-700 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  id="club-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl pl-10 pr-12 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 placeholder:text-emerald-700 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="club-login-btn"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.45)] transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  <LogIn size={16} />
                  Login to Club Portal
                </>
              )}
            </button>
          </form>

          {/* Forgot password */}
          <div className="text-center">
            <button
              onClick={() => setShowForgot(true)}
              className="text-xs text-emerald-400 hover:text-amber-400 font-bold uppercase tracking-widest transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-800/60 pt-5">
            <p className="text-xs text-emerald-600 text-center leading-relaxed">
              Don't have login details? Your club must first be approved by the Osun FA admin.{' '}
              <Link to="/club-register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                Register here →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}
