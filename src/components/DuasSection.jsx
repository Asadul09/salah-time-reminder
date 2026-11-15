import React, { useState } from 'react';
import { BookOpen, Copy, Check, Sparkles } from 'lucide-react';
import { DUAS_COLLECTION } from '../data/duas';

export default function DuasSection({ lang }) {
  const isBn = lang === 'bn';
  const [copiedId, setCopiedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'নামাজ পরবর্তী যিকির', 'সর্বশ্রেষ্ঠ আয়াত', 'রোজা ও ইফতার', 'কুরআনী দোয়া'];

  const filteredDuas = filterCategory === 'all' 
    ? DUAS_COLLECTION 
    : DUAS_COLLECTION.filter(d => d.category === filterCategory);

  const handleCopy = (dua) => {
    const textToCopy = `${dua.title}\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.transliteration}\n\nঅর্থ: ${dua.meaningBn}\n\nসূত্র: ${dua.reference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/20 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isBn ? 'নামাজের দোয়া ও দৈনন্দিন মাসনূন যিকির' : 'Post-Salah Duas & Daily Azkar'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? 'বিশুদ্ধ হাদিস বর্ণিত গুরুত্বপূর্ণ দোয়া ও তাসবীহ' : 'Authentic Duas with Arabic, meaning & reference'}
            </p>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {cat === 'all' ? (isBn ? 'সব দোয়া' : 'All Duas') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Duas cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map((dua) => (
          <div
            key={dua.id}
            className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-slate-800/80 hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dua.category}
                </span>
                <button
                  onClick={() => handleCopy(dua)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300 p-1 rounded-lg transition"
                  title="দোয়া কপি করুন"
                >
                  {copiedId === dua.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <h4 className="font-bold text-white text-base">
                {dua.title}
              </h4>

              {/* Arabic Text */}
              <div className="my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-arabic text-xl sm:text-2xl text-emerald-300 text-right leading-loose">
                {dua.arabic}
              </div>

              {/* Transliteration */}
              <div className="text-xs text-slate-300 italic mb-2">
                <span className="font-semibold text-slate-400">উচ্চারণ: </span>
                {dua.transliteration}
              </div>

              {/* Meaning */}
              <div className="text-xs text-slate-200">
                <span className="font-semibold text-emerald-400">অর্থ: </span>
                {dua.meaningBn}
              </div>
            </div>

            {/* Reference */}
            <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
              হাদিস সূত্র: {dua.reference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
