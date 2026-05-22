import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, Plus, Minus, ArrowLeft, ShieldAlert, Truck, ShoppingBag, 
  CreditCard, Sparkles, HelpCircle, Receipt
} from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Price calculations
  const deliveryFee = cartItems.length > 0 ? 150 : 0;
  const platformFee = Math.round(cartTotal * 0.01); // 1% commission
  const grandTotal = cartTotal + deliveryFee + platformFee;

  // Monthly Budget Limit Check
  const currentSpend = 20400; // Simulated already spent this month
  const budgetLimit = user?.monthlyLimit || 25000;
  const projectedSpend = currentSpend + grandTotal;
  const budgetExceeded = projectedSpend > budgetLimit;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Navigation back link */}
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Mandi Market
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">Sourcing Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">Your sourcing cart is empty</h3>
            <p className="text-xs text-slate-400">Explore the Mandi Market directly to find verified farmers, tomatoes, onions and raw supplies.</p>
            <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-primary-200">
              Browse Mandi
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items list */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="font-bold text-sm text-slate-700">Shopping Cart ({cartItems.length} items)</span>
                <button 
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex gap-3 items-center">
                      <span className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-xl font-bold">🌾</span>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="font-extrabold text-xs text-slate-800">{item.product.name}</span>
                        <p className="text-[10px] text-slate-400 font-semibold">Farmer: {item.product.farmer} • {item.product.farm}</p>
                        <p className="text-[10px] text-primary-600 font-bold">Rs. {item.product.price} / {item.product.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto">
                      
                      {/* Quantity Selectors */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-xl overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs text-slate-700 px-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total cost */}
                      <div className="text-right w-20">
                        <p className="font-extrabold text-xs text-slate-800">Rs. {item.product.price * item.quantity}</p>
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:text-rose-500 rounded-xl text-slate-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Cart Cost Breakdown Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Cost Summary Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
                <div className="flex gap-2 items-center pb-3 border-b border-slate-50">
                  <Receipt className="h-5 w-5 text-primary-600" />
                  <h3 className="font-bold text-slate-800 text-sm">Bill Breakdown</h3>
                </div>

                <div className="flex flex-col gap-3 text-xs text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Produce Subtotal</span>
                    <span className="text-slate-700 font-bold">Rs. {cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shared Delivery Fee</span>
                    <span className="text-slate-700 font-bold">Rs. {deliveryFee}</span>
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

                {/* Shared Neighbor Transit Saving Notification */}
                <div className="p-3 bg-primary-50 rounded-2xl border border-primary-100 text-[10px] text-primary-700 flex gap-2 items-start leading-normal">
                  <Truck className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                  <span>Neighbor shared transit discounts will apply dynamically on checkout based on coordinates optimization!</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2"
                >
                  Proceed to Checkout <CreditCard className="h-4 w-4" />
                </button>
              </div>

              {/* Advanced Feature 3: Smart Budget Cap Alert warning */}
              <div className={`p-5 rounded-3xl border text-left flex gap-3 items-start ${budgetExceeded ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-primary-50 border-primary-100 text-primary-700'}`}>
                <ShieldAlert className={`h-5 w-5 shrink-0 mt-0.5 ${budgetExceeded ? 'text-rose-600 animate-bounce' : 'text-primary-600'}`} />
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-xs">{budgetExceeded ? 'Monthly Spend Cap Alert' : 'Within Sourcing Budget'}</h4>
                  <p className="text-[10px] leading-normal font-semibold">
                    {budgetExceeded 
                      ? `Your projected spend of Rs. ${projectedSpend} will EXCEED your monthly budget limit of Rs. ${budgetLimit}! Consider adjusting quantities to stay within limit.`
                      : `Your projected monthly spend of Rs. ${projectedSpend} is safe and fits well within your Rs. ${budgetLimit} budget cap.`
                    }
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
