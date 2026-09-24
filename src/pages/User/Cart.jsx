import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, ShoppingCart, ShieldCheck } from 'lucide-react';
import API from '../../api/axiosInstance';

// ⚡ Razorpay Script को सुरक्षित लोड करने का फंक्शन
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/cart');
      const items = res.data?.items || res.data || [];
      setCartItems(items);
      calculateTotal(items);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const priceNum = parseFloat(String(item.price || item.photo?.price || '0').replace(/[^0-9.]/g, '')) || 0;
      return sum + priceNum;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (photoId) => {
    try {
      await API.delete(`/users/cart/${photoId}`);
      const updatedItems = cartItems.filter(item => item._id !== photoId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  // 🚀 डायरेक्ट कार्ट से Razorpay UPI पॉपअप खोलने का फंक्शन
  const handleProceedToCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("कृपया पहले लॉगिन करें!");

    if (cartItems.length === 0 || totalPrice <= 0) {
      return alert("आपकी कार्ट खाली है!");
    }

    try {
      setPaying(true);

      // 🛑 सुरक्षा जाँच: यूजर की खरीदी हुई लिस्ट मंगाकर चेक करें
      try {
        const profileRes = await API.get('/users/profile');
        const purchasedList = (profileRes.data?.purchasedPhotos || []).map(p => (p._id || p).toString());

        const alreadyBoughtItem = cartItems.find(item => {
          const id = (item._id || item.photo?._id || item.photo).toString();
          return purchasedList.includes(id);
        });

        if (alreadyBoughtItem) {
          alert(`⚠️ अलर्ट: "${alreadyBoughtItem.title || 'यह तस्वीर'}" आप पहले ही खरीद चुके हैं! कृपया इसे कार्ट से हटाएँ।`);
          setPaying(false);
          return;
        }
      } catch (profileErr) {
        console.warn("Could not verify purchase history:", profileErr);
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK लोड नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।");
        setPaying(false);
        return;
      }

      // 1. 🎯 बैकएंड से Razorpay ऑर्डर और Key मँगवाएँ (Path: /orders/razorpay-order)
      const orderRes = await API.post('/orders/razorpay-order');

      if (!orderRes.data?.success || !orderRes.data?.orderId) {
        alert("बैकएंड से ऑर्डर क्रिएट नहीं हो पाया: " + (orderRes.data?.message || "Error"));
        setPaying(false);
        return;
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 🔒 बैकएंड से आई Key इस्तेमाल करें
      const activeRazorpayKey = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!activeRazorpayKey) {
        alert("Razorpay Key ID नहीं मिली। कृपया बैकएंड .env चेक करें।");
        setPaying(false);
        return;
      }

      // 2. Razorpay पॉपअप कॉन्फ़िगरेशन
      const options = {
        key: activeRazorpayKey,
        amount: amount,
        currency: currency || "INR",
        name: "Macroverse Marketplace",
        description: `License for ${cartItems.length} Asset(s)`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. 🎯 पेमेंट वेरिफ़िकेशन (Path: /orders/razorpay-verify)
            const verifyRes = await API.post('/orders/razorpay-verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data?.success) {
              setCartItems([]);
              setTotalPrice(0);
              alert("🎉 पेमेंट सफल रहा! आपके एसेट्स अनलॉक हो गए हैं।");
              window.location.href = '/my-studio';
            } else {
              alert("❌ पेमेंट वेरिफ़िकेशन फ़ेल हुआ: " + (verifyRes.data?.message || ""));
            }
          } catch (vErr) {
            console.error("Verification Error:", vErr);
            alert("सर्वर वेरिफिकेशन में समस्या आई: " + (vErr.response?.data?.message || vErr.message));
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || "Macro Collector",
          email: localStorage.getItem('userEmail') || "collector@macroverse.in",
          contact: "9876543210"
        },
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (resp) {
        console.error("Payment Failed Reason:", resp.error);
        alert(`पेमेंट फ़ेल: ${resp.error?.description || resp.error?.reason || 'Payment cancelled/failed'}`);
        setPaying(false);
      });

      razorpayInstance.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "गेटवे इनिशियलाइज़ करने में त्रुटि।");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-12">
        <Loader2 className="animate-spin text-indigo-500" size={18} />
        <span>Syncing your secure Cart Nodes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <ShoppingCart className="text-indigo-500" /> My Marketplace Cart
        </h2>
        <p className="text-sm text-slate-500 mt-1">लाइसेंस खरीदने के लिए चुने गए डिजिटल एसेट्स।</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-slate-500 font-bold text-sm py-12 border border-dashed border-slate-900 rounded-2xl text-center bg-slate-950/20">
          आपकी कार्ट अभी खाली है। गैलरी से कुछ अद्भुत मैक्रो शॉट्स जोड़ें!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/30 border border-slate-900 rounded-2xl gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  
                  {/* सुरक्षित कार्ट इमेज बॉक्स */}
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 select-none">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-20">
                      <span className="text-white font-black text-[9px] tracking-wider uppercase border border-white/40 px-1 py-0.5 rotate-12 bg-slate-950/10">
                        MACROVERSE
                      </span>
                    </div>
                  </div>

                  <div className="truncate">
                    <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{item.magnification} • {item.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900/50">
                  <span className="font-black text-emerald-400 text-sm">
                    ₹{parseFloat(String(item.price || item.photo?.price || '0').replace(/[^0-9.]/g, '')).toFixed(2)}
                  </span>
                  <button onClick={() => handleRemoveFromCart(item._id)} className="text-rose-500 hover:text-rose-400 p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl space-y-6 backdrop-blur-md">
            <h3 className="font-black text-white text-sm tracking-wide uppercase border-b border-slate-900 pb-3">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-400 font-bold">
                <span>Total Items</span>
                <span>{cartItems.length} Assets</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-900/80 pt-4">
                <span className="text-sm font-bold text-white">Estimated Total</span>
                <span className="text-xl font-black text-emerald-400 flex items-center">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* 🎯 डायरेक्ट Razorpay UPI ट्रिगर बटन */}
            <button 
              type="button" 
              onClick={handleProceedToCheckout} 
              disabled={paying || cartItems.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Connecting UPI Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} className="text-emerald-300" />
                  <span>Pay ₹{totalPrice.toFixed(2)} via UPI / Cards</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-500 font-medium">
              🔒 Powered by Razorpay. Supports PhonePe, GPay, Paytm & Cards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;