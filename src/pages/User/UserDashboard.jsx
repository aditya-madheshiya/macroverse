import React, { useState, useEffect } from 'react';
import { LayoutDashboard, User, Heart, Image, Download, ShoppingBag, Settings, LogOut, DollarSign, ShoppingCart, Camera, ShieldAlert, TrendingUp } from 'lucide-react';
import API from '../../api/axiosInstance';

// सभी असली सब-मॉड्यूल्स इम्पोर्ट
import Profile from './Profile';
import Wishlist from './Wishlist';
import MyDownloads from './MyDownloads';
import MyOrders from './MyOrders';
import Cart from './Cart';
import MyStudio from './MyStudio'; // यह कंपोनेंट एडमिन होने पर सबको डिलीट करने की अनुमति देता है
import AdminSalesLog from './AdminSalesLog'; // 👈 एडमिन की खुद की बिक्री देखने के लिए इम्पोर्ट

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeDashboardTab') || 'dashboard';
  });

  const [userRole, setUserRole] = useState('user');
  const [stats, setStats] = useState({
    userName: 'User',
    purchasedCount: 0,
    downloadsCount: 0,
    likedCount: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role') || 'user';
    setUserRole(role);

    const fetchDashboardStats = async () => {
      try {
        const res = await API.get('/users/dashboard-summary');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching live stats", err);
        // 🎯 फिक्स: एरर आने पर भी कोई गलत डमी डेटा सेट नहीं होगा
        setStats({
          userName: localStorage.getItem('userName') || 'Premium User',
          purchasedCount: 0,
          downloadsCount: 0,
          likedCount: 0,
          totalSpent: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();

    const handleTabSync = () => {
      const savedTab = localStorage.getItem('activeDashboardTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    };

    window.addEventListener('storageTabChange', handleTabSync);
    handleTabSync();

    return () => window.removeEventListener('storageTabChange', handleTabSync);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('activeDashboardTab', tabId);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', shortName: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', name: 'My Profile', shortName: 'Profile', icon: <User size={18} /> },
    { 
      id: 'studio', 
      name: userRole === 'admin' ? 'Admin Control Studio' : 'My Studio (Sell Logs)', 
      shortName: 'Studio', 
      icon: userRole === 'admin' ? <ShieldAlert size={18} className="text-rose-400" /> : <Camera size={18} /> 
    },
    // 🎯 अगर यूजर एडमिन है तो उसकी खुद की बिकी हुई तस्वीरों का टैब जोड़ें
    ...(userRole === 'admin' ? [{
      id: 'mysales',
      name: 'My Sales Ledger',
      shortName: 'Sales',
      icon: <TrendingUp size={18} className="text-emerald-400" />
    }] : []),
    { id: 'liked', name: 'Liked Photos', shortName: 'Liked', icon: <Heart size={18} /> },
    { id: 'purchased', name: 'Purchased', shortName: 'Purchased', icon: <Image size={18} /> },
    { id: 'downloads', name: 'Downloads', shortName: 'Downloads', icon: <Download size={18} /> },
    { id: 'orders', name: 'My Orders', shortName: 'Orders', icon: <ShoppingBag size={18} /> },
    { id: 'cart', name: 'My Cart', shortName: 'Cart', icon: <ShoppingCart size={18} /> },
    { id: 'settings', name: 'Settings', shortName: 'Settings', icon: <Settings size={18} /> },
  ];

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 font-bold flex items-center justify-center">Syncing Secure Nodes...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* 💻 DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-slate-900/40 border-r border-slate-900/80 p-6 flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {userRole === 'admin' ? 'Admin Terminal' : 'Control Panel'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {userRole === 'admin' ? 'Global System Override' : 'Manage asset matrix'}
            </p>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer ${
                  activeTab === item.id || (item.id === 'cart' && activeTab === 'checkout')
                    ? userRole === 'admin' && item.id === 'studio' 
                      ? 'bg-rose-600 text-white shadow-lg' 
                      : 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-950/20 mt-6 cursor-pointer">
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* 📱 MOBILE HORIZONTAL MENU */}
      <div className="md:hidden bg-slate-900/30 border-b border-slate-900 overflow-x-auto scrollbar-none sticky top-20 z-40 backdrop-blur-md">
        <div className="flex gap-2 p-4 whitespace-nowrap min-w-max">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                activeTab === item.id || (item.id === 'cart' && activeTab === 'checkout')
                  ? userRole === 'admin' && item.id === 'studio' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white' 
                  : 'bg-slate-950 border border-slate-900 text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.shortName}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-900 text-rose-400">
            <LogOut size={14} /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 🖥️ MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {userRole === 'admin' ? '👑 System Overlord:' : 'Welcome Back,'} {stats.userName}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                {userRole === 'admin' ? 'मार्केटप्लेस का लाइव सुरक्षा डेटा और सिस्टम लॉग्स।' : 'Account overview logs.'}
              </p>
            </div>

            {/* 📊 लाइव स्टैट्स ग्रिड */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-slate-900/30 border border-slate-900 p-5 md:p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">
                    {userRole === 'admin' ? 'System Users' : 'Total Purchased'}
                  </p>
                  <p className="text-xl md:text-2xl font-black text-white">
                    {userRole === 'admin' ? 'Authorized' : `${stats.purchasedCount} Assets`}
                  </p>
                </div>
                <div className="text-indigo-400"><Image size={22} /></div>
              </div>
              <div className="bg-slate-900/30 border border-slate-900 p-5 md:p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">Total Downloads</p>
                  <p className="text-xl md:text-2xl font-black text-white">{stats.downloadsCount} Files</p>
                </div>
                <div className="text-purple-400"><Download size={22} /></div>
              </div>
              <div className="bg-slate-900/30 border border-slate-900 p-5 md:p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">Total Liked</p>
                  <p className="text-xl md:text-2xl font-black text-white">{stats.likedCount} Items</p>
                </div>
                <div className="text-rose-400"><Heart size={22} /></div>
              </div>
              <div className="bg-slate-900/30 border border-slate-900 p-5 md:p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">
                    {userRole === 'admin' ? 'Platform Ledger' : 'Total Spent'}
                  </p>
                  <p className="text-xl md:text-2xl font-black text-emerald-400">
                    {userRole === 'admin' ? 'Live Balance' : `₹${Number(stats.totalSpent).toFixed(2)}`}
                  </p>
                </div>
                <div className="text-emerald-400"><DollarSign size={22} /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && <Profile />}
        {activeTab === 'studio' && <MyStudio />}
        {/* 🎯 Admin Sales Log Tab Content */}
        {activeTab === 'mysales' && userRole === 'admin' && <AdminSalesLog />}
        {activeTab === 'liked' && <Wishlist type="liked" />}
        {activeTab === 'purchased' && <Wishlist type="purchased" />} 
        {activeTab === 'downloads' && <MyDownloads />}
        {activeTab === 'orders' && <MyOrders />}
        {activeTab === 'cart' && <Cart onCheckout={() => handleTabChange('checkout')} />}
        {activeTab === 'checkout' && <Checkout onOrderSuccess={() => handleTabChange('orders')} />}
        
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-2xl font-black text-white">Account Settings</h2>
              <p className="text-sm text-slate-500 mt-1">Configure security nodes and configurations.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
              <button className="w-full text-left p-4 bg-slate-950 border border-slate-850 rounded-xl text-sm font-bold text-slate-300 hover:border-indigo-500/50 transition">Change Access Password</button>
              <button className="w-full text-left p-4 bg-slate-950 border border-slate-850 rounded-xl text-sm font-bold text-slate-300 hover:border-indigo-500/50 transition">Enable Two-Factor Nodes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;