import React from 'react';

const TermsConditions = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Terms of License Distribution</h1>
        <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl text-sm font-medium text-slate-400 space-y-4 leading-relaxed">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Revision: July 04, 2026</p>
          <p>By engaging with the Microverse asset cloud, you accept full operational tracking parameters established under global licensing compliance criteria.</p>
          <h3 className="font-bold text-white text-base mt-6">License Utilization</h3>
          <p>Assets deployed from this environment carry individual non-transferable global tokens. Redistribution, sub-licensing, or automated duplication models are strictly forbidden.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;