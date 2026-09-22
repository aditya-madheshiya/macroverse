import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const Pricing = () => {
  const plans = [
    { name: "Creator Essentials", price: "$9", desc: "Perfect for indie designer workflows", features: ["10 Premium Downloads / mo", "Standard Commercial Rights", "Prise Ultra-HD Source Files", "Basic Help Support"] },
    { name: "Studio Pro Bundle", price: "$29", desc: "Built explicitly for agencies & teams", features: ["50 Premium Downloads / mo", "Universal License Ownership", "Full Cloud Vault Access", "Priority Support Desk"], popular: true },
    { name: "Enterprise Custom", price: "$99", desc: "For global scale application deployment", features: ["Unlimited Cloud Transfers", "Full Indemnity Protection", "Multi-Seat Developer License", "24/7 Account Manager"] }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        
        <div className="max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Flexible & Honest Pricing</h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">Unlock hyper-resolution micro assets designed to elevate your landing pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-slate-900/40 border p-8 rounded-3xl text-left relative backdrop-blur-md transition ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/5 md:-translate-y-4 bg-slate-900/60' : 'border-slate-900'}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} /> Best Option</span>}
              <h3 className="font-black text-xl text-white">{plan.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{plan.desc}</p>
              <div className="mt-6 mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">/month</span>
              </div>
              <button className={`w-full font-bold py-3.5 rounded-xl transition text-sm mb-6 cursor-pointer active:scale-95 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/10' : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300'}`}>Activate Tier Plan</button>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2.5"><Check size={14} className="text-emerald-500 flex-shrink-0" /> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Pricing;