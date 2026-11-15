import React from 'react';
import { BellRing, X, Clock, MapPin } from 'lucide-react';

export default function InAppToast({ alert, onDismiss, lang }) {
  if (!alert) return null;
  const isBn = lang === 'bn';

  const isUrgent = alert.type === '10m';

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-3xl shadow-2xl border backdrop-blur-xl flex flex-col gap-2.5 ${
        isUrgent 
          ? 'bg-amber-950/95 border-amber-500/60 shadow-amber-950/60 text-amber-100 ring-2 ring-amber-500/40' 
          : 'bg-emerald-950/95 border-emerald-500/60 shadow-emerald-950/60 text-emerald-100 ring-2 ring-emerald-500/40'
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl ${
              isUrgent ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isUrgent ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isUrgent ? '১০ মিনিট বাকি' : '৩০ মিনিট বাকি'}
              </span>
              <h4 className="font-extrabold text-base text-white mt-0.5">
                {isBn ? alert.prayerNameBn : alert.prayerNameEn} - নামাজের সতর্কতা
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 rounded-xl bg-black/30 hover:bg-black/50 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          {isBn ? alert.messageBn : alert.messageEn}
        </p>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5" />
            <span>ওয়াক্ত: {alert.prayerTimeStr}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{alert.divisionName}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
