import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Gmail domain validation for non-admin accounts
    if (email.includes('@') && !email.endsWith('@gmail.com')) {
      setError("Only Gmail accounts are allowed.");
      setLoading(false);
      return;
    }

    try {
      // 1. Try real backend API
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      const userData = response.data;
      login(userData, userData.token);

      // Redirect dynamically based on role
      if (userData.role === 'ADMIN') navigate('/admin');
      else if (userData.role === 'FARMER') navigate('/farmer');
      else navigate('/vendor');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || "Network Error: Unable to connect to server.";
      
      if (typeof errMsg === 'string' && (errMsg.includes("verify") || errMsg.includes("verify your Gmail"))) {
        setError(
          <span className="flex items-center gap-1">
            Please verify your Gmail account first.
            <button 
              type="button" 
              onClick={() => navigate('/verify-email', { state: { email } })} 
              className="font-bold underline text-rose-800 hover:text-rose-900 cursor-pointer ml-1"
            >
              Verify Now
            </button>
          </span>
        );
      } else {
        setError(typeof errMsg === 'string' ? errMsg : "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative z-10 flex flex-col gap-6 text-left">
        
        {/* Title logo */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="h-12 w-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            KM
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Sign In to KrishiMandi</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Access your direct sourcing dashboard</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Email or Username</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="E.g., amit@vendor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-slate-600 font-medium">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>Authenticating... <Loader2 className="h-4 w-4 animate-spin" /></>
            ) : (
              <>Sign In <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">Register now</Link>
          </p>
        </div>




      </div>
    </div>
  );
};

export default Login;
