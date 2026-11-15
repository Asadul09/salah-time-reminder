import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DHIKR_ITEMS } from '../data/duas';
import { toBengaliDigits } from '../utils/prayerCalc';
import { soundPlayer } from '../utils/audioAlert';

export default function TasbihCounter({ lang, soundEnabled }) {
  const isBn = lang === 'bn';
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_ITEMS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [totalToday, setTotalToday] = useState(0);

  // Load from storage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('tasbih_count');
      const savedTotal = localStorage.getItem('tasbih_total');
      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedTotal) setTotalToday(parseInt(savedTotal, 10));
    } catch {}
  }, []);

  const handleIncrement = () => {
    const nextCount = count + 1;
    const nextTotal = totalToday + 1;
    setCount(nextCount);
    setTotalToday(nextTotal);

    // Save
    localStorage.setItem('tasbih_count', nextCount.toString());
    localStorage.setItem('tasbih_total', nextTotal.toString());

    // Gentle click sound & vibration
    if (soundEnabled) {
      soundPlayer.playChime('gentle');
    }
    soundPlayer.vibrate([30]);

    // Check if target reached
    if (target > 0 && nextCount === target) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#14b8a6', '#f59e0b', '#ffffff']
      });
      soundPlayer.vibrate([100, 50, 150]);
    }
  };

  const handleReset = () => {
    setCount(0);
    localStorage.setItem('tasbih_count', '0');
  };

  const handleDhikrChange = (item) => {
    setSelectedDhikr(item);
    setTarget(item.defaultTarget);
    setCount(0);
  };

  const progressPercent = target > 0 ? Math.min(100, (count / target) * 100) : 100;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/20 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📿</span>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isBn ? 'ডিজিটাল তাসবীহ ও যিকির' : 'Digital Tasbih & Dhikr'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? 'নামাজের পরে ও অবসরে আল্লাহর স্মরণ' : 'Remember Allah anytime'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-emerald-300 font-medium border border-slate-700">
            {isBn ? `মোট: ${toBengaliDigits(totalToday)}` : `Total: ${totalToday}`}
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dhikr selection pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DHIKR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleDhikrChange(item)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedDhikr.id === item.id
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isBn ? item.bn : item.arabic}
          </button>
        ))}
      </div>

      {/* Active Dhikr Display */}
      <div className="text-center py-2">
        <div className="font-arabic text-3xl sm:text-4xl text-emerald-300 font-bold mb-1 leading-relaxed">
          {selectedDhikr.arabic}
        </div>
        <div className="text-sm font-semibold text-slate-200">
          {selectedDhikr.bn}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {selectedDhikr.meaning}
        </div>
      </div>

      {/* Big Interactive Tap Counter */}
      <div className="flex flex-col items-center justify-center pt-2">
        <button
          onClick={handleIncrement}
          className="relative group w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-emerald-950 via-slate-900 to-emerald-900 border-4 border-emerald-500/50 shadow-2xl flex flex-col items-center justify-center transition active:scale-95 hover:border-emerald-400 cursor-pointer select-none"
        >
          {/* Circular progress border simulation */}
          <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-wider">
            {isBn ? toBengaliDigits(count) : count}
          </div>
          
          <div className="text-xs text-emerald-400 font-semibold mt-1">
            {target > 0 ? (isBn ? `/ লক্ষ্য ${toBengaliDigits(target)}` : `/ Target ${target}`) : 'অবিরাম'}
          </div>

          <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">
            {isBn ? 'ট্যাপ করুন' : 'TAP HERE'}
          </span>
        </button>

        {/* Target Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-slate-400">{isBn ? 'টার্গেট:' : 'Target:'}</span>
          {[33, 99, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                setCount(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                target === t
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {t === 0 ? (isBn ? 'সীমাহীন' : '∞') : (isBn ? toBengaliDigits(t) : t)}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {target > 0 && (
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
