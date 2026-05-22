import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, ShieldAlert, Users, TrendingUp, DollarSign, Tractor, Store, 
  Check, X, Ban, Activity, RefreshCw, BarChart2, MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Simulated platform analytics data
  const revenueHistory = [
    { month: 'Jan', volume: 140000, fee: 2800 },
    { month: 'Feb', volume: 180000, fee: 3600 },
    { month: 'Mar', volume: 220000, fee: 4400 },
    { month: 'Apr', volume: 290000, fee: 5800 },
    { month: 'May', volume: 340000, fee: 6800 }
  ];

  // Supplier Verification List
  const [unverifiedFarmers, setUnverifiedFarmers] = useState([
    { id: 'f3', name: 'Mahesh Gowda', farm: 'Gowda Organic Farm', size: 5.0, crop: 'Oils & Dairy', doc: 'AgriCert_504.pdf' }
  ]);

  // Platform User accounts list
  const [accounts, setAccounts] = useState([
    { id: 'u1', name: 'Ramesh Kurmi', email: 'ramesh@farmer.com', role: 'FARMER', phone: '9898989801', active: true },
    { id: 'u2', name: 'Amit Kumar', email: 'amit@vendor.com', role: 'VENDOR', phone: '9111111101', active: true },
    { id: 'u3', name: 'Suresh Patel', email: 'suresh@farmer.com', role: 'FARMER', phone: '9898989802', active: true },
    { id: 'u4', name: 'Vikram Singh', email: 'vikram@vendor.com', role: 'VENDOR', phone: '9111111102', active: false }
  ]);

  const handleVerify = (id) => {
    setUnverifiedFarmers(unverifiedFarmers.filter(f => f.id !== id));
  };

  const handleToggleStatus = (id) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, active: !acc.active };
      }
      return acc;
    }));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Namaste, {user?.name}!</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">KrishiMandi Platform Administration</p>
          </div>
          <span className="bg-primary-50 text-primary-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-primary-100 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Root Admin Session
          </span>
        </div>

        {/* 4 Core metrics boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mandi Volume</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1">Rs. 3.4 Lakhs</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1">Gross sales this month</span>
            </div>
            <span className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg font-bold">💰</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Earnings</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1">Rs. 6,800</span>
              <span className="text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-1.5 self-start">2% Platform Fee active</span>
            </div>
            <span className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-lg font-bold">📈</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Farmers</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1">45 Farmers</span>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 self-start">1 Verification pending</span>
            </div>
            <span className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg font-bold">🌾</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Vendors</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1">104 Vendors</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1">B2B Street Stalls verified</span>
            </div>
            <span className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg font-bold">🏬</span>
          </div>

        </div>

        {/* Platform Transaction Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mandi Transactions</span>
            <h3 className="font-extrabold text-slate-800 text-sm mt-1">Monthly Gross Sourcing Value & Admin Revenue</h3>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueHistory}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`Rs. ${value}`, 'Value']} />
                <Area type="monotone" dataKey="volume" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmers Verification & User Accounts Management Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Supplier verification requests */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Supplier Verification Requests</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Review agricultural certificates</p>
            </div>

            {unverifiedFarmers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                No pending verification requests at this time.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {unverifiedFarmers.map(f => (
                  <div key={f.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs text-slate-800">{f.farm}</span>
                        <p className="text-[10px] text-slate-400 font-medium">Farmer: {f.name}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-150 px-2 py-0.5 rounded-full">{f.size} Acres</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-slate-600 truncate">{f.doc}</span>
                      <a href="#" className="text-[9px] font-bold text-primary-600 hover:text-primary-700 uppercase">View PDF</a>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleVerify(f.id)}
                        className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </button>
                      <button 
                        onClick={() => handleVerify(f.id)}
                        className="py-1.5 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer shadow-md shadow-primary-200"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve Farmer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User account list (Block/Unblock) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Platform User Accounts</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Manage status and block/unblock users</p>
            </div>

            <div className="flex flex-col gap-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-left hover:shadow-sm transition-all">
                  <div className="flex gap-3 items-center">
                    <span className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      acc.role === 'FARMER' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {acc.role === 'FARMER' ? '🌾' : '🏬'}
                    </span>
                    <div>
                      <span className="font-extrabold text-xs text-slate-800">{acc.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">{acc.email}</span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                        <span className="text-[10px] text-slate-500 font-semibold">{acc.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      acc.active ? 'bg-primary-50 text-primary-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {acc.active ? 'Active' : 'Blocked'}
                    </span>
                    <button 
                      onClick={() => handleToggleStatus(acc.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        acc.active ? 'bg-white border-slate-200 text-rose-600 hover:bg-rose-50' : 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
