import React from 'react';
import { Heart, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer({ selectedDivision, onOpenDivisionModal, lang }) {
  const isBn = lang === 'bn';

  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/70 pt-8 pb-20 sm:pb-10 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'ইসলামিক ফাউন্ডেশন বাংলাদেশ মানসম্মত (হানাফী মাযহাব)' : 'Islamic Foundation BD Standard (Hanafi)'}</span>
          </div>
          <span>•</span>
          <button
            onClick={onOpenDivisionModal}
            className="flex items-center gap-1 text-emerald-400 hover:underline"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isBn ? `বর্তমান অবস্থান: ${selectedDivision.nameBn}` : `Current: ${selectedDivision.name}`}</span>
          </button>
        </div>

        <p className="max-w-2xl mx-auto text-slate-500 leading-relaxed text-[11px]">
          {isBn 
            ? 'রিমাইন্ডার নিয়ম: প্রতিটি ওয়াক্তের ঠিক ৩০ মিনিট এবং ১০ মিনিট পূর্বে সতর্কবার্তা প্রদান করা হয়। ব্যবহারকারী যেকোনো ওয়াক্তের রিমাইন্ডার বন্ধ বা চালু রাখতে পারবেন। অফলাইনেও সঠিকভাবে সময় গণনা করা হয়।'
            : 'Reminder Policy: Notifications fire strictly 30m and 10m before prayer times. Users can selectively toggle alerts per Salah. 100% offline mathematical calculations.'}
        </p>

        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
          <p>© {new Date().getFullYear()} Salah Time Reminder Bangladesh</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for the Muslim Ummah</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
