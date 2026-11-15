import React from 'react';
import { 
  Clock, Bell, BellRing, Sparkles, Sunrise, Sunset, 
  Moon, Sun, CheckCircle, ShieldAlert, ArrowRight 
} from 'lucide-react';
import { formatTime, toBengaliDigits, getCountdown } from '../utils/prayerCalc';

export default function PrayerTimeline({
  activePrayer,
  nextPrayer,
  nextTime,
  currentTime,
  is24Hour,
  lang,
  reminderPrefs,
  sehriEnd,
  iftar,
  tahajjudStart,
  ishraq
}) {
  const isBn = lang === 'bn';

  const countdown = getCountdown(nextTime, currentTime);

  // Calculate the upcoming reminder time (either 30m or 10m before next prayer)
  let nextReminderLabel = '';
  let nextReminderBadge = null;
  
  if (nextPrayer && reminderPrefs[nextPrayer.id]) {
    const prayerMs = nextTime.getTime();
    const msLeft = prayerMs - currentTime.getTime();
    const minutesLeft = Math.floor(msLeft / (60 * 1000));

    if (minutesLeft > 30) {
      const time30m = new Date(prayerMs - 30 * 60 * 1000);
      nextReminderLabel = isBn 
        ? `১ম সতর্কবার্তা (৩০ মি. আগে): ${formatTime(time30m, is24Hour, true)}` 
        : `1st Reminder (30m before): ${formatTime(time30m, is24Hour, false)}`;
      nextReminderBadge = '৩০ মিনিট আগে';
    } else if (minutesLeft > 10) {
      const time10m = new Date(prayerMs - 10 * 60 * 1000);
      nextReminderLabel = isBn 
        ? `২য় সতর্কবার্তা (১০ মি. আগে): ${formatTime(time10m, is24Hour, true)}` 
        : `2nd Reminder (10m before): ${formatTime(time10m, is24Hour, false)}`;
      nextReminderBadge = '১০ মিনিট আগে';
    } else {
      nextReminderLabel = isBn 
        ? 'ওয়াক্ত খুব সন্নিকটে (১০ মিনিটের কম বাকি)' 
        : 'Prayer time imminent (less than 10 mins)';
      nextReminderBadge = 'ওয়াক্ত সমাগত';
    }
  } else if (nextPrayer && !reminderPrefs[nextPrayer.id]) {
    nextReminderLabel = isBn ? 'এই নামাজের রিমাইন্ডার বন্ধ রয়েছে' : 'Reminder is turned OFF for this Salah';
    nextReminderBadge = 'বন্ধ';
  }

  // Calculate percentage of day/window passed
  const hoursFormatted = isBn ? toBengaliDigits(countdown.hours.toString().padStart(2, '0')) : countdown.hours.toString().padStart(2, '0');
  const minutesFormatted = isBn ? toBengaliDigits(countdown.minutes.toString().padStart(2, '0')) : countdown.minutes.toString().padStart(2, '0');
  const secondsFormatted = isBn ? toBengaliDigits(countdown.seconds.toString().padStart(2, '0')) : countdown.seconds.toString().padStart(2, '0');

  return (
    <div className="space-y-4">
      {/* Hero Countdown & Next Prayer Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/25 p-5 sm:p-7 shadow-xl shadow-black/20">
        
        {/* Decorative background glow */}
        <div className="absolute -top-28 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/30 pb-5">
            
            {/* Active & Next Prayer Heading */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isBn ? 'পরবর্তী ওয়াক্ত' : 'Next Prayer'}
                </span>
                {nextPrayer?.isTomorrow && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {isBn ? 'আগামীকাল' : 'Tomorrow'}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {isBn ? nextPrayer?.nameBn : nextPrayer?.nameEn}
                </h2>
                <span className="font-arabic text-xl sm:text-2xl text-emerald-300/80">
                  {nextPrayer?.arabic}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <span>{isBn ? 'ওয়াক্ত শুরু:' : 'Starts at:'}</span>
                <span className="font-bold text-emerald-300 text-sm sm:text-base">
                  {formatTime(nextTime, is24Hour, isBn)}
                </span>
                {activePrayer && (
                  <span className="text-slate-400 hidden sm:inline">
                    ({isBn ? `বর্তমান ওয়াক্ত: ${activePrayer.nameBn}` : `Current: ${activePrayer.nameEn}`})
                  </span>
                )}
              </p>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {isBn ? 'ওয়াক্ত শুরু হতে বাকি:' : 'Time Remaining:'}
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-inner font-mono">
                    {hoursFormatted}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{isBn ? 'ঘণ্টা' : 'Hours'}</span>
                </div>
                
                <span className="text-xl sm:text-2xl font-black text-emerald-400 pb-4">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center text-xl sm:text-2xl font-black text-emerald-300 shadow-inner font-mono">
                    {minutesFormatted}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{isBn ? 'মিনিট' : 'Mins'}</span>
                </div>

                <span className="text-xl sm:text-2xl font-black text-emerald-400 pb-4">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center text-xl sm:text-2xl font-black text-teal-300 shadow-inner font-mono">
                    {secondsFormatted}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{isBn ? 'সেকেন্ড' : 'Secs'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Reminder Status & Notification Rule Bar */}
          <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BellRing className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-slate-400 block sm:inline mr-1">
                  {isBn ? 'নির্ধারিত রিমাইন্ডার:' : 'Scheduled Reminder:'}
                </span>
                <span className="font-semibold text-emerald-300">
                  {nextReminderLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
                ⏰ {isBn ? 'স্বয়ংক্রিয়: ৩০ মি. ও ১০ মি. আগে' : 'Auto: 30m & 10m before'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Fasting & Voluntary prayer helper banner (Sehri, Iftar, Tahajjud, Ishraq) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Sehri End */}
        <div className="glass-panel rounded-2xl p-3 border border-emerald-900/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/30">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isBn ? 'সেহরির শেষ সময়' : 'Sehri Ends'}
            </div>
            <div className="text-sm font-bold text-slate-100">
              {formatTime(sehriEnd, is24Hour, isBn)}
            </div>
          </div>
        </div>

        {/* Iftar Time */}
        <div className="glass-panel rounded-2xl p-3 border border-emerald-900/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/30">
            <Sunset className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isBn ? 'ইফতারের সময়' : 'Iftar Time'}
            </div>
            <div className="text-sm font-bold text-amber-300">
              {formatTime(iftar, is24Hour, isBn)}
            </div>
          </div>
        </div>

        {/* Ishraq / Chasht */}
        <div className="glass-panel rounded-2xl p-3 border border-emerald-900/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800/30">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isBn ? 'ইশরাক শুরু' : 'Ishraq Starts'}
            </div>
            <div className="text-sm font-bold text-slate-100">
              {formatTime(ishraq, is24Hour, isBn)}
            </div>
          </div>
        </div>

        {/* Tahajjud */}
        <div className="glass-panel rounded-2xl p-3 border border-emerald-900/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isBn ? 'তাহাজ্জুদ উত্তম সময়' : 'Tahajjud Optimal'}
            </div>
            <div className="text-sm font-bold text-purple-300">
              {formatTime(tahajjudStart, is24Hour, isBn)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
