import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, MapPin, Truck, AlertCircle, Calendar, Sparkles, 
  CheckCircle, ArrowLeft, ArrowUpRight, DollarSign, X, HelpCircle, User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'VENDOR') {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('km_token');
        const res = await axios.get(`http://localhost:8080/api/orders/vendor/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        if (res.data.length > 0) setSelectedOrder(res.data[0]);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (id) => {
    try {
      const token = localStorage.getItem('km_token');
      await axios.put(`http://localhost:8080/api/orders/${id}/cancel?userId=${user.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => {
        if (o.id === id) {
          return { ...o, status: 'CANCELLED' };
        }
        return o;
      }));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'CANCELLED' });
      }
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed', desc: 'Awaiting farmer approval' },
      { key: 'APPROVED', label: 'Accepted', desc: 'Produce packaging started' },
      { key: 'DISPATCHED', label: 'In Transit', desc: 'Shared neighbor transport active' },
      { key: 'DELIVERED', label: 'Delivered', desc: 'At street vendor corner' }
    ];

    const currentIndex = steps.findIndex(s => s.key === status);
    
    if (status === 'CANCELLED' || status === 'REJECTED') {
      return [
        { label: 'Order Placed', done: true },
        { label: status === 'REJECTED' ? 'Rejected' : 'Cancelled', done: true, failed: true, desc: `This order was ${status.toLowerCase()}.` }
      ];
    }

    return steps.map((s, idx) => ({
      ...s,
      done: idx <= currentIndex,
      active: idx === currentIndex
    }));
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'FARMER') return '/farmer';
    return '/vendor';
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  if (!user || user.role !== 'VENDOR') {
    return <div className="text-center py-20">Please log in as a vendor to view orders.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Navigation back */}
        <Link to={getDashboardLink()} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">My Bulk Sourcing Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Cards Grid */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-white border border-slate-100 rounded-3xl">
                No orders placed yet. 
                <Link to="/products" className="block mt-2 text-primary-600 font-bold underline">Browse Wholesale Market</Link>
              </div>
            ) : (
              orders.map(o => (
                <div 
                  key={o.id} 
                  onClick={() => setSelectedOrder(o)}
                  className={`p-5 bg-white rounded-3xl border shadow-sm flex flex-col gap-4 cursor-pointer hover:shadow-md transition-all ${selectedOrder?.id === o.id ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-slate-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Order #{o.id.substring(0, 8)}</span>
                      <h3 className="font-extrabold text-sm text-slate-800 mt-0.5">{o.farmer?.farmName || "Farm Direct"}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="text-right flex flex-col gap-1 items-end">
                      <p className="font-extrabold text-xs text-slate-800">Rs. {o.totalPrice}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                        o.status === 'APPROVED' ? 'bg-primary-50 text-primary-700' : 
                        o.status === 'DISPATCHED' ? 'bg-indigo-50 text-indigo-700' : 
                        (o.status === 'CANCELLED' || o.status === 'REJECTED') ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-50">
                    <span className="font-semibold text-slate-700">{o.product?.name} ({o.quantity} {o.unitType})</span>
                    {o.bulkOptimized && (
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Truck className="h-2.5 w-2.5" /> Shared Transit
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Delivery Stepper Details Sidebar */}
          <div className="lg:col-span-6">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6 text-left animate-fade-in">
                
                <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Order Details</span>
                    <h3 className="font-extrabold text-slate-800 text-base mt-0.5">{selectedOrder.farmer?.farmName || "Farm Direct"}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Farmer contact: {selectedOrder.farmer?.user?.name}</p>
                  </div>
                  
                  {selectedOrder.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="py-1.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer border border-rose-100"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel Order
                    </button>
                  )}
                </div>

                {/* Interactive Stepper Tracker */}
                <div className="flex flex-col gap-6 pl-4 relative border-l border-slate-100 py-2">
                  {getStatusSteps(selectedOrder.status).map((step, idx) => (
                    <div key={idx} className="relative text-left">
                      {/* Step Circle */}
                      <span className={`absolute -left-[25px] top-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        step.failed ? 'bg-rose-500 border-rose-500' :
                        step.done ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-slate-300'
                      }`}>
                        {step.done && !step.failed && <CheckCircle className="h-2.5 w-2.5 text-white" />}
                      </span>

                      <div className="flex flex-col gap-0.5 pl-4 -mt-1">
                        <span className={`text-xs font-bold ${step.active ? 'text-primary-600' : 'text-slate-700'}`}>{step.label}</span>
                        <p className="text-[10px] text-slate-400 leading-normal font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Items Bought list */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Purchased Produce</h4>
                  <div className="flex flex-col gap-2">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                      <div className="text-left font-semibold text-slate-700">
                        {selectedOrder.product?.name}
                        <span className="block text-[9.5px] text-slate-400 font-medium">Qty: {selectedOrder.quantity} {selectedOrder.unitType}</span>
                      </div>
                      <span className="font-extrabold text-slate-800">Rs. {selectedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice overview */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="text-slate-700 font-bold">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="text-slate-700 font-bold">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address</span>
                    <span className="text-slate-700 font-bold text-right truncate max-w-[200px]">{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
                <AlertCircle className="h-10 w-10 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-sm">Select an order</h3>
                <p className="text-xs text-slate-400">Click on any order to view its real-time shared neighbor transit stepping tracker and crop details.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Orders;
