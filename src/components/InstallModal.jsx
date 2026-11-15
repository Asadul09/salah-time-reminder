import React from 'react';
import { 
  Download, Smartphone, CheckCircle, Share, PlusSquare, 
  X, Sparkles, Shield, WifiOff, BellRing 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InstallModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalledSuccess,
  isInstalled,
  lang
}) {
  if (!isOpen) return null;

  const isBn = lang === 'bn';

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          if (onInstalledSuccess) onInstalledSuccess();
          onClose();
        }
      } catch (err) {
        console.error('Install prompt failed:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
              🕌
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
              <span>{isBn ? 'সালাহ রিমাইন্ডার অ্যাপ' : 'Salah Reminder App'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                PWA
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? 'ফোনে সরাসরি অ্যাপ হিসেবে ইনস্টল করুন' : 'Install as a native app on your phone'}
            </p>
          </div>
        </div>

        {/* Already Installed State */}
        {isInstalled ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-emerald-300">
              {isBn ? 'অ্যাপটি ইতিমধ্যে আপনার ফোনে ইনস্টল করা আছে!' : 'App is already installed on your device!'}
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              {isBn 
                ? 'আপনি সরাসরি ফোনের হোম স্ক্রিন বা অ্যাপ ড্রয়ার থেকে এটি ব্যবহার করতে পারেন।' 
                : 'You can launch it anytime directly from your phone home screen.'}
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition active:scale-98"
            >
              {isBn ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        ) : (
          <>
            {/* Benefits List */}
            <div className="space-y-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 mb-5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {isBn ? 'হোম স্ক্রিন থেকে ১-ট্যাপে সরাসরি ফুল-স্ক্রিন অ্যাপ মোডে খুলবে' : 'Opens in full-screen native app mode from home screen'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <WifiOff className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>
                  {isBn ? 'ইন্টারনেট ছাড়াও ১০০% অফলাইনে সব ওয়াক্তের সময় কাজ করবে' : 'Works 100% offline without active internet'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  {isBn ? 'ওয়াক্তের ৩০ ও ১০ মিনিট আগে সতর্কবার্তা পাবেন' : 'Accurate 30m & 10m pre-prayer alerts'}
                </span>
              </div>
            </div>

            {/* If direct browser install prompt is available (Android / Chrome / Edge) */}
            {deferredPrompt ? (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-98"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>{isBn ? 'ফোনে ইনস্টল করুন (Install Now)' : 'Install to Phone Now'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  {isBn ? 'প্লে স্টোরের প্রয়োজন নেই, কোনো অতিরিক্ত মেগাবাইট কাটবে না' : 'No Play Store needed, zero phone storage waste'}
                </p>
              </div>
            ) : isIOS ? (
              /* iOS Safari Instructions */
              <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Share className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'আইফোনে (iPhone / Safari) ইনস্টল করার নিয়ম:' : 'Instructions for iPhone / iPad (Safari):'}</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li>
                    {isBn 
                      ? 'নিচের ব্রাউজার বারে থাকা '
                      : 'Tap the '}
                    <strong className="text-emerald-300">{isBn ? 'Share (শেয়ার)' : 'Share button'}</strong>
                    <span className="inline-block mx-1">📤</span>
                    {isBn ? 'আইকনে চাপুন।' : 'at the bottom of Safari.'}
                  </li>
                  <li>
                    {isBn 
                      ? 'তালিকায় স্ক্রল করে '
                      : 'Scroll and tap '}
                    <strong className="text-emerald-300">{isBn ? '"Add to Home Screen"' : '"Add to Home Screen"'}</strong>
                    <span className="inline-block mx-1">➕</span>
                    {isBn ? 'নির্বাচন করুন।' : '.'}
                  </li>
                  <li>
                    {isBn 
                      ? 'উপরে ডানপাশের '
                      : 'Tap '}
                    <strong className="text-emerald-300">{isBn ? '"Add"' : '"Add"'}</strong>
                    {isBn ? ' বাটনে চাপুন।' : ' at the top right.'}
                  </li>
                </ol>
              </div>
            ) : (
              /* Android / Desktop fallback instructions */
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'ব্রাউজার মেনু থেকে ইনস্টল করার নিয়ম:' : 'How to install via browser menu:'}</span>
                </div>
                <p>
                  {isBn 
                    ? '১. আপনার ব্রাউজারের উপরে বা নিচের থ্রি-ডট (⋮) মেনু অপশনে ট্যাপ করুন।' 
                    : '1. Tap the three dots (⋮) menu in your mobile browser.'}
                </p>
                <p>
                  {isBn 
                    ? '২. "Install app" অথবা "Add to Home screen" (হোম স্ক্রিনে যোগ করুন) চাপুন।' 
                    : '2. Select "Install app" or "Add to Home screen".'}
                </p>
                <p className="text-[11px] text-emerald-400/90 pt-1">
                  {isBn 
                    ? 'ব্যস! অ্যাপটি আপনার মোবাইলের হোম স্ক্রিনে চলে আসবে।' 
                    : 'Done! The app icon will appear directly on your home screen.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
