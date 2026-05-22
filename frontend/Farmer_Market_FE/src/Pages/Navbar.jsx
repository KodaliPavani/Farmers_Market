import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, Bell, User as UserIcon, LogOut, Menu, X, 
  MapPin, ShoppingCart, MessageSquare, BarChart2, Shield, Settings, HelpCircle
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to KrishiMandi!', message: 'Buy directly from local farmers at wholesale rates.', read: false },
    { id: 2, title: 'Order Accepted', message: 'Ramesh Patel accepted your order of organic tomatoes.', read: true }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'FARMER') return '/farmer';
    return '/vendor';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-primary-200">
                KM
              </span>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  Krishi<span className="text-secondary-500">Mandi</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 hidden sm:block uppercase">Direct Farm Sourcing</p>
              </div>
            </Link>

            {/* Geolocation Tag for Vendors */}
            {user && user.role === 'VENDOR' && (
              <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-500 max-w-[200px] truncate">
                <MapPin className="h-3 w-3 text-secondary-500 animate-bounce" />
                <span className="truncate">{user.address || 'HSR Layout, Bengaluru'}</span>
              </div>
            )}
          </div>

          {/* Center Navigation links - Role dependent */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Contact</Link>
            
            {user && (
              <>
                <Link to={getDashboardLink()} className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                  {user.role === 'ADMIN' && <Shield className="h-4 w-4" />}
                  {user.role === 'VENDOR' && <ShoppingBag className="h-4 w-4" />}
                  {user.role === 'FARMER' && <BarChart2 className="h-4 w-4" />}
                  Dashboard
                </Link>

                {user.role === 'VENDOR' && (
                  <>
                    <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Browse Mandi</Link>
                    <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-slate-400" /> Chat
                    </Link>
                  </>
                )}

                {user.role === 'FARMER' && (
                  <>
                    <Link to="/chat" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-slate-400" /> Vendor Chats
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* Cart Icon (Vendor Only) */}
            {(!user || user.role === 'VENDOR') && (
              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all">
                <ShoppingCart className="h-5.5 w-5.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary-500 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="relative p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all"
                  >
                    <Bell className="h-5.5 w-5.5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-secondary-500 rounded-full border border-white"></span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-semibold text-sm text-slate-700">Notifications</span>
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                          className="text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 flex flex-col gap-1 hover:bg-slate-50/50 cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-xs text-slate-800">{n.title}</span>
                              {!n.read && <span className="h-1.5 w-1.5 bg-secondary-500 rounded-full"></span>}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">{n.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-50 text-center bg-slate-50">
                        <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-2 pr-2 border border-slate-150 hover:bg-slate-50 rounded-full transition-all cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-xs border border-primary-200 uppercase select-none">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 hidden sm:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown panel */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-50 flex flex-col">
                        <span className="font-semibold text-sm text-slate-800">{user.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</span>
                      </div>
                      
                      <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2 transition-colors">
                        <UserIcon className="h-4 w-4" /> My Profile
                      </Link>
                      
                      <Link to={getDashboardLink()} onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2 transition-colors">
                        <Settings className="h-4 w-4" /> My Dashboard
                      </Link>

                      <Link to="/about" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2 transition-colors">
                        <HelpCircle className="h-4 w-4" /> Support & FAQs
                      </Link>

                      <hr className="border-slate-50 my-1" />

                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Login / Register Buttons for Guests */}
            {!user && (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-bold bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-xl shadow-md shadow-primary-200 transition-all">
                  Join Mandi
                </Link>
              </div>
            )}

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-50 bg-white px-4 py-3 space-y-2 shadow-inner">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 hover:text-primary-600 text-sm">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 hover:text-primary-600 text-sm">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 hover:text-primary-600 text-sm">Contact Us</Link>
          
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-primary-600 text-sm">My Dashboard</Link>
              {user.role === 'VENDOR' && (
                <>
                  <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-primary-600 text-sm">Browse Products</Link>
                  <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-primary-600 text-sm">Live Chat</Link>
                </>
              )}
              {user.role === 'FARMER' && (
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-primary-600 text-sm">Vendor Chats</Link>
              )}
              <hr className="border-slate-50 my-2" />
              <button 
                onClick={handleLogout}
                className="w-full text-left py-2 font-semibold text-rose-600 text-sm flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-semibold text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold bg-primary-600 text-white py-2.5 rounded-xl text-sm">
                Register as Vendor/Farmer
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
