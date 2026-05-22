import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, MapPin, Truck, CheckCircle, CreditCard, Loader2, Sparkles 
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [address, setAddress] = useState(user?.address || 'Street 4, Sector 3, HSR Layout, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Hardcode coordinates for shared HSR layout transit matches
  const latitude = 12.9103;
  const longitude = 77.6410;

  // Transit Optimization Calculations (Groups nearby orders)
  const isTransitOptimized = true; // Auto-apply neighborhood group transport saving
  const shippingCharge = isTransitOptimized ? 90 : 150; // Rs. 60 savings!
  const platformFee = Math.round(cartTotal * 0.01);
  const grandTotal = cartTotal + shippingCharge + platformFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Back Link */}
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">Checkout Sourcing Order</h1>

        {success ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-xl max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
            <CheckCircle className="h-16 w-16 text-primary-600 animate-bounce" />
            <h3 className="font-extrabold text-slate-800 text-lg">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-normal">
              Namaste. Your raw materials are ordered directly from local farmers. Neighbor group delivery optimization has been locked in!
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-primary-600 animate-spin" /> Redirecting to Orders Portal...
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Delivery Details Entry */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
              
              <div className="flex flex-col gap-1.5 border-b border-slate-50 pb-4">
                <h3 className="font-bold text-slate-800 text-sm">Delivery Coordinates</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Geospatial coordinate-based neighborhood routing</p>
              </div>

              {/* Coordinates indicators */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Latitude</span>
                  <span className="text-xs font-bold text-slate-700">{latitude}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Longitude</span>
                  <span className="text-xs font-bold text-slate-700">{longitude}</span>
                </div>
              </div>

              {/* Address input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Shop Delivery Address</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    placeholder="Enter stall address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Payment selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider border text-center transition-all cursor-pointer ${paymentMethod === 'COD' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider border text-center transition-all cursor-pointer ${paymentMethod === 'UPI' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    UPI / QR Match
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT')}
                    className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider border text-center transition-all cursor-pointer ${paymentMethod === 'CREDIT' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Mandi Credit
                  </button>
                </div>
              </div>

            </div>

            {/* Cost Breakdown Summary Sidebar */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
              <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-50">Sourcing Invoice</h3>
              
              <div className="flex flex-col gap-3 text-xs text-slate-500 font-semibold">
                <div className="flex justify-between">
                  <span>Produce Cost</span>
                  <span className="text-slate-700 font-bold">Rs. {cartTotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shared Delivery Fee</span>
                  <div className="text-right">
                    <span className="text-slate-700 font-bold">Rs. {shippingCharge}</span>
                    {isTransitOptimized && (
                      <span className="block text-[9px] text-emerald-600 font-bold">Saved Rs. 60 (Bulk Transit)</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Platform Commission (1%)</span>
                  <span className="text-slate-700 font-bold">Rs. {platformFee}</span>
                </div>
                <hr className="border-slate-50 my-1" />
                <div className="flex justify-between text-sm text-slate-800 font-extrabold">
                  <span>Grand Total</span>
                  <span className="text-primary-600">Rs. {grandTotal}</span>
                </div>
              </div>

              {/* Transit savings details */}
              {isTransitOptimized && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10.5px] text-emerald-800 leading-normal flex gap-2 items-start mt-2">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transit Optimized!</strong> We matched your HSR coordinates with 2 nearby vendors sourcing from the same agricultural sector. Sourcing dispatch is combined.
                  </span>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <>Locking Direct Order... <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>Lock Sourcing Order <CreditCard className="h-4 w-4" /></>
                )}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default Checkout;
