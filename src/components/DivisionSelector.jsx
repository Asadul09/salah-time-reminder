import React, { useState } from 'react';
import { 
  X, MapPin, Check, Search, Compass, Navigation, 
  RotateCcw, Sparkles 
} from 'lucide-react';
import { BANGLADESH_DIVISIONS, DEFAULT_DIVISION } from '../data/divisions';
import { toBengaliDigits } from '../utils/prayerCalc';

export default function DivisionSelector({
  isOpen,
  onClose,
  selectedDivision,
  onSelectDivision,
  lang
}) {
  const [search, setSearch] = useState('');
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  if (!isOpen) return null;
  const isBn = lang === 'bn';

  const filteredDivisions = BANGLADESH_DIVISIONS.filter(div => {
    const q = search.toLowerCase();
    return div.name.toLowerCase().includes(q) || div.nameBn.includes(q) || div.description.includes(q);
  });

  // GPS auto-locate
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(isBn ? 'আপনার ব্রাউজারে জিপিএস সমর্থিত নয়।' : 'Geolocation not supported by browser.');
      return;
    }

    setLocating(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        
        // Find closest Bangladesh division by euclidean distance
        let closest = BANGLADESH_DIVISIONS[0];
        let minDistance = Infinity;

        BANGLADESH_DIVISIONS.forEach(div => {
          const dLat = div.coordinates.latitude - latitude;
          const dLon = div.coordinates.longitude - longitude;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          if (dist < minDistance) {
            minDistance = dist;
            closest = div;
          }
        });

        // Custom GPS division
        const customLoc = {
          id: `custom_${Date.now()}`,
          name: `${closest.name} (GPS Precise)`,
          nameBn: `${closest.nameBn} (জিপিএস সঠিক অবস্থান)`,
          coordinates: { latitude, longitude },
          isDefault: false,
          description: `অক্ষরেখা: ${latitude.toFixed(2)}°, দ্রাঘিমারেখা: ${longitude.toFixed(2)}°`,
          diffDhakaMinutes: closest.diffDhakaMinutes
        };

        onSelectDivision(customLoc);
        onClose();
      },
      (err) => {
        setLocating(false);
        setGeoError(isBn ? 'অবস্থান শনাক্ত করা যায়নি। অনুগ্রহ করে তালিকা থেকে নির্বাচন করুন।' : 'Could not detect location. Please pick from list.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/80 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isBn ? 'বিভাগ বা এলাকা নির্বাচন করুন' : 'Select Division / Location'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'ঢাকা বিভাগ ডিফল্ট হিসেবে সংরক্ষিত' : 'Dhaka division is set as default'}
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

        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? 'বিভাগের নাম খুঁজুন (যেমন: ঢাকা, চট্টগ্রাম...)' : 'Search division name...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            {/* GPS auto detect button */}
            <button
              onClick={handleDetectLocation}
              disabled={locating}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-600/30 text-emerald-300 text-xs font-semibold transition"
            >
              <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? (isBn ? 'অবস্থান খোঁজা হচ্ছে...' : 'Detecting...') : (isBn ? 'আমার লাইভ GPS অবস্থান ব্যবহার করুন' : 'Use My GPS Location')}</span>
            </button>

            {/* Reset to Dhaka Default button */}
            <button
              onClick={() => {
                onSelectDivision(DEFAULT_DIVISION);
                onClose();
              }}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
              title="ডিফল্ট ঢাকা বিভাগে ফিরে যান"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'ডিফল্ট ঢাকা' : 'Reset Dhaka'}</span>
            </button>
          </div>

          {geoError && (
            <p className="text-xs text-rose-400 px-1">{geoError}</p>
          )}
        </div>

        {/* Divisions List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredDivisions.map((div) => {
            const isSelected = selectedDivision.id === div.id;
            const isDefault = div.id === 'dhaka';
            const diffSign = div.diffDhakaMinutes > 0 ? `+${div.diffDhakaMinutes}` : div.diffDhakaMinutes;

            return (
              <div
                key={div.id}
                onClick={() => {
                  onSelectDivision(div);
                  onClose();
                }}
                className={`cursor-pointer rounded-2xl p-3.5 transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {isBn ? div.nameBn : div.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({isBn ? div.name : div.nameBn})
                      </span>
                      {isDefault && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          {isBn ? 'ডিফল্ট' : 'Default'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {div.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {div.diffDhakaMinutes !== 0 && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {isBn ? `${toBengaliDigits(diffSign)} মি.` : `${diffSign}m`}
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
