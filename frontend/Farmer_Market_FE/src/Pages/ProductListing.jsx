import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, SlidersHorizontal, MapPin, Truck, Leaf, Calendar, 
  Mic, MicOff, Plus, ShoppingCart, Info, Star, Compass, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductListing = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [voiceSearching, setVoiceSearching] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bulk Order Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkQuantity, setBulkQuantity] = useState('');
  const [bulkUnit, setBulkUnit] = useState('KG');
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  const categories = ['All', 'Vegetables', 'Groceries', 'Oils & Grains', 'Spices & Herbs'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleVoiceSearch = () => {
    setVoiceSearching(true);
    setSearchQuery('');
    setTimeout(() => {
      setVoiceSearching(false);
      setSearchQuery('Tomatoes');
      setFeedback("Voice matched: 'Tomatoes' 🎙️");
      setTimeout(() => setFeedback(null), 3000);
    }, 2000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.farmer?.farmName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category?.name === selectedCategory || selectedCategory === 'All';
    return matchesSearch && matchesCategory;
  });

  const openBulkModal = (product) => {
    if (!user) {
      alert("Please login as a vendor to place an order");
      return;
    }
    setSelectedProduct(product);
    setBulkQuantity(product.minimumOrderQuantity || 10);
    setBulkUnit(product.unitType || 'KG');
    setOrderError('');
    setOrderSuccess('');
    setShowModal(true);
  };

  const closeBulkModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setBulkQuantity('');
  };

  const calculateTotal = () => {
    if (!selectedProduct || !bulkQuantity) return 0;
    const qty = parseFloat(bulkQuantity);
    if (isNaN(qty)) return 0;
    
    if (bulkUnit.toUpperCase() === 'TON' && selectedProduct.pricePerTon) {
      return qty * selectedProduct.pricePerTon;
    }
    const pricePerKg = selectedProduct.pricePerKg || selectedProduct.price;
    const qtyInKg = bulkUnit.toUpperCase() === 'TON' ? qty * 1000 : qty;
    return qtyInKg * pricePerKg;
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    setOrderSuccess('');
    const qty = parseFloat(bulkQuantity);
    
    if (isNaN(qty) || qty <= 0) {
      setOrderError("Please enter a valid quantity.");
      return;
    }

    const minQty = selectedProduct.minimumOrderQuantity || 10;
    const qtyInKg = bulkUnit.toUpperCase() === 'TON' ? qty * 1000 : qty;

    if (qty < minQty && bulkUnit.toUpperCase() === (selectedProduct.unitType?.toUpperCase() || 'KG')) {
      setOrderError(`Minimum order quantity is ${minQty} ${bulkUnit}.`);
      return;
    }

    if (qtyInKg > selectedProduct.availableStock) {
      setOrderError(`Insufficient stock. Only ${selectedProduct.availableStock} KG available.`);
      return;
    }

    try {
      const token = localStorage.getItem('km_token');
      await axios.post('http://localhost:8080/api/orders', {
        productId: selectedProduct.id,
        quantity: qty,
        unitType: bulkUnit,
        deliveryAddress: user.address || "My Vendor Address",
        paymentMethod: "COD"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderSuccess("Order placed successfully! Waiting for farmer approval.");
      setTimeout(() => {
        closeBulkModal();
      }, 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">KrishiMandi Sourcing Mandi</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Wholesale Bulk Raw Material Sourcing</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-96 relative">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            <button 
              onClick={handleVoiceSearch}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${voiceSearching ? 'bg-secondary-500 border-secondary-500 text-white animate-ping' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {voiceSearching ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-2xl text-xs font-bold text-secondary-800 text-center animate-fade-in">
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading wholesale products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-3">
            <Compass className="h-10 w-10 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">No produce matches your search</h3>
            <p className="text-xs text-slate-400">Try checking spelling, clearing search filters, or exploring other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(p => {
              const freshnessColor = p.freshnessDays <= 3 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
              const freshnessLabel = p.freshnessDays <= 3 ? 'Standard Quality' : 'Perfect Freshness';

              return (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="h-44 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl select-none filter drop-shadow-md">📦</span>
                    )}
                    
                    <span className={`absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded-full border ${freshnessColor}`}>
                      {freshnessLabel}
                    </span>
                    <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 flex items-center gap-0.5 shadow-sm">
                      <MapPin className="h-2.5 w-2.5 text-secondary-500 animate-bounce" /> Farm Direct
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{p.category?.name || 'Produce'}</span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-800 hover:text-primary-600 transition-colors mt-1">
                        {p.name}
                      </h3>

                      <p className="text-[10px] text-slate-400 font-medium">Farm: {p.farmer?.farmName} • Farmer: {p.farmer?.user?.name}</p>
                      
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-1 bg-slate-50 border border-slate-100 rounded-xl p-2">
                        <Leaf className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Available Stock: <strong className="text-slate-700">{p.availableStock} KG</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-1 bg-slate-50 border border-slate-100 rounded-xl p-2">
                        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Min Order: <strong className="text-slate-700">{p.minimumOrderQuantity} {p.unitType || 'KG'}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <div>
                        <p className="text-xs text-slate-400 font-bold">Wholesale Price</p>
                        <p className="font-extrabold text-base text-primary-600">Rs. {p.pricePerKg || p.price} <span className="text-[10px] font-bold text-slate-400">/KG</span></p>
                      </div>

                      <button
                        onClick={() => openBulkModal(p)}
                        className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-[10px] py-2.5 px-4 rounded-xl shadow-md shadow-secondary-200 hover:shadow-lg transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        <Plus className="h-3.5 w-3.5" /> Buy Bulk
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Order Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Place Bulk Order</h2>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
              Ordering <strong>{selectedProduct.name}</strong> from {selectedProduct.farmer?.farmName}
            </p>

            {orderError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex gap-2 items-center text-rose-700 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {orderError}
              </div>
            )}
            
            {orderSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-2 items-center text-emerald-700 text-xs font-bold">
                <Leaf className="w-4 h-4" /> {orderSuccess}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quantity</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary-500/20 outline-none"
                    placeholder="Enter quantity"
                  />
                  <select 
                    value={bulkUnit}
                    onChange={(e) => setBulkUnit(e.target.value)}
                    className="border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-secondary-500/20 outline-none cursor-pointer bg-slate-50"
                  >
                    <option value="KG">KG</option>
                    <option value="TON">TON</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Minimum order: {selectedProduct.minimumOrderQuantity} {selectedProduct.unitType || 'KG'}</p>
                <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Available Stock: {selectedProduct.availableStock} KG</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100 mt-2">
                <span className="text-sm font-bold text-slate-500">Estimated Total:</span>
                <span className="text-xl font-extrabold text-slate-800">Rs. {calculateTotal()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={closeBulkModal}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handlePlaceOrder}
                className="flex-1 py-3 bg-secondary-600 text-white font-bold rounded-xl text-sm hover:bg-secondary-700 shadow-md shadow-secondary-200 transition-all cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductListing;
