import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, Info } from 'lucide-react';
import { toBengaliDigits } from '../utils/prayerCalc';

export default function QiblaCompass({ qiblaAngle, selectedDivision, lang }) {
  const isBn = lang === 'bn';
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [hasSensor, setHasSensor] = useState(false);

  // Device orientation listener for mobile devices
  useEffect(() => {
    const handleOrientation = (e) => {
      let heading = e.alpha;
      if (e.webkitCompassHeading) {
        heading = e.webkitCompassHeading; // iOS support
      }
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(Math.round(heading));
        setHasSensor(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Distance from Dhaka to Makkah is ~5130 km
  const approximateDistanceKm = 5130;

  // Relative rotation of Kaaba pointer
  // If sensor exists: rotate compass dial opposite to heading, Kaaba needle points to qiblaAngle
  const compassRotation = hasSensor ? -deviceHeading : 0;
  const kaabaAngle = qiblaAngle;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/20 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isBn ? 'কিবলা কম্পাস ও দিকনির্দেশনা' : 'Qibla Direction & Compass'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? `${selectedDivision.nameBn} থেকে পবিত্র কাবা শরিফের দিক` : `Direction to Kaaba from ${selectedDivision.name}`}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-300 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700">
            {isBn ? `${toBengaliDigits(qiblaAngle)}° পশ্চিম-উত্তর` : `${qiblaAngle}° WNW`}
          </span>
        </div>
      </div>

      {/* Compass Dial Display */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border-4 border-emerald-600/40 shadow-2xl flex items-center justify-center p-3">
          
          {/* Compass Dial markings */}
          <div 
            className="absolute inset-2 rounded-full border border-slate-700/50 flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Cardinal points */}
            <span className="absolute top-2 text-xs font-bold text-rose-400 font-mono">N</span>
            <span className="absolute bottom-2 text-xs font-bold text-slate-400 font-mono">S</span>
            <span className="absolute right-2 text-xs font-bold text-slate-400 font-mono">E</span>
            <span className="absolute left-2 text-xs font-bold text-emerald-400 font-mono font-bold">W</span>

            {/* Minor degree markers */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800/80" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800/80" />
          </div>

          {/* Qibla Direction Needle pointing towards Qibla angle */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 pointer-events-none"
            style={{ transform: `rotate(${kaabaAngle + compassRotation}deg)` }}
          >
            <div className="w-1 h-28 -translate-y-12 bg-gradient-to-t from-transparent via-emerald-500 to-emerald-400 rounded-full flex flex-col items-center shadow-lg shadow-emerald-500/50">
              {/* Kaaba Icon at needle tip */}
              <div className="w-7 h-7 rounded-lg bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xs shadow-md shadow-amber-400/40">
                🕋
              </div>
            </div>
          </div>

          {/* Center Hub */}
          <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-emerald-400/60 flex flex-col items-center justify-center shadow-md z-10">
            <span className="text-[10px] font-mono font-black text-emerald-400">
              {isBn ? toBengaliDigits(qiblaAngle) : Math.round(qiblaAngle)}°
            </span>
          </div>
        </div>

        {/* Direction guidance message */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs font-semibold text-emerald-300">
            {isBn 
              ? `কাবার কোণ: উত্তর থেকে ${toBengaliDigits(qiblaAngle)}° কোণে (পশ্চিম দিকে মুখ করে সামান্য ডান পাশে)`
              : `Kaaba Angle: ${qiblaAngle}° from True North (West slightly North)`}
          </p>
          <p className="text-[11px] text-slate-400">
            {isBn 
              ? `মক্কা শরিফ থেকে দূরত্ব: আনুমানিক ${toBengaliDigits(approximateDistanceKm)} কিলোমিটার` 
              : `Approx distance to Makkah: ~${approximateDistanceKm} km`}
          </p>
          {hasSensor ? (
            <span className="inline-block text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800/50 mt-1">
              ✓ {isBn ? 'মোবাইল সেন্সর লাইভ সংযুক্ত' : 'Live sensor active'}
            </span>
          ) : (
            <span className="inline-block text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full mt-1">
              ℹ {isBn ? 'মোবাইলে ডিভাইসটি অনুভূমিকভাবে রেখে দিক মিলান' : 'Hold mobile horizontally to calibrate'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
