import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';

const MyDownloads = () => {
  const [purchasedAssets, setPurchasedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/purchased-photos');
        setPurchasedAssets(res.data || []);
      } catch (err) {
        console.error("Error fetching purchased items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchased();
  }, []);

  // ⚡ हाई-रेजोल्यूशन इमेज को सीधे यूजर के डिवाइस में डाउनलोड करने का फंक्शन
  const handleDownloadImage = async (photo) => {
    try {
      setDownloadingId(photo._id);
      const imageUrl = photo.imageUrl;

      // Cloudinary/External Image को Blob के रूप में फेच करें
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // डाउनलोड लिंक बनाएँ और ट्रिगर करें
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.title?.replace(/\s+/g, '_') || 'Macroverse_Asset'}_Original.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // फॉलबैक: अगर CORS ब्लॉक करे तो नए टैब में खोलें
      window.open(photo.imageUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  // 📜 आधिकारिक डिजिटल कमर्शियल लाइसेंस सर्टिफिकेट डाउनलोड
  const handleDownloadCertificate = (photo) => {
    const userName = localStorage.getItem('userName') || "Verified Licensee";
    const licenseText = `================================================================
          MACROVERSE DIGITAL ASSET LICENSE CERTIFICATE
================================================================

License Token ID : MV-${photo._id?.slice(-8).toUpperCase()}
Licensed To      : ${userName}
Asset Title      : ${photo.title}
Magnification    : ${photo.magnification || "High Power Macro"}
Category         : ${photo.category || "General Macro"}
Asset Price      : ${photo.price || "Paid"}
Date of Issue    : ${new Date().toLocaleDateString()}

TERMS OF LICENSE:
- The licensee is granted a perpetual, non-exclusive commercial
  license to display, print, and utilize this digital asset.
- Redistribution, sub-licensing, or resale of the original RAW
  file without transformation is strictly prohibited.
- Copyright remains with the creator under Macroverse Protocol.

Certified by: Macroverse Marketplace Node Engine
================================================================`;

    const blob = new Blob([licenseText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `License_${photo._id?.slice(-6).toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-16 justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={20} />
        <span>Decrypting your licensed master files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" /> Licensed Downloads & Vault
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Access full-resolution master files and verified commercial license certificates.
        </p>
      </div>

      {purchasedAssets.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl bg-slate-950/40 p-8 space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Licensed Assets Found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              You haven't unlocked any macro photos yet. Explore our high-definition gallery to license master copies.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg"
          >
            Explore Gallery
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchasedAssets.map((photo) => {
            const isDownloading = downloadingId === photo._id;

            return (
              <div
                key={photo._id}
                className="bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 group"
              >
                {/* Photo Thumbnail + Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover select-none"
                    />
                  </div>

                  <div className="truncate">
                    <h3 className="font-bold text-white text-sm truncate">{photo.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-slate-500 font-mono mt-1">
                      <span className="text-indigo-400 font-semibold">{photo.magnification || "Original Resolution"}</span>
                      <span>•</span>
                      <span>{photo.category || "Macro"}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Commercial License</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-900/60">
                  {/* Download License Certificate */}
                  <button
                    onClick={() => handleDownloadCertificate(photo)}
                    title="Download Commercial Certificate"
                    className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-bold px-3 py-2 rounded-xl text-xs border border-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText size={13} className="text-indigo-400" />
                    <span>Certificate</span>
                  </button>

                  {/* Download Master File */}
                  <button
                    onClick={() => handleDownloadImage(photo)}
                    disabled={isDownloading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 transition cursor-pointer active:scale-95"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        <span>Download Asset</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDownloads;