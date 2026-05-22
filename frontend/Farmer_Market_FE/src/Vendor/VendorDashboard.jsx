

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, MapPin, Truck, AlertCircle, TrendingUp, History, 
  User as UserIcon, ShieldAlert, ArrowUpRight, Search, SlidersHorizontal, Leaf, MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const VendorDashboard = () => {
  const { user } = useAuth();
  
  const [suppliers, setSuppliers] = useState([
    { id: 'f1', name: 'Ramesh Kurmi', farm: 'Green Valley Farms', distance: 1.4, crops: 'Tomatoes, Onions', verified: true },
    { id: 'f2', name: 'Suresh Patel', farm: 'Patel Agri Farms', distance: 3.2, crops: 'Maida, Chana Dal', verified: true },
    { id: 'f3', name: 'Mahesh Gowda', farm: 'Gowda Organic Farm', distance: 4.8, crops: 'Groundnut Oil, Paneer', verified: false }
  ]);

  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('km_token');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Vendor Analytics
        try {
          const res = await axios.get(`http://localhost:8080/api/analytics/vendor/${user?.id || 'me'}`, { headers });
          setAnalytics(res.data);
        } catch (err) {
          console.error("Error fetching vendor analytics:", err);
        }

        // 2. Fetch Vendor Orders
        try {
          const res = await axios.get(`http://localhost:8080/api/orders/vendor/${user?.id || 'me'}`, { headers });
          setOrders(res.data);
        } catch (err) {
          console.error("Error fetching vendor orders:", err);
        }

        // 3. Fetch Nearby Suppliers
        try {
          const lat = user?.latitude || 17.3850;
          const lon = user?.longitude || 78.4867;
          const res = await axios.get(`http://localhost:8080/api/products/nearby?lat=${lat}&lon=${lon}&radiusKm=15`, { headers });
          if (res.data && res.data.length > 0) {
            setSuppliers(res.data.map(s => ({
              id: s.farmerId,
              name: s.farmerName,
              farm: s.farmName,
              distance: s.distanceKm,
              crops: "Organic Produce",
              verified: s.verified
            })));
          }
        } catch (err) {
          console.error("Error fetching nearby suppliers:", err);
        }
      } catch (err) {
        console.error("Error initializing vendor dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const currentSpend = analytics?.totalSpend || 0;
  const spendLimit = analytics?.monthlyLimit || user?.monthlyLimit || 25000;
  const spendPercentage = spendLimit > 0 ? Math.round((currentSpend / spendLimit) * 100) : 0;

  const spendTrend = analytics?.spendTrend && analytics.spendTrend.length > 0
    ? analytics.spendTrend
    : [
        { month: 'No Data', spend: 0 }
      ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Namaste, {user?.name}!</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Vendor Portal • Amit Pani Puri Corner</p>
          </div>
          <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md shadow-primary-200 transition-all flex items-center gap-1">
            Browse Live Mandi <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dynamic Spend limit tracker & high level analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Monthly Spend Limit Progress */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spend Limit Tracker</span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-1">Rs. {currentSpend} <span className="text-xs font-semibold text-slate-400">spent</span></h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${spendPercentage > 85 ? 'bg-rose-50 text-rose-700' : 'bg-primary-50 text-primary-700'}`}>
                {spendPercentage}% Limit
              </span>
            </div>

            <div className="w-full">
              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${spendPercentage > 85 ? 'bg-rose-500' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min(spendPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-bold">
                <span>Rs. 0</span>
                <span>Limit: Rs. {spendLimit}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 flex gap-2 items-start mt-2">
              <AlertCircle className="h-4 w-4 text-secondary-500 shrink-0 mt-0.5" />
              <span>You have Rs. {spendLimit - currentSpend} remaining before you reach your monthly vendor spend cap.</span>
            </div>
          </div>

          {/* Spend trend Chart */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sourcing Analytics</span>
              <h3 className="font-extrabold text-slate-800 text-sm mt-1">Sourcing Expenses Growth</h3>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTrend}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e7c34" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1e7c34" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip formatter={(value) => [`Rs. ${value}`, 'Spent']} />
                  <Area type="monotone" dataKey="spend" stroke="#1e7c34" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Nearby Supplier Geolocations & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Geolocation Supplier suggestion matching */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Nearby Suppliers</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Geolocated under 15km</p>
              </div>
              <span className="h-8 w-8 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {suppliers.map(s => (
                <div key={s.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:shadow-sm transition-all">
                  <div className="flex gap-3 items-start">
                    <span className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg font-bold">🌾</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-800">{s.farm}</span>
                        {s.verified && (
                          <span className="bg-primary-50 text-primary-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full">Verified</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Farmer: {s.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Crops: {s.crops}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-0.5 text-xs text-slate-500 font-bold">
                      <MapPin className="h-3 w-3 text-secondary-500" /> {s.distance} km
                    </div>
                    <div className="flex gap-2">
                      <Link to="/chat" className="p-2 bg-white hover:bg-slate-50 border border-slate-150 rounded-xl text-slate-600 transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Link>
                      <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-[9px] px-2.5 py-1.5 rounded-xl transition-all">
                        Buy Direct
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders log */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Recent Direct Orders</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Real-time delivery tracker</p>
              </div>
              <Link to="/orders" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center gap-2">
                  <span>No orders yet</span>
                  <Link to="/products" className="text-primary-600 font-bold underline hover:text-primary-700">
                    Start exploring products
                  </Link>
                </div>
              ) : (
                orders.map(o => (
                  <div key={o.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:shadow-sm transition-all">
                    <div className="flex gap-3 items-center">
                      <span className="h-10 w-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500">
                        <ShoppingBag className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-0.5 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-800">{o.farmer?.farmName || o.farmer?.user?.name || "Direct Farmer"}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Placed {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col gap-1.5 items-end">
                      <p className="font-extrabold text-xs text-slate-800">Rs. {o.totalAmount}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                        o.status === 'ACCEPTED' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
