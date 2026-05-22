import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, MapPin, Truck, AlertCircle, Calendar, Sparkles, 
  CheckCircle, ArrowLeft, ArrowUpRight, DollarSign, X, HelpCircle, User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock Sourcing Orders
  const [orders, setOrders] = useState([
    { 
      id: 'o2000000-0000-0000-0000-000000000001', 
      farmer: 'Green Valley Farms', 
      farmerName: 'Ramesh Kurmi',
      total: 3200, 
      status: 'DELIVERED', 
      date: 'May 16, 2026', 
      address: 'Street 4, Sector 3, HSR Layout, Bengaluru',
      items: [
        { name: 'Nashik Onions (Medium)', qty: '57 KG', price: 28 },
        { name: 'Organic Red Tomatoes', qty: '50 KG', price: 32 }
      ],
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PAID',
      optimized: false
    },
    { 
      id: 'o2000000-0000-0000-0000-000000000002', 
      farmer: 'Patel Agri Farms', 
      farmerName: 'Suresh Patel',
      total: 3900, 
      status: 'SHIPPING', 
      date: 'May 17, 2026', 
      address: 'Street 4, Sector 3, HSR Layout, Bengaluru',
      items: [
        { name: 'Premium Chakki Atta', qty: '92 KG', price: 42.4 }
      ],
      paymentMethod: 'UPI QR Match',
      paymentStatus: 'PENDING',
      optimized: true
    },
    { 
      id: 'o2000000-0000-0000-0000-000000000003', 
      farmer: 'Gowda Organic Farm', 
      farmerName: 'Mahesh Gowda',
      total: 4625, 
      status: 'PENDING', 
      date: 'Today 2 PM', 
      address: 'Street 4, Sector 3, HSR Layout, Bengaluru',
      items: [
        { name: 'Cold-Pressed Groundnut Oil', qty: '25 Litre', price: 175 },
        { name: 'Fresh Ginger (Kolar)', qty: '2 KG', price: 125 }
      ],
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING',
      optimized: false
    }
  ]);

  const handleCancelOrder = (id) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        return { ...o, status: 'CANCELLED' };
      }
      return o;
    }));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: 'CANCELLED' });
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed', desc: 'Awaiting farmer approval' },
      { key: 'ACCEPTED', label: 'Accepted', desc: 'Produce packaging started' },
      { key: 'SHIPPING', label: 'In Transit', desc: 'Shared neighbor transport active' },
      { key: 'DELIVERED', label: 'Delivered', desc: 'At street vendor corner' }
    ];

    const currentIndex = steps.findIndex(s => s.key === status);
    
    if (status === 'CANCELLED') {
      return [
        { label: 'Order Placed', done: true },
        { label: 'Cancelled', done: true, failed: true, desc: 'This order was cancelled.' }
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

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Navigation back */}
        <Link to={getDashboardLink()} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">My Sourcing Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Cards Grid */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {orders.map(o => (
              <div 
                key={o.id} 
                onClick={() => setSelectedOrder(o)}
                className={`p-5 bg-white rounded-3xl border shadow-sm flex flex-col gap-4 cursor-pointer hover:shadow-md transition-all ${selectedOrder?.id === o.id ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-slate-100'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Order #{o.id.substring(0, 8)}</span>
                    <h3 className="font-extrabold text-sm text-slate-800 mt-0.5">{o.farmer}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{o.date}</p>
                  </div>
                  
                  <div className="text-right flex flex-col gap-1 items-end">
                    <p className="font-extrabold text-xs text-slate-800">Rs. {o.total}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                      o.status === 'ACCEPTED' ? 'bg-primary-50 text-primary-700' : 
                      o.status === 'SHIPPING' ? 'bg-indigo-50 text-indigo-700' : 
                      o.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-50">
                  <span className="font-semibold">Items: {o.items.length} produce types</span>
                  {o.optimized && (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Truck className="h-2.5 w-2.5" /> Shared Transit
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Delivery Stepper Details Sidebar */}
          <div className="lg:col-span-6">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6 text-left animate-fade-in">
                
                <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Order Details</span>
                    <h3 className="font-extrabold text-slate-800 text-base mt-0.5">{selectedOrder.farmer}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Farmer contact: {selectedOrder.farmerName}</p>
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
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                        <div className="text-left font-semibold text-slate-700">
                          {item.name}
                          <span className="block text-[9.5px] text-slate-400 font-medium">Qty: {item.qty}</span>
                        </div>
                        <span className="font-extrabold text-slate-800">Rs. {item.price * parseInt(item.qty)}</span>
                      </div>
                    ))}
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
                    <span className="text-slate-700 font-bold text-right truncate max-w-[200px]">{selectedOrder.address}</span>
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
