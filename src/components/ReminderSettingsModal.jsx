import React from 'react';
import { 
  X, Bell, BellRing, Volume2, ShieldCheck, 
  RotateCcw, Sparkles, Check, AlertTriangle, Download, Smartphone 
} from 'lucide-react';
import { soundPlayer } from '../utils/audioAlert';

export default function ReminderSettingsModal({
  isOpen,
  onClose,
  reminderPrefs,
  onUpdatePrefs,
  notificationPermission,
  onRequestPermission,
  onTestNotification,
  lang,
  onOpenInstallModal,
  isInstalled
}) {
  if (!isOpen) return null;
  const isBn = lang === 'bn';

  const prayers = [
    { id: 'fajr', bn: 'ফজর', en: 'Fajr', desc: 'ভোরের ফরজ নামাজ' },
    { id: 'dhuhr', bn: 'যোহর', en: 'Dhuhr', desc: 'দুপুরের ফরজ নামাজ' },
    { id: 'asr', bn: 'আসর', en: 'Asr', desc: 'বিকেলের ফরজ নামাজ' },
    { id: 'maghrib', bn: 'মাগরিব', en: 'Maghrib', desc: 'মাগরিব ও ইফতারের সময়' },
    { id: 'isha', bn: 'ইশা', en: 'Isha', desc: 'রাতের ফরজ নামাজ' },
  ];

  const handleTogglePrayer = (prayerId) => {
    onUpdatePrefs({
      ...reminderPrefs,
      [prayerId]: !reminderPrefs[prayerId]
    });
  };

  const handleResetDefaults = () => {
    onUpdatePrefs({
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
      soundEnabled: true,
      vibrationEnabled: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/80 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isBn ? 'নামাজের রিমাইন্ডার সেটিংস' : 'Salah Reminder Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'স্বয়ংক্রিয় ৩০ ও ১০ মিনিট পূর্বের সতর্কতা' : 'Automated 30m & 10m Pre-Alerts'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule explanation card */}
        <div className="p-4 bg-emerald-950/30 border-b border-emerald-800/30 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'রিমাইন্ডার নীতি ও সময়সূচি:' : 'Reminder Policy & Timing:'}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {isBn 
              ? 'প্রতিটি সক্রিয় ওয়াক্তের জন্য ওয়াক্ত শুরুর ঠিক ৩০ মিনিট পূর্বে প্রথম ও ১০ মিনিট পূর্বে চূড়ান্ত সতর্কবার্তা প্রদর্শিত হবে।'
              : 'For every active prayer, you will receive alerts at exactly 30 minutes and 10 minutes prior.'}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Permission Status */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {isBn ? 'ব্রাউজার নোটিফিকেশন স্ট্যাটাস' : 'Browser Notification Status'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {notificationPermission === 'granted'
                    ? (isBn ? 'সক্রিয় আছে (অনুমোদিত)' : 'Enabled & Active')
                    : notificationPermission === 'denied'
                      ? (isBn ? 'ব্রাউজারে ব্লক করা রয়েছে' : 'Permission Blocked')
                      : (isBn ? 'অনুমতি প্রয়োজন' : 'Permission Required')}
                </p>
              </div>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={onRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                {isBn ? 'অনুমতি দিন' : 'Allow'}
              </button>
            )}
          </div>

          {/* Individual Prayer Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isBn ? '৫ ওয়াক্তের রিমাইন্ডার চালু/বন্ধ' : '5 Daily Prayer Reminders'}
              </h4>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isBn ? 'সব চালু করুন' : 'Reset All'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {prayers.map((p) => {
                const isEnabled = !!reminderPrefs[p.id];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleTogglePrayer(p.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      isEnabled
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span>{isBn ? p.bn : p.en}</span>
                        {isEnabled && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                            {isBn ? '৩০ ও ১০ মি. সক্রিয়' : '30m & 10m active'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.desc}
                      </div>
                    </div>

                    <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                      isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sound & Alert Testing */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              {isBn ? 'পরীক্ষা ও সাউন্ড টেস্ট' : 'Alert & Sound Preview'}
            </h4>

            <div className="flex gap-2">
              <button
                onClick={() => soundPlayer.playChime('gentle')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? '৩০ মি. টোন শুনুন' : 'Preview 30m Sound'}</span>
              </button>

              <button
                onClick={() => soundPlayer.playChime('urgent')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{isBn ? '১০ মি. টোন শুনুন' : 'Preview 10m Sound'}</span>
              </button>
            </div>

            <button
              onClick={onTestNotification}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
            >
              <Bell className="w-4 h-4" />
              <span>{isBn ? 'টেস্ট নোটিফিকেশন পাঠান (Test Notification)' : 'Send Sample Test Notification'}</span>
            </button>
          </div>

          {/* Install App Button if not installed */}
          {!isInstalled && onOpenInstallModal && (
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>{isBn ? 'ফোনে সরাসরি অ্যাপ হিসেবে ইনস্টল করুন' : 'Install App to Phone'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
