import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    { q: "What defines a Micro Stock asset?", a: "Micro stock refers to extreme high-grade digital images packaged under non-exclusive, highly budget-optimized pricing structures." },
    { q: "Are these deployments safe for corporate clients?", a: "Absolutely. Every asset processed inside the Microverse portal is rigorously filtered for intellectual property safety." },
    { q: "What raw data metrics do downloads provide?", a: "Every downloaded file delivers full maximum resolution source data packed in native uncompressed JPEG format." }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <HelpCircle size={32} className="text-indigo-500 mx-auto" />
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System FAQ Matrix</h1>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl backdrop-blur-md space-y-2">
              <h3 className="font-bold text-white text-base">⚡ {faq.q}</h3>
              <p className="text-sm text-slate-400 pl-6 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;