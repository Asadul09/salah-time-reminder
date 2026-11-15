import React from 'react';
import { 
  Bell, BellOff, CheckCircle2, Circle, Sun, 
  Sunset, Sunrise, Moon, MoonStar, Volume2 
} from 'lucide-react';
import { formatTime, toBengaliDigits } from '../utils/prayerCalc';

export default function PrayerCard({
  prayer,
  isActive,
  isNext,
  isCompleted,
  onToggleComplete,
  isReminderEnabled,
  onToggleReminder,
  is24Hour,
  lang
}) {
  const isBn = lang === 'bn';

  // Choose icon based on prayer type
  const renderIcon = () => {
    const props = { className: "w-5 h-5 sm:w-6 sm:h-6" };
    switch (prayer.id) {
      case 'fajr': return <MoonStar {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />;
      case 'sunrise': return <Sunrise {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />;
      case 'dhuhr': return <Sun {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
      case 'asr': return <Sunset {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />;
      case 'maghrib': return <Sunset {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />;
      case 'isha': return <Moon {...props} className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />;
      default: return <Sun {...props} className="text-emerald-400" />;
    }
  };

  const formattedTime = formatTime(prayer.time, is24Hour, isBn);

  return (
    <div className={`relative overflow-hidden rounded-2xl transition-all duration-200 border hover:-translate-y-0.5 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border-emerald-400/70 shadow-lg shadow-emerald-950/30'
        : isNext
        ? 'bg-slate-900/90 border-teal-400/50 shadow-md shadow-black/10'
        : 'bg-slate-900/65 hover:bg-slate-800/75 border-slate-800 hover:border-slate-700'
    } p-4 sm:p-5`}>

      {/* Active/Next badges */}
      {isActive && (
        <span className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-bl-xl tracking-wider shadow">
          {isBn ? 'বর্তমান ওয়াক্ত' : 'Current Salah'}
        </span>
      )}
      {isNext && !isActive && (
        <span className="absolute top-0 right-0 bg-teal-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-bl-xl tracking-wider shadow">
          {isBn ? 'আসন্ন ওয়াক্ত' : 'Next Up'}
        </span>
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Names */}
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-center ${
            isActive 
              ? 'bg-emerald-500/20 border border-emerald-400/40 shadow-inner'
              : 'bg-slate-800/80 border border-slate-700/50'
          }`}>
            {renderIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isBn ? prayer.nameBn : prayer.nameEn}
              </h3>
              <span className="font-arabic text-sm text-slate-400 hidden sm:inline">
                {prayer.arabic}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {prayer.description}
            </p>
          </div>
        </div>

        {/* Right: Time & Notification Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Time display */}
          <div className="text-right">
            <div className={`text-base sm:text-xl font-extrabold font-mono tracking-tight ${
              isActive ? 'text-emerald-300' : 'text-slate-100'
            }`}>
              {formattedTime}
            </div>
            {prayer.isPrimarySalah && (
              <span className="text-[10px] text-slate-400 hidden sm:block">
                {isBn ? '৩০ ও ১০ মি. আগে রিমাইন্ডার' : '30m & 10m Pre-alerts'}
              </span>
            )}
          </div>

          {/* Toggle Reminder Switch for specific Salah */}
          {prayer.isPrimarySalah && (
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReminder(prayer.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition duration-200 active:scale-95 ${
                  isReminderEnabled
                    ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-600/40'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title={
                  isReminderEnabled
                    ? (isBn ? 'এই নামাজের রিমাইন্ডার বন্ধ করুন' : 'Turn off reminder for this prayer')
                    : (isBn ? 'এই নামাজের রিমাইন্ডার চালু করুন' : 'Turn on reminder for this prayer')
                }
              >
                {isReminderEnabled ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline font-semibold">{isBn ? 'অন' : 'ON'}</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">{isBn ? 'বন্ধ' : 'OFF'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Salah Completed Checklist checkbox */}
          {prayer.isPrimarySalah && onToggleComplete && (
            <button
              onClick={() => onToggleComplete(prayer.id)}
              className={`p-2 rounded-xl border transition active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
              title={isCompleted ? 'নামাজ আদায় সম্পন্ন (চিহ্নিত)' : 'নামাজ আদায় চিহ্নিত করুন'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
