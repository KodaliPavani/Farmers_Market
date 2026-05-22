import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, Leaf } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'VENDOR', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', role: 'VENDOR', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">Contact Us</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">We'd Love to Hear From You</h1>
          <p className="text-slate-500 mt-3 text-base">Have questions about raw material ordering, supplier listings, or bulk transport savings? Drop us a line.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-6 text-left">
              <h2 className="text-2xl font-bold text-slate-800">Support Center</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our support team is available 24/7 in English, Kannada, Hindi, Telugu, and Marathi to assist farmers and street-vendors.
              </p>

              <div className="flex flex-col gap-4 pt-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <span className="p-3.5 bg-primary-50 text-primary-600 rounded-xl shrink-0">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Support</p>
                    <p className="font-extrabold text-sm text-slate-800">+91 98765 43210</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <span className="p-3.5 bg-secondary-50 text-secondary-600 rounded-xl shrink-0">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Us</p>
                    <p className="font-extrabold text-sm text-slate-800">support@krishimandi.com</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <span className="p-3.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Main Mandi Office</p>
                    <p className="font-extrabold text-sm text-slate-800">APMC Market Yard Road, Yeshwanthpur, Bengaluru 560022</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated Map Visual */}
            <div className="h-44 bg-slate-200 rounded-3xl border border-slate-100 overflow-hidden relative flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600" 
                alt="Map representation" 
                className="absolute w-full h-full object-cover opacity-60 filter grayscale"
              />
              <div className="relative z-10 bg-white/95 px-4 py-2 rounded-2xl shadow-md border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Leaf className="h-4 w-4 text-primary-600 animate-spin" /> Yeshwanthpur APMC Hub
              </div>
            </div>
          </div>

          {/* Contact Input Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Send an Inquiry</h3>
            
            {submitted ? (
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 animate-fade-in h-[380px]">
                <CheckCircle className="h-12 w-12 text-primary-600 animate-bounce" />
                <h4 className="font-bold text-primary-900 text-base">Inquiry Submitted!</h4>
                <p className="text-xs text-primary-700 leading-normal max-w-xs">
                  Namaste. We have received your inquiry. A representative will contact you on WhatsApp or call within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g., Amit Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="E.g., amit@vendor.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">My Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white transition-all"
                  >
                    <option value="VENDOR">Street Food Vendor</option>
                    <option value="FARMER">Farmer / Supplier</option>
                    <option value="OTHER">General Inquiry</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Inquiry Message</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Describe what you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2"
                >
                  Submit Inquiry <Send className="h-4 w-4" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
