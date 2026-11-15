import * as adhan from 'adhan';

// Bengali digits map
export const toBengaliDigits = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

// Format Date object to 12h or 24h string
export const formatTime = (date, is24Hour = false, useBengali = false) => {
  if (!date || isNaN(date.getTime())) return '--:--';
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (is24Hour) {
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes}`;
    return useBengali ? toBengaliDigits(formatted) : formatted;
  }
  
  const ampm = hours >= 12 ? (useBengali ? 'পিএম' : 'PM') : (useBengali ? 'এএম' : 'AM');
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = hours.toString().padStart(2, '0');
  
  const timeStr = `${formattedHours}:${minutes} ${ampm}`;
  return useBengali ? `${toBengaliDigits(`${formattedHours}:${minutes}`)} ${ampm}` : timeStr;
};

// Calculate all prayers for a given date and coordinate
export const calculatePrayers = (latitude, longitude, date = new Date()) => {
  const coordinates = new adhan.Coordinates(latitude, longitude);
  
  // Bangladesh Islamic Foundation conforms to Karachi calculation with Hanafi Asr
  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;
  
  // Today's prayer times
  const ptToday = new adhan.PrayerTimes(coordinates, date, params);
  
  // Tomorrow's Fajr (for overnight countdown after Isha)
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = new adhan.PrayerTimes(coordinates, tomorrow, params);

  // Sehri warning: 10 minutes before Fajr
  const sehriEnd = new Date(ptToday.fajr.getTime() - 5 * 60 * 1000); // 5 min safety margin before Fajr azan
  // Tahajjud: Best time is last third of the night (between Isha and Fajr)
  const nightDuration = ptTomorrow.fajr.getTime() - ptToday.maghrib.getTime();
  const tahajjudStart = new Date(ptToday.maghrib.getTime() + (nightDuration * (2 / 3)));
  // Ishraq / Chasht: ~15 mins after sunrise
  const ishraq = new Date(ptToday.sunrise.getTime() + 15 * 60 * 1000);

  const prayers = [
    {
      id: 'fajr',
      nameEn: 'Fajr',
      nameBn: 'ফজর',
      arabic: 'الفجر',
      time: ptToday.fajr,
      tomorrowTime: ptTomorrow.fajr,
      icon: 'MoonStar',
      isPrimarySalah: true,
      description: 'ভোরের ফরজ নামাজ (২ রাকাত)'
    },
    {
      id: 'sunrise',
      nameEn: 'Sunrise',
      nameBn: 'সূর্যোদয় / ইশরাক',
      arabic: 'الشروق',
      time: ptToday.sunrise,
      tomorrowTime: ptTomorrow.sunrise,
      icon: 'Sunrise',
      isPrimarySalah: false,
      description: 'নামাজ নিষিদ্ধ সময় ও ইশরাকের শুরু'
    },
    {
      id: 'dhuhr',
      nameEn: 'Dhuhr',
      nameBn: 'যোহর',
      arabic: 'الظهر',
      time: ptToday.dhuhr,
      tomorrowTime: ptTomorrow.dhuhr,
      icon: 'Sun',
      isPrimarySalah: true,
      description: 'দুপুরের ফরজ নামাজ (৪ রাকাত)'
    },
    {
      id: 'asr',
      nameEn: 'Asr',
      nameBn: 'আসর (হানাফী)',
      arabic: 'العصر',
      time: ptToday.asr,
      tomorrowTime: ptTomorrow.asr,
      icon: 'Sunset',
      isPrimarySalah: true,
      description: 'বিকেলের ফরজ নামাজ (৪ রাকাত)'
    },
    {
      id: 'maghrib',
      nameEn: 'Maghrib',
      nameBn: 'মাগরিব (ইফতার)',
      arabic: 'المغرب',
      time: ptToday.maghrib,
      tomorrowTime: ptTomorrow.maghrib,
      icon: 'Sunset',
      isPrimarySalah: true,
      description: 'সূর্যাস্তের ফরজ নামাজ ও ইফতারের সময়'
    },
    {
      id: 'isha',
      nameEn: 'Isha',
      nameBn: 'ইশা ও বিতর',
      arabic: 'العشاء',
      time: ptToday.isha,
      tomorrowTime: ptTomorrow.isha,
      icon: 'Moon',
      isPrimarySalah: true,
      description: 'রাতের ফরজ নামাজ (৪ রাকাত ও বিতর)'
    }
  ];

  const qiblaAngle = adhan.Qibla(coordinates);

  return {
    raw: ptToday,
    prayers,
    sehriEnd,
    iftar: ptToday.maghrib,
    tahajjudStart,
    ishraq,
    qiblaAngle: Math.round(qiblaAngle * 10) / 10,
    ptTomorrow
  };
};

// Determine active prayer and upcoming prayer
export const getActiveAndNextPrayer = (prayers, now = new Date()) => {
  const primaryPrayers = prayers.filter(p => p.isPrimarySalah);
  const nowMs = now.getTime();

  let active = null;
  let next = null;

  // Before today's Fajr
  if (nowMs < primaryPrayers[0].time.getTime()) {
    active = {
      ...primaryPrayers[primaryPrayers.length - 1],
      isPreviousDay: true
    };
    next = primaryPrayers[0];
    return { active, next, nextTime: primaryPrayers[0].time };
  }

  // Check between primary prayers
  for (let i = 0; i < primaryPrayers.length; i++) {
    const current = primaryPrayers[i];
    const isLast = i === primaryPrayers.length - 1;
    const currentMs = current.time.getTime();

    if (isLast) {
      if (nowMs >= currentMs) {
        // After Isha: next is tomorrow's Fajr
        active = current;
        next = {
          ...primaryPrayers[0],
          time: primaryPrayers[0].tomorrowTime,
          isTomorrow: true
        };
        return { active, next, nextTime: primaryPrayers[0].tomorrowTime };
      }
    } else {
      const nextP = primaryPrayers[i + 1];
      const nextMs = nextP.time.getTime();

      if (nowMs >= currentMs && nowMs < nextMs) {
        active = current;
        next = nextP;
        return { active, next, nextTime: nextP.time };
      }
    }
  }

  return { active: primaryPrayers[0], next: primaryPrayers[1], nextTime: primaryPrayers[1].time };
};

// Calculate countdown diff in hours, minutes, seconds
export const getCountdown = (targetDate, now = new Date()) => {
  if (!targetDate) return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  
  const totalMs = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds, totalMs };
};

// Approximate Hijri Date for Bangladesh
export const getEstimatedHijriDate = (date = new Date(), adjustmentDays = 0) => {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + adjustmentDays);
  
  const islamicMonthsBn = [
    'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 
    'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 
    'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'
  ];
  
  const islamicMonthsEn = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(adjusted);
    const day = parts.find(p => p.type === 'day')?.value || '1';
    const monthIndex = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10) - 1;
    const year = parts.find(p => p.type === 'year')?.value || '1448';

    const safeMonthIdx = Math.max(0, Math.min(11, monthIndex));

    return {
      day,
      dayBn: toBengaliDigits(day),
      monthEn: islamicMonthsEn[safeMonthIdx],
      monthBn: islamicMonthsBn[safeMonthIdx],
      year,
      yearBn: toBengaliDigits(year),
      formattedBn: `${toBengaliDigits(day)} ${islamicMonthsBn[safeMonthIdx]}, ${toBengaliDigits(year)} হিজরি`,
      formattedEn: `${day} ${islamicMonthsEn[safeMonthIdx]} ${year} AH`
    };
  } catch {
    return {
      day: '1',
      dayBn: '১',
      monthEn: 'Hijri',
      monthBn: 'হিজরি',
      year: '1448',
      yearBn: '১৪৪৮',
      formattedBn: 'পবিত্র হিজরি সেশন',
      formattedEn: 'Hijri Calendar'
    };
  }
};
