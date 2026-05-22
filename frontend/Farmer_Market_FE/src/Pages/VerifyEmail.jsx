import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, RefreshCw, Timer 
} from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes timer
  const [resendCooldown, setResendCooldown] = useState(0); // 1 minute resend limit

  // 15-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer (1 minute)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your Gmail address.");
      return;
    }
    if (otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email: email,
        otp: otp
      });

      setSuccess("Account verified successfully! Redirecting you to login...");
      setTimeout(() => {
        navigate('/login', { state: { verifiedEmail: email } });
      }, 2500);
    } catch (err) {
      setError(err.response?.data || err.response?.data?.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your Gmail address first.");
      return;
    }
    if (!email.endsWith('@gmail.com')) {
      setError("Only Gmail accounts are allowed.");
      return;
    }

    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('http://localhost:8080/api/auth/resend-verification', {
        email: email
      });
      setSuccess("A new 6-digit OTP has been sent to your Gmail.");
      setTimeLeft(900); // Reset OTP timer
      setResendCooldown(60); // 60 seconds rate limit
    } catch (err) {
      setError(err.response?.data || err.response?.data?.message || "Failed to resend verification OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative z-10 flex flex-col gap-6 text-left">
        {/* Header Logo */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Verify Your Account</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Step 2 of First-Time Login</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-2xl font-medium flex gap-2 items-center">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-primary-50 border border-primary-100 text-xs text-primary-700 rounded-2xl font-medium flex gap-2 items-center">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Gmail Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="E.g., user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!initialEmail}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">6-Digit Verification OTP</label>
            <input 
              type="text" 
              required
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-center text-lg font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 py-1">
            <div className="flex items-center gap-1.5">
              <Timer className="h-4 w-4 text-slate-400" />
              <span>OTP Expiry: <strong className="font-bold text-slate-700">{formatTime(timeLeft)}</strong></span>
            </div>

            <button 
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="font-bold text-primary-600 hover:text-primary-700 disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {resending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend OTP"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>Verifying OTP... <Loader2 className="h-4 w-4 animate-spin" /></>
            ) : (
              <>Verify & Confirm</>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50">
          <p className="text-xs text-slate-400">
            Back to{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
