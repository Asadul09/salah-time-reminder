import React from 'react';
import { 
  Bell, BellOff, Volume2, VolumeX, Moon, Sun, 
  MapPin, Clock, Calendar, Compass, ShieldCheck, Download, Smartphone 
} from 'lucide-react';
import { toBengaliDigits } from '../utils/prayerCalc';

export default function Header({
  currentTime,
  hijriDate,
  selectedDivision,
  onOpenDivisionModal,
  notificationPermission,
  onRequestNotification,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleTheme,
  is24Hour,
  onToggle24Hour,
  lang,
  onToggleLang,
  onOpenSettingsModal,
  onOpenInstallModal,
  isInstalled
}) {
  const isBn = lang === 'bn';

  // Format current live time
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  let displayHours = hours;
  let ampm = '';
  if (!is24Hour) {
    ampm = hours >= 12 ? (isBn ? 'পিএম' : 'PM') : (isBn ? 'এএম' : 'AM');
    displayHours = hours % 12 || 12;
  }
  const displayHoursStr = displayHours.toString().padStart(2, '0');
  
  const timeFormatted = `${displayHoursStr}:${minutes}:${seconds}`;
  const finalTimeStr = isBn ? toBengaliDigits(timeFormatted) : timeFormatted;

  // Gregorian date format
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const gregorianStr = currentTime.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', dateOptions);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 shadow-lg shadow-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        {/* Top bar with Branding, Division, & Global Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Division Info */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl sm:text-2xl">
                🕌
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                    {isBn ? 'সালাহ রিমাইন্ডার' : 'Salah Reminder'}
                  </h1>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    BD Edition
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>{isBn ? 'ইসলামিক ফাউন্ডেশন বাংলাদেশ মানসম্মত' : 'Islamic Foundation BD Standard'}</span>
                </p>
              </div>
            </div>

            {/* Mobile Actions: Install App Button & Division Switcher */}
            <div className="flex items-center gap-1.5 sm:hidden">
              {!isInstalled && (
                <button
                  onClick={onOpenInstallModal}
                  className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/50 text-emerald-300 text-xs font-semibold active:scale-95 transition shadow-sm"
                  title={isBn ? 'ফোনে অ্যাপ ইনস্টল করুন' : 'Install App'}
                  aria-label={isBn ? 'অ্যাপ ডাউনলোড করুন' : 'Install App'}
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span className="text-[11px]">{isBn ? 'ইনস্টল' : 'App'}</span>
                </button>
              )}

              {/* Division Switcher Button (Mobile view button) */}
              <button
                onClick={onOpenDivisionModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-600/30 hover:border-emerald-500 text-emerald-300 text-xs font-medium transition active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? selectedDivision.nameBn : selectedDivision.name}</span>
                {selectedDivision.id === 'dhaka' && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">ডিফল্ট</span>
                )}
              </button>
            </div>
          </div>

          {/* Division Selector & Global Controls for Desktop */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            {/* Install / Download App Button (Desktop) */}
            {!isInstalled && (
              <button
                onClick={onOpenInstallModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900/90 hover:to-teal-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition duration-200 shadow-sm group active:scale-95"
                title={isBn ? 'ফোনে বা কম্পিউটারে অ্যাপ ইনস্টল করুন' : 'Install app on phone/PC'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition animate-pulse" />
                <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
              </button>
            )}

            {/* Division Switcher Desktop */}
            <button
              onClick={onOpenDivisionModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-emerald-200 text-xs font-medium transition duration-200 shadow-sm"
              title="বিভাগ পরিবর্তন করুন / Change Division"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-100">
                    {isBn ? selectedDivision.nameBn : selectedDivision.name}
                  </span>
                  {selectedDivision.id === 'dhaka' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 font-medium">
                      ডিফল্ট (Default)
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 ml-1 underline">পরিবর্তন</span>
            </button>

            {/* Notification Permission Indicator / Button */}
            <button
              onClick={notificationPermission === 'default' ? onRequestNotification : onOpenSettingsModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition border ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-900/70'
                  : 'bg-amber-950/50 text-amber-200 border-amber-700/60 hover:bg-amber-900/60'
              }`}
              aria-label={
                notificationPermission === 'granted'
                  ? (isBn ? 'রিমাইন্ডার সেটিংস খুলুন' : 'Open reminder settings')
                  : (isBn ? 'নোটিফিকেশন চালু করুন' : 'Enable alerts')
              }
              title={notificationPermission === 'denied'
                ? (isBn ? 'ব্রাউজার সেটিংস থেকে নোটিফিকেশন অনুমতি দিন' : 'Allow notifications in browser settings')
                : notificationPermission === 'unsupported'
                  ? (isBn ? 'এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়' : 'Notifications are not supported in this browser')
                  : notificationPermission === 'granted'
                    ? (isBn ? 'নোটিফিকেশন সক্রিয় (৩০ ও ১০ মিনিট আগে)' : 'Notifications enabled (30m and 10m before)')
                    : (isBn ? 'নোটিফিকেশন অনুমতি দিন' : 'Allow browser notifications')
              }
            >
              {notificationPermission === 'granted'
                ? <Bell className="w-3.5 h-3.5" />
                : <BellOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {notificationPermission === 'granted'
                  ? (isBn ? 'রিমাইন্ডার অন' : 'Reminder ON')
                  : notificationPermission === 'denied'
                    ? (isBn ? 'অনুমতি বন্ধ' : 'Alerts blocked')
                    : notificationPermission === 'unsupported'
                      ? (isBn ? 'সমর্থিত নয়' : 'Unavailable')
                      : (isBn ? 'নোটিফিকেশন চালু করুন' : 'Enable Alerts')}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
              title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* 12h / 24h Toggle */}
            <button
              onClick={onToggle24Hour}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              title="১২/২৪ ঘণ্টার ফরম্যাট টগল"
            >
              {is24Hour ? '24H' : '12H'}
            </button>

            {/* Language Toggle (BN / EN) */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-slate-700 text-xs font-bold transition"
              title="ভাষা পরিবর্তন / Switch Language"
            >
              {isBn ? 'বাং' : 'EN'}
            </button>
          </div>
        </div>

        {/* Live Digital Clock & Calendar Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/30 text-emerald-300 font-mono text-sm sm:text-base font-bold shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {finalTimeStr} {ampm && <span className="text-xs text-emerald-400/80">{ampm}</span>}
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {gregorianStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-teal-950/50 border border-teal-800/30 text-teal-300 font-medium flex items-center gap-1">
              <span>🌙</span>
              <span>{isBn ? hijriDate.formattedBn : hijriDate.formattedEn}</span>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
