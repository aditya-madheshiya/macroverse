import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Loader2, 
  ImagePlus, 
  Eye, 
  ShoppingCart, 
  DollarSign, 
  Image, 
  Save, 
  ShieldCheck, 
  User, 
  CreditCard,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';

const MyStudio = () => {
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // 🖼️ तस्वीरें स्टोर करने की स्टेट
  const [myPhotos, setMyPhotos] = useState([]);

  // 📸 फोटोग्राफर (वेंडर) अर्निंग स्टेट्स (पुरानी शुद्ध कमाई)
  const [photographerData, setPhotographerData] = useState({ totalSoldPhotos: 0, netEarnings: '₹0.00', grossSales: '₹0.00', soldPhotosList: [] });
  const [upiId, setUpiId] = useState('');
  
  // 💳 3-वे वॉलेट लाइव स्टेट्स
  const [walletData, setWalletData] = useState({
    availableBalance: null,
    pendingAmount: '0.00',
    paidOutAmount: '0.00'
  });

  // 💸 विथड्रॉ स्टेट्स
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState({ type: '', text: '' });

  // 👑 एडमिन स्टेट्स (पेआउट मैट्रिक्स)
  const [adminReport, setAdminReport] = useState([]);

  const fetchAllStudioData = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem('role') || 'user';
      setRole(userRole);
      
      if (userRole === 'admin') {
        const payoutRes = await API.get('/orders/admin-payouts-matrix');
        if (payoutRes.data?.success) setAdminReport(payoutRes.data.payoutReport || []);

        const photosRes = await API.get('/users/my-uploads');
        setMyPhotos(photosRes.data || []);
      } else {
        // 📸 1. अपलोड की हुई तस्वीरें लाएं
        const photosRes = await API.get('/users/my-uploads');
        setMyPhotos(photosRes.data || []);

        // 📸 2. पुरानी लाइव कमाई फेच करें (/orders/photographer-dashboard और /users/creator-sales दोनों चेक)
        let loadedNetEarnings = 0;
        let loadedSoldPhotos = 0;

        try {
          const earningsRes = await API.get('/orders/photographer-dashboard');
          if (earningsRes.data?.success) {
            setPhotographerData(earningsRes.data);
            loadedNetEarnings = parseFloat(String(earningsRes.data.netEarnings || '0').replace(/[^0-9.]/g, '')) || 0;
            loadedSoldPhotos = Number(earningsRes.data.totalSoldPhotos) || 0;
          }
        } catch (dashErr) {
          console.warn("photographer-dashboard error, trying creator-sales fallback");
        }

        // अगर डैशबोर्ड से 0 मिला तो creator-sales से क्रॉस-चेक करें
        if (loadedNetEarnings === 0) {
          try {
            const salesRes = await API.get('/users/creator-sales');
            const gross = parseFloat(String(salesRes.data?.totalEarned || '0').replace(/[^0-9.]/g, '')) || 0;
            const net80 = gross * 0.80;
            const count = Number(salesRes.data?.soldItemsCount) || 0;

            if (net80 > 0) {
              loadedNetEarnings = net80;
              loadedSoldPhotos = count;
              setPhotographerData({
                totalSoldPhotos: count,
                grossSales: `₹${gross.toFixed(2)}`,
                netEarnings: `₹${net80.toFixed(2)}`,
                soldPhotosList: salesRes.data?.salesLog || []
              });
            }
          } catch (salesErr) {
            console.error("Sales fetch error:", salesErr);
          }
        }

        // 📸 3. नया वॉलेट डेटा लाएं (अगर पेंडिंग या पेड है)
        try {
          const walletRes = await API.get('/orders/payout/my-wallet');
          if (walletRes.data?.success) {
            setWalletData({
              availableBalance: walletRes.data.availableBalance,
              pendingAmount: walletRes.data.pendingAmount || '0.00',
              paidOutAmount: walletRes.data.paidOutAmount || '0.00'
            });
          }
        } catch (wErr) {
          console.warn("Wallet route not yet initialized, using legacy earnings");
        }

        // 📸 4. UPI ID लोड करें
        const profileRes = await API.get('/users/profile'); 
        if (profileRes.data?.upiId) {
          setUpiId(profileRes.data.upiId);
        }
      }
    } catch (err) {
      console.error("Studio fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudioData();
  }, []);

  // 💰 सटीक उपलब्ध कमाई (अगर वॉलेट ने वैल्यू नहीं दी तो पुरानी नेट कमाई दिखेगी)
  const legacyNetNum = parseFloat(String(photographerData.netEarnings || '0').replace(/[^0-9.]/g, '')) || 0;
  
  const currentAvailable = walletData.availableBalance !== null && Number(walletData.availableBalance) > 0
    ? parseFloat(walletData.availableBalance)
    : legacyNetNum;

  const isEligibleForPayout = currentAvailable >= 100;
  const progressPercent = Math.min(100, (currentAvailable / 100) * 100);

  // 🗑️ फोटो डिलीट करने का फंक्शन
  const handleDeleteAsset = async (photoId) => {
    if (!window.confirm("क्या आप वाकई इस तस्वीर को मार्केटप्लेस से हमेशा के लिए डिलीट करना चाहते हैं?")) return;

    try {
      await API.delete(`/users/photos/${photoId}`);
      setMyPhotos(prev => prev.filter(p => p._id !== photoId));
      setToast('🔥 Asset successfully deleted!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  // 💳 UPI ID अपडेट करने का हैंडलर
  const handleUpdateUpi = async () => {
    if (!upiId || !upiId.includes('@')) {
      alert("कृपया एक वैध UPI ID दर्ज करें (उदा. user@okhdfcbank)");
      return;
    }

    try {
      const res = await API.put('/orders/update-upi', { upiId });
      alert(res.data?.message || "UPI ID सुरक्षित कर ली गई है!");
    } catch (err) {
      alert(err.response?.data?.message || "UPI ID अपडेट करने में विफल");
    }
  };

  // 💸 विथड्रॉ रिक्वेस्ट भेजने का हैंडलर
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setPayoutMsg({ type: '', text: '' });

    const reqAmt = parseFloat(withdrawAmount);

    if (currentAvailable < 100) {
      setPayoutMsg({ type: 'error', text: 'न्यूनतम निकासी सीमा ₹100 है। आपका उपलब्ध बैलेंस अभी कम है।' });
      return;
    }

    if (!reqAmt || reqAmt < 100) {
      setPayoutMsg({ type: 'error', text: 'कम से कम ₹100 निकालने की रिक्वेस्ट दर्ज करें।' });
      return;
    }

    if (reqAmt > currentAvailable) {
      setPayoutMsg({ type: 'error', text: `आप उपलब्ध शुद्ध कमाई (₹${currentAvailable.toFixed(2)}) से अधिक नहीं निकाल सकते।` });
      return;
    }

    if (!upiId || !upiId.includes('@')) {
      setPayoutMsg({ type: 'error', text: 'कृपया सही UPI ID डालें ताकि एडमिन पैसा भेज सके।' });
      return;
    }

    try {
      setIsSubmittingWithdraw(true);

      try {
        await API.put('/orders/update-upi', { upiId });
      } catch (upiErr) {
        console.warn("UPI save sync note:", upiErr);
      }

      const res = await API.post('/orders/payout/request', {
        amount: reqAmt,
        upiId: upiId.trim()
      });

      setPayoutMsg({
        type: 'success',
        text: res.data?.message || `🎉 ₹${reqAmt.toFixed(2)} की विथड्रॉ रिक्वेस्ट दर्ज कर दी गई है!`
      });
      setWithdrawAmount('');
      fetchAllStudioData();
    } catch (err) {
      setPayoutMsg({
        type: 'error',
        text: err.response?.data?.message || 'विथड्रॉ रिक्वेस्ट दर्ज करने में असमर्थ।'
      });
    } finally {
      setIsSubmittingWithdraw(false);
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
          👑 SECTION 1: ADMIN CONTROL TOP BANNER
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
                          <CreditCard size={12} className="text-indigo-400" /> {vendor.upiId || 'Not Linked'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-indigo-400">{vendor.totalPhotosSold} Pcs</td>
                      <td className="p-4 text-right text-slate-400 font-bold">₹{vendor.totalSalesAmount?.toFixed(2)}</td>
                      <td className="p-4 text-right font-black text-emerald-400 text-sm">₹{vendor.amountToPay?.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          📸 SECTION 2: PHOTOGRAPHER STATS + 3-CARD WALLET (GUARANTEED SYNC)
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

          {/* 📊 3-वे वॉलेट कार्ड्स (Available, Requested In-Review, Settled) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* कार्ड 1: उपलब्ध बैलेंस (पुरानी कमाई गारंटीड लोड होगी) */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Available to Withdraw</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{currentAvailable.toFixed(2)}</h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                  {isEligibleForPayout ? '✅ Ready to Withdraw' : '⏳ Min. ₹100 required'}
                </span>
              </div>
              <DollarSign size={28} className="text-emerald-500 bg-emerald-500/10 p-1.5 rounded-xl" />
            </div>

            {/* कार्ड 2: रिक्वेस्टेड बैलेंस (In-Review) */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Requested (In Review)</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">₹{walletData.pendingAmount}</h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                  {parseFloat(walletData.pendingAmount) > 0 ? 'Admin processing payout' : 'No active requests'}
                </span>
              </div>
              <Clock size={28} className="text-amber-500 bg-amber-500/10 p-1.5 rounded-xl" />
            </div>

            {/* कार्ड 3: कुल पेड बैलेंस */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Settled / Paid</p>
                <h3 className="text-2xl font-black text-indigo-400 mt-1">₹{walletData.paidOutAmount}</h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                  {photographerData.totalSoldPhotos} Items Licensed
                </span>
              </div>
              <CheckCheck size={28} className="text-indigo-500 bg-indigo-500/10 p-1.5 rounded-xl" />
            </div>
          </div>

          {/* 💸 विथड्रॉ और UPI सेटलमेंट फॉर्म */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/80 pb-4">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard size={16} className="text-indigo-400" />
                  Payout Settlement & Withdrawal Terminal
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  अपनी उपलब्ध कमाई को सीधे अपने बैंक/UPI में निकालने के लिए न्यूनतम राशि ₹100.00 है।
                </p>
              </div>

              <div className="self-start sm:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold uppercase ${
                  isEligibleForPayout 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {isEligibleForPayout ? <CheckCircle2 size={13} /> : <Lock size={13} />}
                  {isEligibleForPayout ? 'Ready to Withdraw' : 'Locked (< ₹100)'}
                </span>
              </div>
            </div>

            {/* प्रोग्रेस बार */}
            {!isEligibleForPayout && (
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Threshold Progress</span>
                  <span>₹{currentAvailable.toFixed(2)} / ₹100.00</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  विथड्रॉ रिक्वेस्ट अनलॉक करने के लिए ₹{(100 - currentAvailable).toFixed(2)} की और बिक्री चाहिए।
                </p>
              </div>
            )}

            {/* अलर्ट मैसेज */}
            {payoutMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                payoutMsg.type === 'error' 
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}>
                {payoutMsg.text}
              </div>
            )}

            {/* फॉर्म */}
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">
                    UPI Wallet ID (VPA)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      placeholder="username@okhdfcbank" 
                      required
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs w-full focus:outline-none focus:border-indigo-500 text-white font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={handleUpdateUpi} 
                      title="Save UPI ID"
                      className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Save size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">
                    Withdrawal Amount (₹)
                  </label>
                  <input 
                    type="number"
                    min="100"
                    max={currentAvailable}
                    disabled={!isEligibleForPayout}
                    value={withdrawAmount} 
                    onChange={(e) => setWithdrawAmount(e.target.value)} 
                    placeholder={isEligibleForPayout ? "Min. 100" : "Locked (Min ₹100)"} 
                    required
                    className="bg-slate-950 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2.5 text-xs w-full focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isEligibleForPayout || isSubmittingWithdraw}
                className={`w-full sm:w-auto font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  isEligibleForPayout 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95' 
                    : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isSubmittingWithdraw ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing Payout Request...</span>
                  </>
                ) : isEligibleForPayout ? (
                  <>
                    <Send size={13} />
                    <span>Request Payout via UPI</span>
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    <span>Minimum ₹100 Required to Withdraw</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          🖼️ SECTION 3: THE LIVE GALLERY MATRIX
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

                  {/* 🗑️ डिलीट बटन */}
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