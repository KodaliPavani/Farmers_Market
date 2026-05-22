import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Truck, Percent, TrendingUp, Users, HeartHandshake, Leaf, ArrowUpRight
} from 'lucide-react';

const Home = () => {
  const steps = [
    {
      id: '01',
      title: 'Farmer lists raw harvest',
      desc: 'Farmers post their fresh vegetables, grains, or spices immediately after harvest with freshness dates and standard wholesale pricing.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      id: '02',
      title: 'Street Vendor orders directly',
      desc: 'Vendors search, filter, and purchase exactly what they need for their street stalls, pani puri corners, or pav bhaji centers.',
      color: 'bg-secondary-50 text-secondary-600'
    },
    {
      id: '03',
      title: 'Bulk Transit Optimization',
      desc: 'Our system groups multiple vendor orders in the same street to reduce transport costs and delivers under fresh cold-chains.',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const testimonies = [
    {
      name: 'Ramesh Kurmi',
      role: 'Tomato Farmer, Devanahalli',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      comment: 'Earlier, agents took 40% of my tomato value. Thanks to KrishiMandi, I sell directly to HSR pani puri vendors and get paid immediately. My earnings grew by 60%!'
    },
    {
      name: 'Amit Kumar',
      role: 'Owner, Amit Pani Puri Corner',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      comment: 'We need 50kg fresh onions and 15kg green chilies daily. Getting them straight from Suresh ji\'s farm means our pani puri water tastes fresher, and we save Rs. 8,000 every month!'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        
        {/* Animated background highlights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            
            {/* Banner badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-secondary-100 uppercase tracking-widest">
              <Leaf className="h-4 w-4 text-secondary-500 animate-spin" /> No Middlemen. Direct Farm Profit.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Direct Raw Material Sourcing for <span className="text-secondary-500">Street Vendors</span> & <span className="text-primary-400">Farmers</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Skip the APMC brokers and agents. Purchase fresh vegetables, groceries, oils, and masalas directly from farmers with optimized group transport and complete freshness guarantees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link to="/register" className="bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 rounded-2xl font-bold text-center shadow-lg shadow-secondary-500/20 transition-all flex items-center justify-center gap-2">
                Register Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2">
                Sign In
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-secondary-500">10,000+</p>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Vendors Joined</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary-400">4,500+</p>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Verified Farmers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">Rs. 2Cr+</p>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Middlemen Fees Saved</p>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Dashboard Mockup Card */}
            <div className="w-full bg-white text-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Direct Mandi Market</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Live harvest rates in Bengaluru</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">Live Rates</span>
              </div>

              {/* Sample listings */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                  <span className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg font-bold">🧅</span>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-xs text-slate-800">Nashik Onions (Standard)</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Harvested Today • Ramesh Kurmi</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary-600">Rs. 28/KG</p>
                    <p className="text-[9px] text-slate-400 font-semibold line-through">Mkt Price: Rs. 42</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                  <span className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg font-bold">🍅</span>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-xs text-slate-800">Organic Red Tomatoes</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Harvested Today • Patel Farms</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary-600">Rs. 32/KG</p>
                    <p className="text-[9px] text-slate-400 font-semibold line-through">Mkt Price: Rs. 55</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                  <span className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg font-bold">🌶️</span>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-xs text-slate-800">Green Teja Chilies (Super-spicy)</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Harvested Yesterday • Gowda Organic</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary-600">Rs. 65/KG</p>
                    <p className="text-[9px] text-slate-400 font-semibold line-through">Mkt Price: Rs. 90</p>
                  </div>
                </div>
              </div>

              {/* Geo matching notification simulation */}
              <div className="mt-5 p-3.5 bg-primary-50 rounded-2xl border border-primary-100 text-left flex items-start gap-2.5">
                <Truck className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-primary-900">Bulk Transit savings active in HSR Sector 3!</p>
                  <p className="text-[10px] text-primary-700 leading-normal mt-0.5">3 pani puri centers ordered from Ramesh Kurmi. Delivery charges reduced by 40%.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Value Propositions */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">KrishiMandi Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Why Settle for Broker Prices?</h2>
          <p className="text-slate-500 mt-3 text-base">We re-engineer raw material sourcing for Indian street-stalls by bringing transparency, technology, and zero middlemen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left flex flex-col gap-4">
            <span className="h-12 w-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
              <Leaf className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">Freshness Indicators</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Know the exact date and hour of harvest. Clear shelf-life markers so you buy produce that stays fresh longer at your stall.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left flex flex-col gap-4">
            <span className="h-12 w-12 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-600">
              <Truck className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">Transport Optimization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Automated geospatial pooling matching vendors in the same neighborhood to share a single transport truck from local farms.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left flex flex-col gap-4">
            <span className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <Percent className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">30-40% Direct Savings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">By cutting commission agents, wholesalers, and retail markups, food vendors save on material costs and farmers gain better margins.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left flex flex-col gap-4">
            <span className="h-12 w-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">Direct Chat & Geolocation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Chat directly in regional languages with local farmers, place orders, negotiate quantities and match with nearby farmers within 15km.</p>
          </div>

        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold text-secondary-600 bg-secondary-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">Operational Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">How KrishiMandi Mandi Operates</h2>
            <p className="text-slate-500 mt-3 text-base">Simple, technology-driven steps that bridge the rural-urban sourcing gap.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="relative bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-start text-left gap-4">
                <span className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-extrabold ${step.color}`}>
                  {step.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-800">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Real stories section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Loved by Farmers & Street Vendors</h2>
          <p className="text-slate-500 mt-3 text-base">Hear how KrishiMandi is changing livelihoods across local communities.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {testimonies.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start text-left hover:shadow-md transition-all">
              <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-xl border-2 border-primary-200 uppercase select-none shrink-0">
                {t.name.charAt(0)}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm italic text-slate-600 leading-relaxed">"{t.comment}"</p>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-primary-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to boost your profits today?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Join the agricultural revolution. Sign up as a Vendor to buy wholesale raw materials or as a Farmer to sell your fresh produce immediately.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/register" className="bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-secondary-500/20">
              Get Started
            </Link>
            <Link to="/about" className="bg-white/10 border border-white/20 hover:bg-white/20 px-8 py-3.5 rounded-xl font-bold transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
