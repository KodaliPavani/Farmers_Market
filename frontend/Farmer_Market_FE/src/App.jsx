import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import VendorDashboard from './Vendor/VendorDashboard';
import FarmerDashboard from './Farmer/FarmerDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import ProductListing from './Pages/ProductListing';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import Chat from './Pages/Chat';
import Profile from './Pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Dashboards */}
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/farmer" element={<FarmerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Sourcing pages */}
                <Route path="/products" element={<ProductListing />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

            {/* Clean Premium Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500 font-semibold tracking-wide uppercase mt-auto">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>© {new Date().getFullYear()} KrishiMandi Inc. All rights reserved.</span>
                <span className="text-[10px] text-slate-600">Empowering Street Sourcing & Local Farmers across India</span>
              </div>
            </footer>

          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
