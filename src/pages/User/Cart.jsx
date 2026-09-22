import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, ShoppingCart, ArrowRight, DollarSign } from 'lucide-react';
import API from '../../api/axiosInstance';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/cart');
      setCartItems(res.data || []);
      calculateTotal(res.data || []);
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
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
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

  // ⚡ लाइव चेकआउट सिस्टम ट्रिगर
  const handleCheckoutSystem = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login first!");

    try {
      const res = await API.post('/orders/checkout');
      if (res.data.success) {
        alert("🎉 पेमेंट सफल रहा! आपकी एसेट्स अनलॉक हो गई हैं।");
        fetchCartData();
        window.location.href = '/dashboard?tab=purchased'; 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Checkout Failed");
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
    <div className="space-y-8 animate-fade-in">
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
                  
                  {/* 🔒 सुरक्षित कार्ट इमेज बॉक्स */}
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
                  <span className="font-black text-emerald-400 text-sm">{item.price}</span>
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
                <span className="text-xl font-black text-emerald-400 flex items-center"><DollarSign size={18} />{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckoutSystem} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer">
              Proceed to Checkout <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;