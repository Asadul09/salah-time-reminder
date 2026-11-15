import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export default function InstallBanner({ onOpenInstallModal, isInstalled, lang }) {
  const [dismissed, setDismissed] = useState(false);
  const isBn = lang === 'bn';

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('salah_install_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('salah_install_banner_dismissed', 'true');
  };

  // Don't show if already installed as standalone PWA or dismissed
  if (isInstalled || dismissed) return null;

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-4 pt-3">
      <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-teal-950/90 border border-emerald-500/40 shadow-lg shadow-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex-shrink-0 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🕌
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                {isBn ? 'সালাহ রিমাইন্ডার অ্যাপ ইনস্টল করুন' : 'Install Salah Reminder App'}
              </h4>
              <span className="hidden xs:inline-flex text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold">
                {isBn ? 'ফ্রি' : 'Free'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              {isBn 
                ? 'ফোনে কোনো স্টোরেজ নষ্ট না করে সহজে ১-ট্যাপে সরাসরি ব্যবহারের জন্য ইনস্টল করুন।' 
                : 'Install to access prayer times 100% offline directly from your home screen.'}
            </p>
            <p className="text-[11px] text-slate-300 sm:hidden">
              {isBn ? '১-ট্যাপে অফলাইনেও ব্যবহার করুন' : 'Fast 1-tap offline prayer access'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/30 transition transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span>{isBn ? 'ইনস্টল' : 'Install'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
