import React from 'react';
import { Download, CheckCircle, FileText } from 'lucide-react';

const MyDownloads = () => {
  const downloads = [
    { id: "M-9021", title: "Majestic Mountain Peak", size: "45.2 MB", format: "RAW / TIFF", date: "Feb 12, 2026" },
    { id: "M-4412", title: "Mystic Autumn Pathway", size: "28.1 MB", format: "JPEG (UHD)", date: "Feb 10, 2026" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Download History</h2>
        <p className="text-sm text-slate-500 mt-1">Access your licensed master copies directly.</p>
      </div>

      <div className="space-y-4">
        {downloads.map(file => (
          <div key={file.id} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{file.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-4">
                  <span>Size: {file.size}</span>
                  <span>Format: {file.format}</span>
                  <span>Licensed: {file.date}</span>
                </p>
              </div>
            </div>
            <button className="bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-800 flex items-center justify-center gap-2 transition cursor-pointer">
              <Download size={14} /> Re-Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDownloads;