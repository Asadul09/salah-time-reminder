import React from 'react';
import { 
  X, Bell, BellRing, Volume2, ShieldCheck, 
  RotateCcw, Sparkles, Check, AlertTriangle 
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
  lang
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
          <p className="text-slate-300 leading-relaxed">
            {isBn 
              ? 'প্রতিটি সক্রিয় নামাজের জন্য নির্ধারিত দুটি নোটিফিকেশন দেয়া হয়: ১ম রিমাইন্ডার ওয়াক্তের ঠিক ৩০ মিনিট আগে এবং ২য় রিমাইন্ডার ওয়াক্তের ঠিক ১০ মিনিট আগে। এর অতিরিক্ত কোনো অনাকাঙ্ক্ষিত রিমাইন্ডার দেওয়া হয় না।'
              : 'Each enabled Salah triggers strictly 2 notifications: 1st reminder at 30 minutes before, and 2nd reminder at 10 minutes before. No excess spam alerts.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Permission warning banner if not granted */}
          {notificationPermission !== 'granted' && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isBn ? 'ব্রাউজার নোটিফিকেশন অনুমতি প্রয়োজন' : 'Browser notification permission needed'}</span>
              </div>
              <button
                onClick={onRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition"
              >
                {isBn ? 'অনুমতি দিন' : 'Allow'}
              </button>
            </div>
          )}

          {/* Individual Salah Switches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-200">
                {isBn ? 'ওয়াক্ত ভিত্তিক রিমাইন্ডার নির্বাচন' : 'Per-Salah Notification Toggle'}
              </h4>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isBn ? 'সবগুলো চালু করুন (ডিফল্ট)' : 'Enable All (Default)'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {prayers.map((p) => {
                const isEnabled = !!reminderPrefs[p.id];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleTogglePrayer(p.id)}
                    className="cursor-pointer p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">
                        {isBn ? p.bn : p.en}
                      </div>
                      <div className="text-xs text-slate-400">
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

        </div>

      </div>
    </div>
  );
}
