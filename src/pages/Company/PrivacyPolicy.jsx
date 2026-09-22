import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Privacy Telemetry Protocol</h1>
        <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl text-sm font-medium text-slate-400 space-y-4 leading-relaxed">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Timestamp: July 04, 2026</p>
          <p>At Microverse, we deploy enterprise security tokens to ensure user logs are anonymized. Safeguarding the metadata associated with your legal asset transfers remains our core technical objective.</p>
          <h3 className="font-bold text-white text-base mt-6">Collected Telemetry</h3>
          <p>We restrict input collection strictly to checkout verification scripts, billing pipelines, and unique user account verification parameters.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;