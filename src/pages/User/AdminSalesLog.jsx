import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Loader2, CheckCircle2, TrendingUp } from 'lucide-react';
import API from '../../api/axiosInstance';

const AdminSalesLog = () => {
  const [salesData, setSalesData] = useState({ totalEarned: "0.00", soldItemsCount: 0, salesLog: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/creator-sales');
        setSalesData(res.data || { totalEarned: "0.00", soldItemsCount: 0, salesLog: [] });
      } catch (err) {
        console.error("Error loading creator sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-16 justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={20} />
        <span>Calculating your portfolio sales revenue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 📊 टॉप स्टैट्स कार्ड्स */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Portfolio Revenue</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-0.5">₹{salesData.totalEarned}</h3>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Photos Sold</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{salesData.soldItemsCount} Licenses</h3>
          </div>
        </div>
      </div>

      {/* 📋 सेल्स लेजर टेबल */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" /> My Asset Sales Ledger
        </h3>

        {salesData.salesLog.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-900 rounded-2xl bg-slate-950/30 text-slate-500 text-xs font-bold">
            आपकी अपलोड की हुई कोई तस्वीर अभी तक नहीं बिकी है।
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Photo</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-slate-300 divide-y divide-slate-900/50">
                  {salesData.salesLog.map((sale, idx) => {
                    const dateStr = new Date(sale.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr key={idx} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={sale.photoUrl}
                            alt={sale.photoTitle}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950"
                          />
                          <span className="font-bold text-white truncate max-w-[150px]">{sale.photoTitle}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-white font-medium">{sale.buyerName}</div>
                          <div className="text-[10px] text-slate-500">{sale.buyerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{dateStr}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">₹{Number(sale.amount).toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                            <CheckCircle2 size={10} /> Credited
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSalesLog;