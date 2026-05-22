import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, Lock, Mail, Phone, MapPin, Leaf, Tractor, Store, 
  ArrowRight, CheckCircle, Loader2 
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VENDOR'); // VENDOR or FARMER
  const [address, setAddress] = useState('');
  
  // Farmer Specific Fields
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');

  // Vendor Specific Fields
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('Street Stall');
  const [spendLimit, setSpendLimit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate that only Gmail accounts are allowed
    if (!email.endsWith('@gmail.com')) {
      setError("Only Gmail accounts are allowed.");
      return;
    }

    setLoading(true);

    try {
      // Build API request payload matching Spring Boot DTO fields
      const registerData = {
        name,
        email,
        password,
        phone,
        role,
        address: address || 'APMC Yard, Bengaluru',
        latitude: 12.9716, // Default to Bangalore coords
        longitude: 77.5946,
        farmName: role === 'FARMER' ? (farmName || `${name}'s Farm`) : undefined,
        farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) : undefined,
        shopName: role === 'VENDOR' ? (shopName || `${name}'s Shop`) : undefined,
        shopType: role === 'VENDOR' ? shopType : undefined,
        monthlySpendLimit: role === 'VENDOR' ? parseFloat(spendLimit) : undefined
      };

      await axios.post('http://localhost:8080/api/auth/register', registerData);

      setSuccess(true);
      setTimeout(() => {
        // Redirect user to the OTP input verification view with pre-filled email state
        navigate('/verify-email', { state: { email: email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Failed to create account. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>

      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative z-10 flex flex-col gap-6 text-left">
        
        {/* Header Logo */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="h-12 w-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            KM
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create KrishiMandi Account</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Join India's premier farm-to-vendor marketplace</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-2xl font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 animate-fade-in py-12">
            <CheckCircle className="h-12 w-12 text-primary-600 animate-bounce" />
            <h4 className="font-bold text-primary-900 text-base">Account Created!</h4>
            <p className="text-xs text-primary-700 leading-normal max-w-xs">
              Namaste {name}. Your account was successfully created. Redirecting you to verify your Gmail account...
            </p>
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin mt-4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Role Selection Tabs */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Registering As</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole('VENDOR')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${role === 'VENDOR' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  <Store className="h-4 w-4" /> Street Vendor
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${role === 'FARMER' ? 'bg-secondary-50 border-secondary-500 text-secondary-700' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  <Tractor className="h-4 w-4" /> Farmer / Supplier
                </button>
              </div>
            </div>

            {/* Common Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Amit Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="E.g., amit@vendor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Shop / Farm Address</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="Street, locality, area name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Vendor Specific Inputs */}
            {role === 'VENDOR' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Shop Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Amit Pani Puri"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Shop Type</label>
                  <select 
                    value={shopType}
                    onChange={(e) => setShopType(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  >
                    <option value="Street Stall">Street Stall</option>
                    <option value="Food Truck">Food Truck</option>
                    <option value="Restaurant">Restaurant</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Budget (Rs)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="25000"
                    value={spendLimit}
                    onChange={(e) => setSpendLimit(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Farmer Specific Inputs */}
            {role === 'FARMER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Farm Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Patel Agri Farms"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Farm Size (Acres)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    placeholder="8.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>Creating Account... <Loader2 className="h-4 w-4 animate-spin" /></>
              ) : (
                <>Register Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-50">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
