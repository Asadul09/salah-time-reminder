import React from 'react';
import { Clock, CheckSquare, Compass, BookOpen, Sparkles, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, lang, onOpenSettings }) {
  const isBn = lang === 'bn';

  const tabs = [
    { id: 'timeline', labelBn: 'ওয়াক্ত', labelEn: 'Times', icon: Clock },
    { id: 'tracker', labelBn: 'ট্র্যাকার', labelEn: 'Tracker', icon: CheckSquare },
    { id: 'tasbih', labelBn: 'তাসবীহ', labelEn: 'Tasbih', icon: Sparkles },
    { id: 'qibla', labelBn: 'কিবলা', labelEn: 'Qibla', icon: Compass },
    { id: 'duas', labelBn: 'দোয়া', labelEn: 'Duas', icon: BookOpen },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">
                {isBn ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          );
        })}

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 transition"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">
            {isBn ? 'সেটিংস' : 'Settings'}
          </span>
        </button>
      </div>
    </nav>
  );
}
