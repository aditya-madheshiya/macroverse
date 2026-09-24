import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, Loader2, FileDown, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/my-orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🧾 डिजिटल इनवॉइस/रसीद डाउनलोड करने का फंक्शन
  const handleDownloadInvoice = (order) => {
    const userName = localStorage.getItem('userName') || "Macroverse Collector";
    const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsCount = (order.photos || order.items || []).length;

    const invoiceContent = `================================================================
                    MACROVERSE TAX INVOICE & RECEIPT
================================================================
Invoice No     : INV-${order._id.slice(-8).toUpperCase()}
Date & Time    : ${dateStr}
Payment Gateway: Razorpay UPI Node
Payment ID     : ${order.razorpayPaymentId || "N/A"}
Order ID       : ${order.razorpayOrderId || order._id}

BILLED TO:
Name           : ${userName}
Account Status : Verified Customer

ORDER BREAKDOWN:
Total Assets   : ${itemsCount} Macro Photographic Asset(s)
License Tier   : Commercial Perpetual License
Total Paid     : ₹${Number(order.totalAmount).toFixed(2)}
Payment Status : ${order.paymentStatus?.toUpperCase() || 'COMPLETED'}

TERMS & NOTES:
- This invoice confirms the successful licensing of high-resolution macro assets.
- Asset files are permanently unlocked and downloadable from your Dashboard.
- All digital sales are non-refundable per Macroverse marketplace protocol.

Authorized Signature: Macroverse Automated Billing Engine
================================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order._id.slice(-8).toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-16 justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={20} />
        <span>Fetching transaction ledger nodes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <CreditCard className="text-indigo-400" /> Transaction & Order Ledger
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track Razorpay UPI transactions, review settlement statuses, and export invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl bg-slate-950/40 p-8 space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Orders Found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              You haven't placed any orders yet. Purchased assets will generate verified invoices here.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Order Reference</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Assets</th>
                  <th className="py-4 px-5">Total Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-300 divide-y divide-slate-900/50">
                {orders.map((order) => {
                  const assetsCount = (order.photos || order.items || []).length;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={order._id} className="hover:bg-slate-900/40 transition">
                      <td className="py-4 px-5">
                        <div className="font-mono text-white font-bold">
                          ORD-{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {order.razorpayPaymentId || order.razorpayOrderId || "Direct Gateway"}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-400 font-medium">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-300">
                        {assetsCount} Asset{assetsCount !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-5 font-black text-emerald-400">
                        ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold">
                          <CheckCircle2 size={11} /> {order.paymentStatus || "Completed"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-indigo-400 hover:text-indigo-300 font-bold px-3 py-1.5 rounded-lg text-xs border border-slate-800 transition cursor-pointer"
                          title="Download Tax Receipt"
                        >
                          <FileDown size={13} /> Invoice
                        </button>
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
  );
};

export default MyOrders;