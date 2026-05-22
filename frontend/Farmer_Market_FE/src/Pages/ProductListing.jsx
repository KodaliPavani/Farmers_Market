import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  Search, SlidersHorizontal, MapPin, Truck, Leaf, Calendar, 
  Mic, MicOff, Plus, ShoppingCart, Info, Star, Compass
} from 'lucide-react';

const ProductListing = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [voiceSearching, setVoiceSearching] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Mock Categories
  const categories = ['All', 'Vegetables', 'Groceries', 'Oils & Grains', 'Spices & Herbs'];

  // Mock Products Seed
  const initialProducts = [
    { id: 'p1', name: 'Fresh Nashik Onions', category: 'Vegetables', price: 28, unit: 'KG', stock: 500, farm: 'Green Valley Farms', farmer: 'Ramesh Kurmi', distance: 1.4, freshDays: 5, harvestTime: 'Today 6 AM', rating: 4.8, img: '🧅' },
    { id: 'p2', name: 'Organic Red Tomatoes', category: 'Vegetables', price: 32, unit: 'KG', stock: 250, farm: 'Patel Agri Farms', farmer: 'Suresh Patel', distance: 3.2, freshDays: 3, harvestTime: 'Today 8 AM', rating: 4.9, img: '🍅' },
    { id: 'p3', name: 'Green Chilies (Teja Grade)', category: 'Vegetables', price: 65, unit: 'KG', stock: 80, farm: 'Gowda Organic Farm', farmer: 'Mahesh Gowda', distance: 4.8, freshDays: 6, harvestTime: 'Yesterday', rating: 4.5, img: '🌶️' },
    { id: 'p4', name: 'Premium Chakki Atta', category: 'Groceries', price: 42, unit: 'KG', stock: 1200, farm: 'Patel Agri Farms', farmer: 'Suresh Patel', distance: 3.2, freshDays: 90, harvestTime: '1 week ago', rating: 4.7, img: '🌾' },
    { id: 'p5', name: 'Cold-Pressed Groundnut Oil', category: 'Oils & Grains', price: 175, unit: 'Litre', stock: 300, farm: 'Gowda Organic Farm', farmer: 'Mahesh Gowda', distance: 4.8, freshDays: 180, harvestTime: '3 days ago', rating: 4.6, img: '🌻' },
    { id: 'p6', name: 'Fresh Ginger (Kolar Special)', category: 'Spices & Herbs', price: 120, unit: 'KG', stock: 150, farm: 'Green Valley Farms', farmer: 'Ramesh Kurmi', distance: 1.4, freshDays: 14, harvestTime: 'Yesterday', rating: 4.4, img: '🫚' }
  ];

  // Advanced Feature 4: Smart Voice Search Mock Activation
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

  const filteredProducts = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.farm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Page Header & Live search panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">KrishiMandi Sourcing Mandi</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Buy directly from local farmers with shared neighbor transport</p>
          </div>

          {/* Search bar with Voice action */}
          <div className="flex items-center gap-2 w-full md:w-96 relative">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search vegetables, onions, oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <button 
              onClick={handleVoiceSearch}
              title="Voice Search in Hindi/Kannada/English"
              className={`p-3 rounded-xl border transition-all cursor-pointer ${voiceSearching ? 'bg-secondary-500 border-secondary-500 text-white animate-ping' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {voiceSearching ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Voice matching banner alert */}
        {feedback && (
          <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-2xl text-xs font-bold text-secondary-800 text-center animate-fade-in">
            {feedback}
          </div>
        )}

        {/* Category filtering list */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-3">
            <Compass className="h-10 w-10 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">No produce matches your search</h3>
            <p className="text-xs text-slate-400">Try checking spelling, clearing search filters, or exploring other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(p => {
              
              // Advanced Feature 2: High fidelity Freshness Indicator Calculations
              let freshnessColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              let freshnessLabel = 'Perfect Freshness';
              if (p.category === 'Vegetables') {
                if (p.freshDays <= 3) {
                  freshnessColor = 'bg-amber-50 text-amber-700 border-amber-100';
                  freshnessLabel = 'Standard Quality';
                }
              }

              return (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  
                  {/* Image/Emoji area with live freshness tag */}
                  <div className="h-44 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                    <span className="text-6xl select-none filter drop-shadow-md">{p.img}</span>
                    
                    {/* Freshness Badge */}
                    <span className={`absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded-full border ${freshnessColor}`}>
                      {freshnessLabel}
                    </span>

                    {/* Distance Tag */}
                    <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 flex items-center gap-0.5 shadow-sm">
                      <MapPin className="h-2.5 w-2.5 text-secondary-500 animate-bounce" /> {p.distance} km away
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{p.category}</span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {p.rating}
                        </div>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-800 hover:text-primary-600 transition-colors mt-1">
                        {p.name}
                      </h3>

                      <p className="text-[10px] text-slate-400 font-medium">Farm: {p.farm} • Farmer: {p.farmer}</p>
                      
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-1 bg-slate-50 border border-slate-100 rounded-xl p-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Harvest: <strong className="text-slate-700">{p.harvestTime}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <div>
                        <p className="text-xs text-slate-400 font-bold">Direct Price</p>
                        <p className="font-extrabold text-base text-primary-600">Rs. {p.price} <span className="text-[10px] font-bold text-slate-400">/{p.unit}</span></p>
                      </div>

                      <button
                        onClick={() => addToCart(p, 5)} // default increment add to cart
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] py-2.5 px-4 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        <Plus className="h-3.5 w-3.5" /> Sourced Cart
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductListing;
