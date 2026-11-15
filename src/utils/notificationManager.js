import { soundPlayer } from './audioAlert';
import { formatTime, toBengaliDigits } from './prayerCalc';

// Local storage keys
const STORAGE_KEY_PREFS = 'salah_reminder_preferences';
const STORAGE_KEY_LOG = 'salah_reminder_fired_log';
const STORAGE_KEY_DIVISION = 'salah_selected_division';
const STORAGE_KEY_TRACKER = 'salah_daily_tracker';

export const getDefaultReminderPreferences = () => ({
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  soundEnabled: true,
  vibrationEnabled: true
});

export const loadReminderPreferences = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFS);
    if (saved) {
      return { ...getDefaultReminderPreferences(), ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load preferences:', e);
  }
  return getDefaultReminderPreferences();
};

export const saveReminderPreferences = (prefs) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
};

// Check if browser notifications are supported
export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
};

// Clean up old fired logs (older than 2 days)
const cleanFiredLog = () => {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY_LOG) || '{}');
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const cleaned = {};
    for (const key in log) {
      if (now - log[key] < twoDaysMs) {
        cleaned[key] = log[key];
      }
    }
    localStorage.setItem(STORAGE_KEY_LOG, JSON.stringify(cleaned));
  } catch (e) {
    console.warn('Failed to clean notification log:', e);
  }
};

// Check if a specific reminder has already fired
const hasFired = (reminderKey) => {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY_LOG) || '{}');
    return !!log[reminderKey];
  } catch {
    return false;
  }
};

// Mark reminder as fired
const markAsFired = (reminderKey) => {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY_LOG) || '{}');
    log[reminderKey] = Date.now();
    localStorage.setItem(STORAGE_KEY_LOG, JSON.stringify(log));
  } catch (e) {
    console.warn('Failed to save fired reminder:', e);
  }
};

/**
 * Evaluates upcoming prayer times and checks for 30m and 10m reminders.
 * Returns null if no reminder, or an alert object if one was triggered.
 */
export const checkPrayerReminders = (prayers, prefs, divisionName = 'ঢাকা', onInAppAlert = null) => {
  cleanFiredLog();
  const now = new Date();
  const nowMs = now.getTime();
  const dateStr = now.toISOString().split('T')[0];

  const primaryPrayers = prayers.filter(p => p.isPrimarySalah);

  for (const prayer of primaryPrayers) {
    // Check if user turned off this specific salah reminder
    if (!prefs[prayer.id]) {
      continue;
    }

    const prayerTime = prayer.time;
    const diffMs = prayerTime.getTime() - nowMs;
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffSeconds = Math.floor(diffMs / 1000);

    // 1st Reminder: Exactly 30 minutes before (window: 29m 0s to 30m 30s)
    const key30m = `${prayer.id}_30m_${dateStr}`;
    if (diffMinutes <= 30 && diffMinutes >= 28 && !hasFired(key30m)) {
      markAsFired(key30m);
      
      const alertData = {
        prayerId: prayer.id,
        prayerNameBn: prayer.nameBn,
        prayerNameEn: prayer.nameEn,
        type: '30m',
        minutesLeft: 30,
        prayerTimeStr: formatTime(prayerTime, false, true),
        divisionName,
        messageBn: `${prayer.nameBn} নামাজের ওয়াক্ত শুরু হতে ৩০ মিনিট বাকি আছে। ওজু ও প্রস্তুতির উত্তম সময়।`,
        messageEn: `30 minutes remaining until ${prayer.nameEn} prayer (${formatTime(prayerTime)}). Prepare for Salah.`
      };

      fireNotification(alertData, prefs);
      if (onInAppAlert) onInAppAlert(alertData);
      return alertData;
    }

    // 2nd Reminder: Exactly 10 minutes before (window: 9m 0s to 10m 30s)
    const key10m = `${prayer.id}_10m_${dateStr}`;
    if (diffMinutes <= 10 && diffMinutes >= 8 && !hasFired(key10m)) {
      markAsFired(key10m);
      
      const alertData = {
        prayerId: prayer.id,
        prayerNameBn: prayer.nameBn,
        prayerNameEn: prayer.nameEn,
        type: '10m',
        minutesLeft: 10,
        prayerTimeStr: formatTime(prayerTime, false, true),
        divisionName,
        messageBn: `সতর্কবার্তা! আর মাত্র ১০ মিনিট পর ${prayer.nameBn} নামাজের ওয়াক্ত শুরু হবে।`,
        messageEn: `Alert! Only 10 minutes left until ${prayer.nameEn} prayer (${formatTime(prayerTime)}).`
      };

      fireNotification(alertData, prefs);
      if (onInAppAlert) onInAppAlert(alertData);
      return alertData;
    }
  }

  return null;
};

// Dispatch the notification to system & sound
export const fireNotification = (alertData, prefs) => {
  // Play sound if enabled
  if (prefs.soundEnabled) {
    soundPlayer.playChime(alertData.type === '10m' ? 'urgent' : 'gentle');
  }

  // Vibrate if enabled
  if (prefs.vibrationEnabled) {
    soundPlayer.vibrate(alertData.type === '10m' ? [200, 100, 200, 100, 300] : [150, 100, 150]);
  }

  // System Notification
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const title = alertData.type === '30m' 
        ? `🕌 ৩০ মিনিট বাকি - ${alertData.prayerNameBn} (${alertData.divisionName})`
        : `⏰ ১০ মিনিট বাকি! - ${alertData.prayerNameBn} (${alertData.divisionName})`;

      const notification = new Notification(title, {
        body: `${alertData.messageBn}\nওয়াক্ত: ${alertData.prayerTimeStr}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/2855/2855428.png',
        tag: `salah_${alertData.prayerId}_${alertData.type}`,
        renotify: true,
        badge: 'https://cdn-icons-png.flaticon.com/512/2855/2855428.png'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.warn('System notification display failed:', e);
    }
  }
};
