import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, ImagePlus, Eye, ShoppingCart, DollarSign, Image, Save, ShieldCheck, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';

const MyStudio = () => {
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // 🖼️ तस्वीरें स्टोर करने की स्टेट (फोटोग्राफर के लिए उसकी खुद की, एडमिन के लिए सबकी)
  const [myPhotos, setMyPhotos] = useState([]);

  // 📸 फोटोग्राफर (वेंडर) अर्निंग स्टेट्स
  const [photographerData, setPhotographerData] = useState({ totalSoldPhotos: 0, netEarnings: '₹0.00', soldPhotosList: [] });
  const [upiId, setUpiId] = useState('');

  // 👑 एडमिन स्टेट्स (पेआउट मैट्रिक्स)
  const [adminReport, setAdminReport] = useState([]);

  useEffect(() => {
    const userRole = localStorage.getItem('role') || 'user';
    setRole(userRole);

    const fetchAllStudioData = async () => {
      try {
        setLoading(true);
        
        if (userRole === 'admin') {
          // 👑 1. एडमिन के लिए: पेआउट मैट्रिक्स रिपोर्ट लाएं
          const payoutRes = await API.get('/orders/admin-payouts-matrix');
          if (payoutRes.data.success) setAdminReport(payoutRes.data.payoutReport);

          // 👑 2. एडमिन के लिए: मार्केटप्लेस की सभी तस्वीरें लाएं ताकि वो डिलीट कर सके
          const photosRes = await API.get('/users/my-uploads');
          setMyPhotos(photosRes.data || []);
        } else {
          // 📸 फोटोग्राफर के लिए: 1. उसकी खुद की अपलोड की हुई तस्वीरें लाएं
          const photosRes = await API.get('/users/my-uploads');
          setMyPhotos(photosRes.data || []);

          // 📸 2. उसकी बिकी हुई तस्वीरों का अर्निंग डेटा लाएं
          const earningsRes = await API.get('/orders/photographer-dashboard');
          if (earningsRes.data.success) setPhotographerData(earningsRes.data);

          // 📸 3. यूज़र की वर्तमान UPI ID लोड करें
          const profileRes = await API.get('/users/profile'); 
          setUpiId(profileRes.data.upiId || '');
        }
      } catch (err) {
        console.error("Studio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudioData();
  }, []);

  // 🗑️ फोटो डिलीट करने का लाइव फंक्शन (मालिक या एडमिन दोनों के लिए वर्किंग)
  const handleDeleteAsset = async (photoId) => {
    if (!window.confirm("क्या आप वाकई इस तस्वीर को मार्केटप्लेस से हमेशा के लिए डिलीट करना चाहते हैं?")) return;

    try {
      await API.delete(`/users/photos/${photoId}`);
      // बिना पेज रिफ्रेश किए स्क्रीन से हटाओ
      setMyPhotos(prev => prev.filter(p => p._id !== photoId));
      setToast('🔥 Asset successfully deleted!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  // 💳 फोटोग्राफर द्वारा अपनी UPI ID अपडेट करने का हैंडलर
  const handleUpdateUpi = async () => {
    try {
      const res = await API.put('/orders/update-upi', { upiId });
      alert(res.data.message || "UPI ID सुरक्षित कर ली गई है!");
    } catch (err) {
      alert(err.response?.data?.message || "UPI ID अपडेट करने में विफल");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-12">
        <Loader2 className="animate-spin text-indigo-500" size={18} />
        <span>Syncing your Creator Studio matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-rose-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* =========================================================================
          👑 SECTION 1: ADMIN CONTROL TOP BANNER (केवल एडमिन को दिखेगा)
          ========================================================================= */}
      {role === 'admin' && (
        <div className="space-y-6 border-b border-slate-900 pb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 text-white">
              <ShieldCheck className="text-rose-400" /> Admin Control Studio
            </h2>
            <p className="text-xs text-slate-500 mt-1">सभी फोटोग्राफर्स की कुल बिक्री और 20% प्लेटफॉर्म कमीशन का लाइव रिकॉर्ड।</p>
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
              <tbody className="divide-y divide-slate-900/60 text-xs text-slate-300">
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
                            <p className="text-[10px] text-slate-500 font-normal">{vendor.photographerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <CreditCard size={12} className="text-indigo-400" /> {vendor.upiId}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-indigo-400">{vendor.totalPhotosSold} Pcs</td>
                      <td className="p-4 text-right text-slate-400 font-bold">₹{vendor.totalSalesAmount.toFixed(2)}</td>
                      <td className="p-4 text-right font-black text-emerald-400 text-sm">₹{vendor.amountToPay.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          📸 SECTION 2: PHOTOGRAPHER STATS BANNER (केवल नॉर्मल यूजर को दिखेगा)
          ========================================================================= */}
      {role !== 'admin' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">Creator Studio Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">अपनी बिकी हुई तस्वीरों का डेटा, शुद्ध कमाई और लाइव असेट्स ट्रैक करें।</p>
            </div>
            <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow-lg flex items-center gap-1.5">
              <ImagePlus size={14} /> Upload New Asset
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Net Earnings (After 20% Platform Fee)</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{photographerData.netEarnings}</h3>
              </div>
              <DollarSign size={32} className="text-emerald-500 bg-emerald-500/10 p-1.5 rounded-xl" />
            </div>
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Pictures Sold</p>
                <h3 className="text-2xl font-black text-indigo-400 mt-1">{photographerData.totalSoldPhotos} Units</h3>
              </div>
              <Image size={32} className="text-indigo-500 bg-indigo-500/10 p-1.5 rounded-xl" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4 max-w-md">
            <div>
              <h4 className="font-bold text-sm text-slate-300">Payout Settlement Account</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">इसी UPI ID पर आपका कमीशन काटकर सीधे पेमेंट सेंड किया जाएगा।</p>
            </div>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-2 text-xs w-full focus:outline-none focus:border-indigo-500 text-white"
              />
              <button onClick={handleUpdateUpi} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          🖼️ SECTION 3: THE LIVE GALLERY MATRIX (एडमिन को सबकी फ़ोटो, यूज़र को खुद की दिखेगी)
          ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white">
          {role === 'admin' ? "🛡️ System Global Gallery (All Uploads)" : `My Gallery Assets (${myPhotos.length})`}
        </h3>
        <p className="text-xs text-slate-500">
          {role === 'admin' ? "एडमिन पैनल से आप पूरे डेटाबेस की किसी भी तस्वीर को परमानेंटली डिलीट कर सकते हैं।" : ""}
        </p>

        {myPhotos.length === 0 ? (
          <div className="text-slate-500 font-bold text-sm py-12 border border-dashed border-slate-900 rounded-2xl text-center bg-slate-950/20">
            मार्केटप्लेस में कोई भी फोटो लोड नहीं हो सकी।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPhotos.map(photo => (
              <div key={photo._id} className="group bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-900 flex flex-col justify-between">
                <div className="relative aspect-video bg-slate-950">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-900 text-[10px] text-slate-400 font-mono">
                    {photo.category}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/20 border-t border-slate-900/30 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="truncate">
                      <h3 className="font-bold text-white text-sm truncate">{photo.title}</h3>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1 font-semibold">
                        <span className="flex items-center gap-0.5"><Eye size={12} /> {photo.views || 0}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      {photo.price}
                    </span>
                  </div>

                  {/* 🗑️ डिलीट बटन (मालिक या एडमिन दोनों के लिए एक्टिव) */}
                  <div className="pt-2 border-t border-slate-900/40 flex justify-end">
                    <button 
                      onClick={() => handleDeleteAsset(photo._id)}
                      className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-400 font-bold px-3 py-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={13} /> {role === 'admin' ? 'Purge From Platform' : 'Delete Asset'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudio;