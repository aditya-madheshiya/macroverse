import React from 'react';
import { CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-slate-500 hover:text-white transition"><ArrowLeft size={20} /></Link>
        <div>
          <h2 className="text-2xl font-black text-white">Secure Checkout</h2>
          <p className="text-sm text-slate-500 mt-1">Complete your licensing transaction matrix.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl space-y-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cardholder Name</label>
            <input type="text" placeholder="John Doe" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-4 text-slate-500" size={18} />
              <input type="text" placeholder="•••• •••• •••• ••••" className="w-full border border-slate-800 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
              <input type="text" placeholder="MM/YY" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">CVC / CVV</label>
              <input type="text" placeholder="•••" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer">
            <ShieldCheck size={18} /> Pay $40.00 & Claim License
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;