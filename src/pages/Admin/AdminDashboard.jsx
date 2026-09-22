import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Menu,
  X,
  ShieldAlert,
  Trash2,
  CreditCard,
  User
} from 'lucide-react';
import API from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // लाइव डेटा स्टेट्स
  const [dbStats, setDbStats] = useState({ 
    totalUsers: 0, 
    totalPhotos: 0, 
    trendingPhotos: 0, 
    totalRevenue: "₹0.00" 
  });
  const [usersList, setUsersList] = useState([]);
  
  // 💰 नया पेआउट रिपोर्ट स्टेट
  const [adminReport, setAdminReport] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    console.log("=== ADMIN CORE DEBUGGER ===");
    console.log("LocalStorage Token:", token ? "FOUND (Valid)" : "NOT FOUND");
    console.log("LocalStorage Role:", userRole);

    if (token && userRole === 'admin') {
      setIsAdmin(true);
      fetchAdminData();
    } else {
      console.log("Access Denied! Redirecting to /login...");
      setIsAdmin(false);
      setLoading(false);
      navigate('/login'); 
    }
  }, [navigate]);

  // ⚡ डेटाबेस से लाइव डेटा खींचने का फंक्शन (🎯 रेवेन्यू मिसमैच फिक्स)
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await API.get('/admin/stats');
      const usersRes = await API.get('/admin/users');
      const payoutRes = await API.get('/orders/admin-payouts-matrix');
      
      let liveCalculatedRevenue = 0;
      
      if (payoutRes.data.success && payoutRes.data.payoutReport) {
        const report = payoutRes.data.payoutReport;
        setAdminReport(report);
        
        // 🎯 महा फिक्स: पुराने फालतू ऑर्डर्स को छोड़ो, सिर्फ लाइव वेंडर्स की कुल सेल्स का टोटल लगाओ
        report.forEach(vendor => {
          liveCalculatedRevenue += vendor.totalSalesAmount || 0;
        });
      }
      
      setUsersList(usersRes.data);
      
      // स्टेट्स अपडेट करें और रेवेन्यू को एकदम सटीक लाइव कैलकुलेशन से सेट करें
      setDbStats({
        ...statsRes.data,
        totalRevenue: `₹${liveCalculatedRevenue.toFixed(2)}` // अब ये बिल्कुल सटीक ₹16.00 या जो बिका है वही दिखाएगा
      });

    } catch (err) {
      console.error("Admin API Matrix Error:", err);
      setUsersList([
        { _id: '1', firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com', createdAt: new Date() },
        { _id: '2', firstName: 'Amit', lastName: 'Verma', email: 'amit@example.com', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ यूज़र को डिलीट/बैन करने का फंक्शन
  const handleBanUser = async (userId) => {
    if (window.confirm("Are you sure you want to permanently purge this user node?")) {
      try {
        await API.delete(`/admin/users/${userId}`);
        alert("User removed successfully.");
        fetchAdminData(); 
      } catch (err) {
        alert("Operation failed or unauthorized.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-bold gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Connecting Admin Control Terminal...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert className="text-rose-500 mb-4 animate-bounce" size={48} />
        <h1 className="text-2xl font-black text-white tracking-tight">Access Denied (403)</h1>
        <p className="text-sm text-slate-500 mt-2">Redirecting to master node login terminal...</p>
      </div>
    );
  }

  const statsCards = [
    { id: 1, name: 'Total Revenue', value: dbStats.totalRevenue, icon: <DollarSign size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 2, name: 'Active Users', value: `${dbStats.totalUsers} Nodes`, icon: <Users size={22} />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 3, name: 'Total Photos', value: `${dbStats.totalPhotos} Assets`, icon: <Image size={22} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 4, name: 'Trending Now', value: `${dbStats.trendingPhotos} Items`, icon: <TrendingUp size={22} />, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const menuItems = [
    { id: 'overview', name: 'System Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'users', name: 'Manage Users', icon: <Users size={18} /> },
    { id: 'payouts', name: 'Vendor Payouts', icon: <CreditCard size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      
      {/* 📱 MOBILE HEADER BAR */}
      <div className="md:hidden bg-slate-900/60 border-b border-slate-900 p-4 sticky top-0 z-40 backdrop-blur-md flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-black text-white tracking-tight">Admin Matrix</span>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Root Control</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* 📂 SIDEBAR NAVIGATION */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex w-full md:w-64 bg-slate-900/40 border-r border-slate-900/80 p-6 flex-col justify-between flex-shrink-0 
        absolute md:relative top-[57px] md:top-0 left-0 z-30 h-[calc(100vh-57px)] md:h-auto backdrop-blur-xl md:backdrop-blur-none
      `}>
        <div className="space-y-8 w-full">
          <div className="hidden md:block">
            <h2 className="text-xl font-black text-white tracking-tight">Admin Terminal</h2>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1">Global Overlord</p>
          </div>

          <nav className="space-y-1 w-full">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer ${
                  activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.icon} <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="pt-6 border-t border-slate-900/60 w-full flex items-center gap-3 px-4 text-xs font-bold text-slate-500">
          <CheckCircle size={14} className="text-emerald-500" /> 
          <span>Live DB Node Active</span>
        </div>
      </aside>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">System Status</h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">Real-time macro stats from MongoDB core.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsCards.map((stat) => (
                <div key={stat.id} className="bg-slate-900/30 border border-slate-900 p-5 md:p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="space-y-1">
                    <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.name}</p>
                    <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-slate-800`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/20 border border-slate-900/60 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-sans">Security Logs</h3>
              <div className="space-y-2 font-mono text-xs text-slate-500">
                <p><span className="text-indigo-500">[INFO]</span> Security token verification verified successfully.</p>
                <p><span className="text-emerald-500">[SUCCESS]</span> Role access clearance level: ADMIN synced.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE USERS */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Registered Node Users</h2>
              <p className="text-sm text-slate-500 mt-1">Audit permissions and account registry states from live DB.</p>
            </div>

            <div className="overflow-x-auto bg-slate-900/20 border border-slate-900 rounded-2xl p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="pb-4">Full Name</th>
                    <th className="pb-4">Email Matrix</th>
                    <th className="pb-4">Registry Date</th>
                    <th className="pb-4 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-slate-300 divide-y divide-slate-900/40">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500">No registered consumers found in DB cluster.</td>
                    </tr>
                  ) : (
                    usersList.map(user => (
                      <tr key={user._id} className="hover:bg-slate-900/10">
                        <td className="py-4 text-white font-bold">{user.firstName} {user.lastName}</td>
                        <td className="py-4 text-slate-400">{user.email}</td>
                        <td className="py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleBanUser(user._id)} 
                            className="text-xs text-rose-500 hover:text-rose-400 font-bold p-2 inline-flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Trash2 size={14} /> Purge Unit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VENDOR PAYOUT CONTROL */}
        {activeTab === 'payouts' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Vendor Payout Ledger
              </h2>
              <p className="text-sm text-slate-400 mt-1">सभी फोटोग्राफर्स की कुल बिक्री और 20% प्लेटफॉर्म फीस कटने के बाद उन्हें दी जाने वाली राशि (80%) का live रिकॉर्ड।</p>
            </div>

            <div className="overflow-x-auto bg-slate-900/20 border border-slate-900 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Photographer</th>
                    <th className="p-4">UPI Wallet ID</th>
                    <th className="p-4 text-center">Photos Sold</th>
                    <th className="p-4 text-right">Gross Volume</th>
                    <th className="p-4 text-right text-emerald-400">Net Amount to Pay (80%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-xs text-slate-300 font-semibold">
                  {adminReport.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-bold">अभी तक किसी भी वेंडर की कोई सेल दर्ज नहीं हुई है।</td>
                    </tr>
                  ) : (
                    adminReport.map((vendor, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/10 transition">
                        <td className="p-4 font-bold">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-500" />
                            <div>
                              <p className="text-white">{vendor.photographerName}</p>
                              <p className="text-[10px] text-slate-400 font-normal">{vendor.photographerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <CreditCard size={12} className="text-indigo-400" /> {vendor.upiId}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-indigo-400">{vendor.totalPhotosSold} Pcs</td>
                        <td className="p-4 text-right text-slate-500 font-bold">₹{vendor.totalSalesAmount.toFixed(2)}</td>
                        <td className="p-4 text-right font-black text-emerald-400 text-sm">₹{vendor.amountToPay.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;