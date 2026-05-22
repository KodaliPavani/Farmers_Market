import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, Lock, Mail, Phone, MapPin, Leaf, Tractor, Store, 
  ArrowLeft, CheckCircle, AlertCircle, Save, SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'Amit Kumar');
  const [phone, setPhone] = useState(user?.phone || '9111111101');
  const [address, setAddress] = useState(user?.address || 'Street 4, Sector 3, HSR Layout, Bengaluru');
  const [lat, setLat] = useState(user?.latitude || 12.9103);
  const [lon, setLon] = useState(user?.longitude || 77.6410);

  // Role details
  const [farmName, setFarmName] = useState(user?.farmName || 'Patel Agri Farms');
  const [shopName, setShopName] = useState(user?.shopName || 'Amit Pani Puri Corner');
  const [monthlyLimit, setMonthlyLimit] = useState(user?.monthlyLimit || 25000);

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    
    // Save to context
    updateProfile({
      name,
      phone,
      address,
      latitude: Number(lat),
      longitude: Number(lon),
      farmName,
      shopName,
      monthlyLimit: Number(monthlyLimit)
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'FARMER') return '/farmer';
    return '/vendor';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Navigation back link */}
        <Link to={getDashboardLink()} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">My Account Profile</h1>

        {success && (
          <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl text-xs font-bold text-primary-700 text-center animate-fade-in">
            Profile saved successfully! 🎉
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col items-stretch">
          
          {/* Header Cover Banner */}
          <div className="h-28 bg-gradient-to-r from-primary-700 to-secondary-500 relative flex items-end px-8 pb-4">
            <div className="absolute -bottom-6 left-8">
              <div className="h-16 w-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-primary-700 font-extrabold text-xl uppercase select-none">
                <span className="h-full w-full bg-primary-100 rounded-full flex items-center justify-center">
                  {name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-8 pt-10 flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">{user?.name}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role} Account</span>
              </div>

              {!editing ? (
                <button 
                  type="button"
                  onClick={() => setEditing(true)}
                  className="py-1.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  type="submit"
                  className="py-1.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary-200 flex items-center gap-1 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              )}
            </div>

            {/* Common Inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <input 
                    type="email"
                    disabled
                    value={user?.email || 'amit@vendor.com'}
                    className="w-full pl-10 pr-4 py-3 border border-slate-150 bg-slate-50/50 rounded-xl text-xs text-slate-400 outline-none"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    disabled={!editing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-slate-200 bg-white"
                  />
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel"
                    disabled={!editing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-slate-200 bg-white"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Shop / Farm Address</label>
                <div className="relative">
                  <input 
                    type="text"
                    disabled={!editing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-slate-200 bg-white"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

            </div>

            {/* Coordinates details */}
            <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Geospatial Routing Parameters</span>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Latitude</label>
                  <input 
                    type="number"
                    step="0.0001"
                    disabled={!editing}
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Longitude</label>
                  <input 
                    type="number"
                    step="0.0001"
                    disabled={!editing}
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Role specific inputs */}
            {user?.role === 'VENDOR' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Shop Name</label>
                  <input 
                    type="text"
                    disabled={!editing}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Budget Limit (Rs)</label>
                  <input 
                    type="number"
                    disabled={!editing}
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}

            {user?.role === 'FARMER' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Farm Name</label>
                  <input 
                    type="text"
                    disabled={!editing}
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Farm Verification Badge</label>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border self-start mt-1 ${
                    user.verified ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {user.verified ? 'Verified Agri-Supplier' : 'Awaiting APMC Verification'}
                  </span>
                </div>
              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
};

export default Profile;
