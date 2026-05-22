import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tractor, Plus, Check, X, ShieldAlert, BarChart2, TrendingUp, AlertCircle, ShoppingBag, 
  Trash2, Edit, Calendar, User as UserIcon, MessageSquare, Upload, Loader2, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const FarmerDashboard = () => {
  const { user } = useAuth();
  
  const [analytics, setAnalytics] = useState(null);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formUnit, setFormUnit] = useState('KG');
  const [formFreshness, setFormFreshness] = useState('Excellent');
  const [formImage, setFormImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Stock Quick-Patch State
  const [editingStockId, setEditingStockId] = useState(null);
  const [quickStockVal, setQuickStockVal] = useState('');

  // Form Errors State
  const [formErrors, setFormErrors] = useState({});

  // Premium Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchFarmerDashboardData = async () => {
    try {
      const token = localStorage.getItem('km_token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Categories
      try {
        const catRes = await axios.get('http://localhost:8080/api/categories', { headers });
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching categories, falling back to seeds:", err);
        setCategories([
          { id: "c1000000-0000-0000-0000-000000000001", name: "Fresh Vegetables" },
          { id: "c1000000-0000-0000-0000-000000000002", name: "Groceries & Grains" },
          { id: "c1000000-0000-0000-0000-000000000003", name: "Oils & Ghee" },
          { id: "c1000000-0000-0000-0000-000000000004", name: "Spices & Masalas" },
          { id: "c1000000-0000-0000-0000-000000000005", name: "Dairy Products" }
        ]);
      }

      // 2. Fetch Analytics
      try {
        const res = await axios.get(`http://localhost:8080/api/analytics/farmer/${user?.id || 'me'}`, { headers });
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching farmer analytics:", err);
      }

      // 3. Fetch Farmer Orders (filter for pending ones to review)
      try {
        const res = await axios.get(`http://localhost:8080/api/orders/farmer/${user?.id || 'me'}`, { headers });
        setIncomingOrders(res.data.filter(o => o.status === 'PENDING'));
      } catch (err) {
        console.error("Error fetching farmer orders:", err);
      }

      // 4. Fetch Farmer Listings
      try {
        const res = await axios.get(`http://localhost:8080/farmer/products`, { headers });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching farmer products:", err);
      }
    } catch (err) {
      console.error("Error loading farmer dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFarmerDashboardData();
    }
  }, [user]);

  // Image Upload Logic (simulated preview / base64 extraction)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Validation Logic
  const validateForm = () => {
    const errors = {};
    if (!formName.trim()) errors.name = "Product name is required.";
    if (!formCategory) errors.category = "Category is required.";
    if (!formDescription.trim()) errors.description = "Description is required.";
    
    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = "Price must be greater than zero.";
    }

    const parsedStock = parseFloat(formStock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      errors.stock = "Stock quantity cannot be negative.";
    }

    if (!formUnit) errors.unit = "Unit is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormDescription('');
    setFormPrice('');
    setFormStock('');
    setFormUnit('KG');
    setFormFreshness('Excellent');
    setFormImage('');
    setImagePreview('');
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Category fallback if empty
      const targetCatId = formCategory || categories[0]?.id;

      // Realistic Unsplash fallback image matching category selection
      let finalImg = formImage;
      if (!finalImg) {
        const catObj = categories.find(c => c.id === targetCatId);
        const catName = catObj?.name?.toLowerCase() || '';
        if (catName.includes('vegetable')) finalImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500';
        else if (catName.includes('oil')) finalImg = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500';
        else if (catName.includes('spice')) finalImg = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500';
        else if (catName.includes('dairy')) finalImg = 'https://images.unsplash.com/photo-1634149737683-8f5507552d04?w=500';
        else finalImg = 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500';
      }

      await axios.post('http://localhost:8080/farmer/products', {
        name: formName,
        description: formDescription,
        price: parseFloat(formPrice),
        stockQuantity: parseFloat(formStock),
        unit: formUnit,
        freshnessStatus: formFreshness,
        imageUrl: finalImg,
        categoryId: targetCatId
      }, { headers });

      setShowAddModal(false);
      showToast("Produce Listing added successfully to the Mandi!");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error creating product:", err);
      showToast(err.response?.data?.message || "Failed to add product.", "error");
    }
  };

  const handleOpenEditModal = (p) => {
    setSelectedProduct(p);
    setFormName(p.name);
    setFormCategory(p.category?.id || categories[0]?.id || '');
    setFormDescription(p.description || '');
    setFormPrice(p.price.toString());
    setFormStock(p.stockQuantity.toString());
    setFormUnit(p.unit || 'KG');
    setFormFreshness(p.freshnessStatus || 'Excellent');
    setFormImage(p.imageUrl || '');
    setImagePreview(p.imageUrl || '');
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`http://localhost:8080/farmer/products/${selectedProduct.id}`, {
        name: formName,
        description: formDescription,
        price: parseFloat(formPrice),
        stockQuantity: parseFloat(formStock),
        unit: formUnit,
        freshnessStatus: formFreshness,
        imageUrl: formImage,
        categoryId: formCategory
      }, { headers });

      setShowEditModal(false);
      showToast("Produce Listing updated successfully!");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error updating product:", err);
      showToast("Failed to update product details.", "error");
    }
  };

  const handleOpenDeleteModal = (p) => {
    setSelectedProduct(p);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:8080/farmer/products/${selectedProduct.id}`, { headers });
      
      setShowDeleteModal(false);
      showToast("Product deleted successfully!");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Failed to delete product.", "error");
    }
  };

  const handleQuickStockUpdate = async (prodId) => {
    const val = parseFloat(quickStockVal);
    if (isNaN(val) || val < 0) {
      showToast("Stock quantity cannot be negative.", "error");
      return;
    }

    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:8080/farmer/products/${prodId}/stock`, {
        stockQuantity: val
      }, { headers });

      setEditingStockId(null);
      setQuickStockVal('');
      showToast("Stock level patched successfully!");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error updating stock:", err);
      showToast("Failed to update stock level.", "error");
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=ACCEPTED`, null, { headers });
      showToast("Order accepted successfully! Keep packing.");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      const token = localStorage.getItem('km_token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=REJECTED`, null, { headers });
      showToast("Order declined.");
      fetchFarmerDashboardData();
    } catch (err) {
      console.error("Error rejecting order:", err);
    }
  };

  // Dynamic Metrics calculation based strictly on logged-in farmer products
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (parseFloat(p.stockQuantity) || 0), 0);
  const activeProducts = products.filter(p => (parseFloat(p.stockQuantity) || 0) > 0).length;
  const lowStockProducts = products.filter(p => (parseFloat(p.stockQuantity) || 0) <= 50).length;

  const totalSales = analytics?.totalSales || 0;
  const salesHistory = analytics?.salesTrend && analytics.salesTrend.length > 0
    ? analytics.salesTrend
    : [{ month: 'No Data', sales: 0 }];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border font-semibold text-xs transition-all ${
              toast.type === 'error' 
                ? 'bg-rose-50 border-rose-100 text-rose-700' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex flex-col gap-8 text-left">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Namaste, {user?.name}!</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Farmer Portal • Green Valley Farms</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md shadow-primary-200 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Produce Listing
          </button>
        </div>

        {/* Dynamic Farmer Verification Alert Banner */}
        {user && !user.verified && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-3xl flex gap-3 items-start">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Farm Verification Pending</p>
              <p className="text-[10px] text-amber-700 leading-normal mt-0.5">Your farming certificate is undergoing verification by the APMC Mandi Admin. You can still list and edit products, but verified badge will appear after approval.</p>
            </div>
          </div>
        )}

        {/* Quick analytics stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalProducts}</p>
              <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-2 inline-block">Registered listings</span>
            </div>
            <span className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-lg">🌾</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock</span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalStock} Units</p>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">Mandi supply capacity</span>
            </div>
            <span className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-lg">📦</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{activeProducts}</p>
              <span className="text-[8px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-2 inline-block">Live on wholesale marketplace</span>
            </div>
            <span className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-lg">🔥</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Products</span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{lowStockProducts}</p>
              <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-2 inline-block">Need harvesting updates</span>
            </div>
            <span className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-lg">⚠️</span>
          </div>
        </div>

        {/* Incoming Orders & Active Produce Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Direct incoming vendor orders */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Direct Incoming Orders</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Needs farmer acceptance</p>
            </div>

            {incomingOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                No pending incoming orders at this time.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {incomingOrders.map(o => (
                  <div key={o.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 hover:shadow-sm transition-all text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs text-slate-800">{o.vendor?.shopName || o.vendor?.user?.name || "Direct Vendor"}</span>
                        <p className="text-[10px] text-slate-400 font-medium">Placed {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}</p>
                      </div>
                      <span className="font-extrabold text-xs text-slate-800">Rs. {o.totalAmount}</span>
                    </div>

                    <p className="text-[10.5px] text-slate-500 font-semibold bg-white border border-slate-100 rounded-xl p-2.5">
                      {o.items && o.items.length > 0
                        ? o.items.map(item => `${item.product?.name || 'Produce'} (${item.quantity} ${item.product?.unit || 'Units'})`).join(', ')
                        : 'Produce Items Sourced'}
                    </p>

                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleReject(o.id)}
                        className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </button>
                      <button 
                        onClick={() => handleAccept(o.id)}
                        className="py-1.5 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer shadow-md shadow-primary-200"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Product Listings Table/Card */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Active Harvest Listings</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Currently listing on live mandi</p>
              </div>
              <button 
                onClick={handleOpenAddModal}
                className="text-xs text-primary-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {products.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center gap-2">
                  <span>No products uploaded yet</span>
                  <button 
                    onClick={handleOpenAddModal}
                    className="text-primary-600 font-bold underline hover:text-primary-700 cursor-pointer"
                  >
                    Start adding products
                  </button>
                </div>
              ) : (
                products.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:shadow-sm transition-all text-left">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'} 
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 block">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {editingStockId === p.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                className="w-12 px-1 py-0.5 border rounded text-[10px] font-bold outline-none"
                                value={quickStockVal}
                                onChange={(e) => setQuickStockVal(e.target.value)}
                                placeholder="Qty"
                              />
                              <button 
                                onClick={() => handleQuickStockUpdate(p.id)}
                                className="bg-primary-600 text-white p-0.5 rounded hover:bg-primary-700"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => setEditingStockId(null)}
                                className="bg-slate-200 text-slate-600 p-0.5 rounded hover:bg-slate-300"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setEditingStockId(p.id);
                                setQuickStockVal(p.stockQuantity.toString());
                              }}
                              className="text-[10px] text-slate-400 hover:text-primary-600 font-semibold"
                            >
                              Stock: <span className="underline font-bold text-slate-600">{p.stockQuantity} {p.unit}</span>
                            </button>
                          )}
                          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            p.freshnessStatus === 'Excellent' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.freshnessStatus || 'Good'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-extrabold text-xs text-primary-600">Rs. {p.price}/{p.unit}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(p)}
                          className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:text-rose-500 rounded-xl text-slate-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* --- ADD PRODUCT SLIDING MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Add Mandi Produce</h3>
                  <p className="text-xs text-slate-400 mt-0.5">List a new vegetable or grain to start sourcing</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g., Organic Red Tomatoes"
                    className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                  {formErrors.name && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.name}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
                    <select 
                      className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selling Unit *</label>
                    <select 
                      className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                    >
                      <option value="KG">KG</option>
                      <option value="Litre">Litre</option>
                      <option value="Dozen">Dozen</option>
                      <option value="Bunch">Bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (per unit) *</label>
                    <input 
                      type="number"
                      required
                      placeholder="E.g., 32"
                      className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                    {formErrors.price && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.price}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Quantity *</label>
                    <input 
                      type="number"
                      required
                      placeholder="E.g., 250"
                      className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                    />
                    {formErrors.stock && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.stock}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freshness Status</label>
                  <select 
                    className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                    value={formFreshness}
                    onChange={(e) => setFormFreshness(e.target.value)}
                  >
                    <option value="Excellent">Excellent (Freshly Picked Today)</option>
                    <option value="Very Fresh">Very Fresh (1-2 days ago)</option>
                    <option value="Good">Good Condition</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe size, quality, cultivation type (organic, natural etc)..."
                    className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                  {formErrors.description && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.description}</span>}
                </div>

                {/* File picker & image preview */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Image Upload</label>
                  <div className="flex gap-4 items-center">
                    <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold w-24 h-24">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-100"
                      />
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-4"
                >
                  List Produce <Tractor className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT PRODUCT SLIDING MODAL --- */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Edit Produce Listing</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Modify pricing, stock levels, or images</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditProduct} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g., Organic Red Tomatoes"
                    className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                  {formErrors.name && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.name}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
                    <select 
                      className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selling Unit *</label>
                    <select 
                      className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                    >
                      <option value="KG">KG</option>
                      <option value="Litre">Litre</option>
                      <option value="Dozen">Dozen</option>
                      <option value="Bunch">Bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (per unit) *</label>
                    <input 
                      type="number"
                      required
                      placeholder="E.g., 32"
                      className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                    {formErrors.price && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.price}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Quantity *</label>
                    <input 
                      type="number"
                      required
                      placeholder="E.g., 250"
                      className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                    />
                    {formErrors.stock && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.stock}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freshness Status</label>
                  <select 
                    className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none"
                    value={formFreshness}
                    onChange={(e) => setFormFreshness(e.target.value)}
                  >
                    <option value="Excellent">Excellent (Freshly Picked Today)</option>
                    <option value="Very Fresh">Very Fresh (1-2 days ago)</option>
                    <option value="Good">Good Condition</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe size, quality, cultivation type (organic, natural etc)..."
                    className="w-full px-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                  {formErrors.description && <span className="text-[10px] text-rose-500 font-semibold">{formErrors.description}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Image Upload</label>
                  <div className="flex gap-4 items-center">
                    <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold w-24 h-24">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-100"
                      />
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-4"
                >
                  Save Changes <Check className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE MODAL --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 text-center items-center relative z-10"
            >
              <span className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                <Trash2 className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Delete Produce Listing?</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">Are you sure you want to delete this product? This action is permanent and will remove it from live wholesale mandi instantly.</p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  No, Cancel
                </button>
                <button 
                  onClick={handleDeleteProduct}
                  className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FarmerDashboard;
