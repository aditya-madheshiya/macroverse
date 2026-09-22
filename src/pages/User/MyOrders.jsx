import React from 'react';
import { CreditCard, ArrowUpRight } from 'lucide-react';

const MyOrders = () => {
  const orders = [
    { id: "ORD-2026-99A", date: "Feb 14, 2026", items: 2, total: "40.00", status: "Completed" },
    { id: "ORD-2026-41B", date: "Jan 28, 2026", items: 1, total: "15.00", status: "Completed" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">My Orders</h2>
        <p className="text-sm text-slate-500 mt-1">Track payments and structural license statements.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Assets</th>
              <th className="pb-4">Total Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-slate-300 divide-y divide-slate-900/40">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-900/10">
                <td className="py-4 text-white font-mono">{order.id}</td>
                <td className="py-4 text-slate-400">{order.date}</td>
                <td className="py-4">{order.items} Items</td>
                <td className="py-4 text-indigo-400">${order.total}</td>
                <td className="py-4">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1 rounded-md uppercase font-bold">
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-xs text-slate-500 hover:text-white font-bold flex items-center gap-1 ml-auto cursor-pointer">
                    View <ArrowUpRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;