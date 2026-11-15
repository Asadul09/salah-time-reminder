import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Flame, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toBengaliDigits } from '../utils/prayerCalc';

export default function SalahTracker({ lang, completedPrayers, onToggleComplete, onResetDaily }) {
  const isBn = lang === 'bn';

  const prayersList = [
    { id: 'fajr', bn: 'ফজর', en: 'Fajr', rakat: '২ রাকাত ফরজ' },
    { id: 'dhuhr', bn: 'যোহর', en: 'Dhuhr', rakat: '৪ রাকাত ফরজ' },
    { id: 'asr', bn: 'আসর', en: 'Asr', rakat: '৪ রাকাত ফরজ' },
    { id: 'maghrib', bn: 'মাগরিব', en: 'Maghrib', rakat: '৩ রাকাত ফরজ' },
    { id: 'isha', bn: 'ইশা', en: 'Isha', rakat: '৪ রাকাত ফরজ' },
  ];

  const countCompleted = prayersList.filter(p => completedPrayers[p.id]).length;
  const percentage = Math.round((countCompleted / 5) * 100);

  // Check if all 5 completed
  useEffect(() => {
    if (countCompleted === 5) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [countCompleted]);

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/20 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isBn ? 'দৈনিক ৫ ওয়াক্ত নামাজ ট্র্যাকার' : 'Daily 5 Waqt Salah Tracker'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? 'আজকের নামাজ আদায়ের অগ্রগতি ট্র্যাক করুন' : 'Track your daily prayer consistency'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-600/30 font-mono">
            {isBn ? `${toBengaliDigits(countCompleted)}/৫ সম্পন্ন` : `${countCompleted}/5 Done`}
          </span>
          <button
            onClick={onResetDaily}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="দিনের ট্র্যাকার রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{isBn ? 'আজকের সার্বিক অগ্রগতি' : 'Today\'s Progress'}</span>
          <span className="font-bold text-emerald-400">{isBn ? toBengaliDigits(percentage) : percentage}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Prayer checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {prayersList.map((p) => {
          const isDone = !!completedPrayers[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onToggleComplete(p.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 ${
                isDone
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex sm:flex-col items-center gap-2 text-center">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <div className="font-bold text-sm text-white">
                    {isBn ? p.bn : p.en}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {p.rakat}
                  </div>
                </div>
              </div>
              
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
              }`}>
                {isDone ? (isBn ? 'আদায় হয়েছে' : 'Completed') : (isBn ? 'বাকি' : 'Pending')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hadith Quote */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/20 text-xs text-slate-300">
        <p className="italic text-emerald-200">
          {isBn 
            ? '“যে ব্যক্তি নিয়মিত পাঁচ ওয়াক্ত নামাজ সময়মত আদায় করবে, কিয়ামতের দিন তা তার জন্য নূর, প্রমাণ ও নাজাতের উপায় হবে।”'
            : '"Whoever maintains the five daily prayers on time, they will be a light, proof, and salvation for him on the Day of Resurrection."'}
        </p>
        <p className="text-[10px] text-slate-400 text-right mt-1">— মুসনাদে আহমাদ</p>
      </div>
    </div>
  );
}
