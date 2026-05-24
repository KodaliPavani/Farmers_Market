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
    if (email.includes('@') && !email.endsWith('@gmail.com') && email !== 'admin@krishimandi.com') {
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
      const errMsg = err.response?.data?.message || err.response?.data || "";
      
      if (errMsg.includes("verify") || errMsg.includes("verify your Gmail")) {
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
      } else if (err.code === "ERR_NETWORK") {
        // 2. Fallback to offline Simulation if backend is not started/running
        console.log("Backend offline. Falling back to frontend mockup authentication...");
        
        let matchedUser = null;
        let mockToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbWl0QHZlbmRvci5jb20iLCJpYXQiOjE2ODg0OTk3OTUsImV4cCI6MTY4ODU4NjE5NX0";

        if ((email === 'admin@krishimandi.com' && password === 'password') || (email === 'pavanikodali999@gmail.com' && password === 'PaMi@95023')) {
          matchedUser = {
            userId: 'a1000000-0000-0000-0000-000000000001',
            name: 'Pavani Kodali',
            email: 'pavanikodali999@gmail.com',
            phone: '9876543210',
            role: 'ADMIN',
            address: 'APMC Market Road, Yeshwanthpur, Bengaluru',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            detailsId: null
          };
        } else if (email === 'ramesh@farmer.com' && password === 'password') {
          matchedUser = {
            userId: 'f1000000-0000-0000-0000-000000000001',
            name: 'Ramesh Kurmi',
            email: 'ramesh@farmer.com',
            phone: '9898989801',
            role: 'FARMER',
            address: 'Green Valley Farms, Devanahalli, Bengaluru',
            avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
            detailsId: 'f2000000-0000-0000-0000-000000000001',
            verified: true
          };
        } else if (email === 'amit@vendor.com' && password === 'password') {
          matchedUser = {
            userId: 'b1000000-0000-0000-0000-000000000001',
            name: 'Amit Kumar',
            email: 'amit@vendor.com',
            phone: '9111111101',
            role: 'VENDOR',
            address: 'Street 4, Sector 3, HSR Layout, Bengaluru',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            detailsId: 'b2000000-0000-0000-0000-000000000001'
          };
        }

        if (matchedUser) {
          login(matchedUser, mockToken);
          if (matchedUser.role === 'ADMIN') navigate('/admin');
          else if (matchedUser.role === 'FARMER') navigate('/farmer');
          else navigate('/vendor');
        } else {
          setError("Invalid email or password. Please use correct credentials.");
        }
      } else {
        setError(errMsg || "Invalid email or password. Please check your credentials.");
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

        {/* Demo login tips */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500">
            <p><strong className="text-slate-700">Admin:</strong> pavanikodali999@gmail.com</p>
            <p><strong className="text-slate-700">Password:</strong> PaMi@95023</p>
            <p><strong className="text-slate-700">Farmer:</strong> ramesh@farmer.com</p>
            <p><strong className="text-slate-700">Password:</strong> password</p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login;
