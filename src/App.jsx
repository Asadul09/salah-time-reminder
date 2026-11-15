import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import PrayerTimeline from './components/PrayerTimeline';
import PrayerCard from './components/PrayerCard';
import DivisionSelector from './components/DivisionSelector';
import ReminderSettingsModal from './components/ReminderSettingsModal';
import TasbihCounter from './components/TasbihCounter';
import QiblaCompass from './components/QiblaCompass';
import SalahTracker from './components/SalahTracker';
import DuasSection from './components/DuasSection';
import InAppToast from './components/InAppToast';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import InstallModal from './components/InstallModal';
import InstallBanner from './components/InstallBanner';
import confetti from 'canvas-confetti';

import { BANGLADESH_DIVISIONS, DEFAULT_DIVISION } from './data/divisions';
import { 
  calculatePrayers, 
  getActiveAndNextPrayer, 
  getEstimatedHijriDate 
} from './utils/prayerCalc';
import { 
  loadReminderPreferences, 
  saveReminderPreferences, 
  requestNotificationPermission,
  checkPrayerReminders,
  fireNotification,
  isNotificationSupported 
} from './utils/notificationManager';
import { soundPlayer } from './utils/audioAlert';

export default function App() {
  // Live ticking clock
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Selected Division (Dhaka is default)
  const [selectedDivision, setSelectedDivision] = useState(() => {
    try {
      const saved = localStorage.getItem('salah_selected_division');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DIVISION;
  });

  // Reminder Preferences (Default is all 5 enabled)
  const [reminderPrefs, setReminderPrefs] = useState(() => loadReminderPreferences());

  // Daily Completed Prayers Tracker
  const [completedPrayers, setCompletedPrayers] = useState(() => {
    try {
      const savedDate = localStorage.getItem('salah_tracker_date');
      const today = new Date().toISOString().split('T')[0];
      if (savedDate === today) {
        const saved = localStorage.getItem('salah_daily_tracker');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
  });

  // Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (isNotificationSupported()) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }
    return false;
  });
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // UI States
  const [inAppAlert, setInAppAlert] = useState(null);
  const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [is24Hour, setIs24Hour] = useState(false);
  const [lang, setLang] = useState('bn');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Capture beforeinstallprompt for PWA installation on mobile/desktop
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      setInAppAlert({
        id: Date.now(),
        type: 'success',
        prayerNameBn: 'সালাহ রিমাইন্ডার অ্যাপ',
        prayerNameEn: 'Salah Reminder App',
        messageBn: 'অভিনন্দন! অ্যাপটি আপনার ফোনে সফলভাবে ইনস্টল হয়েছে। এখন থেকে সরাসরি হোম স্ক্রিন থেকেই ব্যবহার করতে পারবেন।',
        messageEn: 'Congratulations! Salah Reminder has been installed on your device.'
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [lang]);

  // Save selected division
  const handleSelectDivision = useCallback((division) => {
    setSelectedDivision(division);
    try {
      localStorage.setItem('salah_selected_division', JSON.stringify(division));
    } catch {}
  }, []);

  // Update reminder preferences
  const handleUpdateReminderPrefs = useCallback((newPrefs) => {
    setReminderPrefs(newPrefs);
    saveReminderPreferences(newPrefs);
  }, []);

  // Toggle specific prayer reminder
  const handleTogglePrayerReminder = useCallback((prayerId) => {
    setReminderPrefs(prev => {
      const updated = {
        ...prev,
        [prayerId]: !prev[prayerId]
      };
      saveReminderPreferences(updated);
      return updated;
    });
  }, []);

  // Toggle completed prayer in daily tracker
  const handleToggleComplete = useCallback((prayerId) => {
    setCompletedPrayers(prev => {
      const updated = { ...prev, [prayerId]: !prev[prayerId] };
      const today = new Date().toISOString().split('T')[0];
      try {
        localStorage.setItem('salah_tracker_date', today);
        localStorage.setItem('salah_daily_tracker', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handleResetDailyTracker = useCallback(() => {
    const cleared = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    setCompletedPrayers(cleared);
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('salah_tracker_date', today);
      localStorage.setItem('salah_daily_tracker', JSON.stringify(cleared));
    } catch {}
  }, []);

  // Request notification permission
  const handleRequestNotification = async () => {
    const result = await requestNotificationPermission();
    setNotificationPermission(result);
    setIsSettingsModalOpen(true);
  };

  // Test Notification handler
  const handleTestNotification = () => {
    const sample = {
      prayerId: 'dhuhr',
      prayerNameBn: 'যোহর',
      prayerNameEn: 'Dhuhr',
      type: '30m',
      minutesLeft: 30,
      prayerTimeStr: '১:১৫ পিএম',
      divisionName: selectedDivision.nameBn,
      messageBn: 'টেস্ট নোটিফিকেশন: ওয়াক্তের ঠিক ৩০ মিনিট ও ১০ মিনিট পূর্বে আপনি এই সতর্কবার্তা পাবেন।',
      messageEn: 'Test notification: You will receive this alert exactly 30m and 10m before prayer time.'
    };

    fireNotification(sample, reminderPrefs);
    setInAppAlert(sample);
  };

  // Open install modal or prompt
  const handleOpenInstallModal = useCallback(() => {
    setIsInstallModalOpen(true);
  }, []);

  const handleInstalledSuccess = useCallback(() => {
    setIsInstalled(true);
    setInAppAlert({
      id: Date.now(),
      type: 'success',
      prayerNameBn: 'সালাহ রিমাইন্ডার অ্যাপ',
      prayerNameEn: 'Salah Reminder App',
      messageBn: 'অভিনন্দন! অ্যাপটি আপনার ফোনে সফলভাবে ইনস্টল করা হয়েছে।',
      messageEn: 'Congratulations! The app has been installed on your device.'
    });
  }, []);

  // Calculate prayer times based on current coordinates & date
  const prayerData = useMemo(() => {
    return calculatePrayers(
      selectedDivision.coordinates.latitude,
      selectedDivision.coordinates.longitude,
      currentTime
    );
  }, [selectedDivision, currentTime]);

  // Determine active and next prayer
  const { active, next, nextTime } = useMemo(() => {
    return getActiveAndNextPrayer(prayerData.prayers, currentTime);
  }, [prayerData.prayers, currentTime]);

  // Hijri Date
  const hijriDate = useMemo(() => {
    return getEstimatedHijriDate(currentTime, 0);
  }, [currentTime]);

  // Check reminders every 10 seconds for 30m and 10m triggers
  useEffect(() => {
    const interval = setInterval(() => {
      checkPrayerReminders(
        prayerData.prayers,
        reminderPrefs,
        selectedDivision.nameBn,
        (alertData) => {
          setInAppAlert(alertData);
        }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [prayerData.prayers, reminderPrefs, selectedDivision.nameBn]);

  return (
    <div className="min-h-screen bg-slate-950 bg-islamic-pattern text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-16 sm:pb-0">
      
      {/* Sticky Header with Live Digital Clock & Division Switcher */}
      <Header
        currentTime={currentTime}
        hijriDate={hijriDate}
        selectedDivision={selectedDivision}
        onOpenDivisionModal={() => setIsDivisionModalOpen(true)}
        notificationPermission={notificationPermission}
        onRequestNotification={handleRequestNotification}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        is24Hour={is24Hour}
        onToggle24Hour={() => setIs24Hour(prev => !prev)}
        lang={lang}
        onToggleLang={() => setLang(prev => (prev === 'bn' ? 'en' : 'bn'))}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenInstallModal={handleOpenInstallModal}
        isInstalled={isInstalled}
      />

      {/* Install App Promotion Banner (Dismissible) */}
      <InstallBanner
        onOpenInstallModal={handleOpenInstallModal}
        isInstalled={isInstalled}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-8">
        
        {/* Desktop Section Navigation Tabs */}
        <div className="hidden sm:flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          {[
            { id: 'timeline', bn: 'ওয়াক্ত ও রিমাইন্ডার', en: 'Times & Reminders' },
            { id: 'tracker', bn: '৫ ওয়াক্ত ট্র্যাকার', en: 'Salah Tracker' },
            { id: 'tasbih', bn: 'ডিজিটাল তাসবীহ', en: 'Digital Tasbih' },
            { id: 'qibla', bn: 'কিবলা কম্পাস', en: 'Qibla Direction' },
            { id: 'duas', bn: 'মাসনূন দোয়া', en: 'Masnoon Duas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {lang === 'bn' ? tab.bn : tab.en}
            </button>
          ))}
        </div>

        {/* View Content depending on active tab or mobile scroll */}
        <div className="space-y-8">
          
          {/* TIMELINE TAB (Waqt & Reminders) */}
          {(activeTab === 'timeline' || window.innerWidth < 640) && (
            <div className="space-y-6">
              {/* Hero Card: Next Prayer & 30m / 10m Pre-alert */}
              <PrayerTimeline
                activePrayer={active}
                nextPrayer={next}
                nextTime={nextTime}
                currentTime={currentTime}
                is24Hour={is24Hour}
                lang={lang}
                reminderPrefs={reminderPrefs}
                sehriEnd={prayerData.sehriEnd}
                iftar={prayerData.iftar}
                tahajjudStart={prayerData.tahajjudStart}
                ishraq={prayerData.ishraq}
              />

              {/* Individual Prayer Cards with 30m & 10m Toggle Switches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{lang === 'bn' ? 'আজকের ওয়াক্তসূচি ও রিমাইন্ডার নিয়ন্ত্রণ' : 'Today Prayer Times & Alerts'}</span>
                    <span className="text-xs font-normal text-emerald-400">
                      ({lang === 'bn' ? selectedDivision.nameBn : selectedDivision.name})
                    </span>
                  </h3>
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    {lang === 'bn' ? 'রিমাইন্ডার সেটিংস' : 'Reminder Settings'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prayerData.prayers.map((prayer) => (
                    <PrayerCard
                      key={prayer.id}
                      prayer={prayer}
                      isActive={active?.id === prayer.id}
                      isNext={next?.id === prayer.id}
                      isCompleted={!!completedPrayers[prayer.id]}
                      onToggleComplete={handleToggleComplete}
                      isReminderEnabled={!!reminderPrefs[prayer.id]}
                      onToggleReminder={handleTogglePrayerReminder}
                      is24Hour={is24Hour}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TRACKER TAB */}
          {(activeTab === 'tracker' || (window.innerWidth < 640 && activeTab === 'tracker')) && (
            <SalahTracker
              lang={lang}
              completedPrayers={completedPrayers}
              onToggleComplete={handleToggleComplete}
              onResetDaily={handleResetDailyTracker}
            />
          )}

          {/* TASBIH TAB */}
          {(activeTab === 'tasbih' || (window.innerWidth < 640 && activeTab === 'tasbih')) && (
            <TasbihCounter
              lang={lang}
              soundEnabled={soundEnabled}
            />
          )}

          {/* QIBLA TAB */}
          {(activeTab === 'qibla' || (window.innerWidth < 640 && activeTab === 'qibla')) && (
            <QiblaCompass
              qiblaAngle={prayerData.qiblaAngle}
              selectedDivision={selectedDivision}
              lang={lang}
            />
          )}

          {/* DUAS TAB */}
          {(activeTab === 'duas' || (window.innerWidth < 640 && activeTab === 'duas')) && (
            <DuasSection lang={lang} />
          )}

        </div>

      </main>

      {/* Floating In-App Toast Alert (Triggered strictly at 30m and 10m before Salah) */}
      <InAppToast
        alert={inAppAlert}
        onDismiss={() => setInAppAlert(null)}
        lang={lang}
      />

      {/* Division Selector Modal */}
      <DivisionSelector
        isOpen={isDivisionModalOpen}
        onClose={() => setIsDivisionModalOpen(false)}
        selectedDivision={selectedDivision}
        onSelectDivision={handleSelectDivision}
        lang={lang}
      />

      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        reminderPrefs={reminderPrefs}
        onUpdatePrefs={handleUpdateReminderPrefs}
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestNotification}
        onTestNotification={handleTestNotification}
        lang={lang}
        onOpenInstallModal={handleOpenInstallModal}
        isInstalled={isInstalled}
      />

      {/* App Install / Download Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalledSuccess={handleInstalledSuccess}
        isInstalled={isInstalled}
        lang={lang}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        lang={lang}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        selectedDivision={selectedDivision}
        onOpenDivisionModal={() => setIsDivisionModalOpen(true)}
        lang={lang}
      />

    </div>
  );
}
