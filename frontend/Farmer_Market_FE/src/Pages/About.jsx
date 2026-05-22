import React from 'react';
import { Leaf, ShieldCheck, HeartHandshake, Map, Award, Users } from 'lucide-react';

const About = () => {
  const values = [
    { icon: <Leaf className="h-6 w-6 text-primary-600" />, title: 'Freshness Guaranteed', desc: 'We capture exact harvest timestamps so vendors buy produce that has maximum shelf-life and nutritional value.' },
    { icon: <ShieldCheck className="h-6 w-6 text-secondary-600" />, title: 'Verified Suppliers', desc: 'Every farmer on our platform goes through automated and manual verification including farm location mapping.' },
    { icon: <HeartHandshake className="h-6 w-6 text-orange-600" />, title: 'Fair Pricing', desc: 'No commission cuts. Vendors purchase at wholesale cost and farmers retain the complete market value of their labor.' },
    { icon: <Map className="h-6 w-6 text-teal-600" />, title: 'Neighborhood Logistics', desc: 'Our smart transit engine clusters orders inside HSR, Koramangala or Indiranagar to dispatch single combined trucks.' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">Our Story</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Direct Farm Sourcing for India's Street Food Vendors</h1>
          <p className="text-slate-500 mt-4 text-base leading-relaxed">
            KrishiMandi is a B2B agricultural marketplace committed to connecting millions of Indian street-food sellers directly with local farmers.
          </p>
        </div>

        {/* Brand Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img 
            src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800" 
            alt="Fresh produce harvest" 
            className="rounded-3xl shadow-xl border border-slate-100 object-cover h-[400px] w-full"
          />
          <div className="flex flex-col gap-6 text-left">
            <h2 className="text-2xl font-bold text-slate-800">Bridging the Rural-Urban Agriculture Gap</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In India, street food is a lifeline. From pani puri stalls to pav bhaji carts and local bajjis, vendors feed over 10 crore people daily. Yet, these micro-entrepreneurs pay 40-50% inflated prices due to multiple layers of middlemen, brokers, and local market cartels.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              At the same time, hardworking farmers receive a fraction of the value. KrishiMandi leverages simple mobile technology, geolocated matching, and group-transit logistics to empower both sides.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-2xl font-extrabold text-primary-600">30%+</span>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Vendor Savings</p>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-2xl font-extrabold text-secondary-600">45%+</span>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Farmer Income Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Core Values */}
        <div className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4 text-left items-start">
                <span className="p-3 bg-slate-50 rounded-2xl shrink-0">
                  {v.icon}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-slate-800 text-sm">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
