# 🕌 Salah Time Reminder Bangladesh (সালাহ রিমাইন্ডার ও নামাজের সময়সূচি)

A modern, mobile-first, and highly responsive **Salah Time Reminder & Islamic Companion** tailored for Bangladesh. Built with **Dhaka Division as the default**, with instant support for all 8 divisions of Bangladesh (and precise GPS coordinates).

Equipped with a **proactive 2-stage notification system** (alerts strictly at **30 minutes before** and **10 minutes before** prayer times), selective prayer toggles, a digital tasbih counter, Qibla compass, 5-waqt tracker, and authentic post-salah duas.

![Salah Time Reminder](public/icon.svg)

---

## ✨ Key Features

### 📍 Division & Location Flexibility
- **Default Division:** **Dhaka (ঢাকা)** is pre-configured as the default central standard.
- **All 8 Divisions Supported:** One-click instant switching between Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh.
- **Accurate Coordinates & Calculations:** Conforms to **Islamic Foundation Bangladesh** conventions using the University of Islamic Sciences (Karachi) astronomical calculation standard with **Hanafi Madhab** for Asr timing.
- **Live GPS Detection:** Option to pinpoint exact latitude and longitude via GPS for sub-minute accuracy anywhere in Bangladesh.

### ⏰ Proactive Dual-Stage Reminders (Strictly 30m & 10m)
- **1st Reminder (30 Minutes Before):** Gives you ample time for Wudu (ablution) and preparation.
- **2nd Reminder (10 Minutes Before):** Urgent pre-alert right before the Azan / prayer time begins.
- **Strictly Limited:** No spam, no excess notifications—fires strictly at 30m and 10m.
- **Per-Salah Selective Toggles:** By default, all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) have reminders enabled. Users can individually toggle OFF/ON reminders for any specific prayer.
- **Web Notification API + In-App Alerts:** Delivers native system notifications as well as an in-app visual toast banner with gentle harmonic chimes (Web Audio API) and vibration.

### 📱 Extra Digital Features
- **Live Digital Clock & Hijri Calendar:** Real-time clock with ticking seconds, 12-hour/24-hour mode, Gregorian date, and Umm al-Qura Hijri date in Bengali & English.
- **Next Prayer Live Countdown:** Precise real-time countdown (hours : minutes : seconds) and time remaining until the next prayer.
- **Ramadan & Fasting Times:** Displays daily **Sehri End Time** and **Iftar Time**.
- **Voluntary Prayers Window:** Includes **Tahajjud** optimal window and **Ishraq / Chasht** start times.
- **📿 Digital Tasbih & Dhikr Counter:**
  - Interactive tap counter with tactile click audio and haptic vibration feedback.
  - Quick target settings (33, 99, 100, or unlimited).
  - Confetti celebration upon target completion.
  - Daily dhikr accumulator.
- **🧭 Qibla Compass:**
  - Computes exact Kaaba angle (e.g., 277.6° WNW from Dhaka).
  - Visual compass dial with needle pointing to Kaaba, live mobile gyroscope sensor integration, and distance to Makkah (~5,130 km).
- **✅ Daily 5-Waqt Salah Tracker:**
  - Interactive daily checklist for Fajr, Dhuhr, Asr, Maghrib, and Isha.
  - Visual progress bar with completion percentage and encouraging Hadith quotes.
- **📖 Masnoon Duas & Post-Salah Azkar:**
  - Authentic post-salah supplications, Ayatul Kursi, Tasbih-e-Fatimi, Sehri niyat, and Iftar dua with Arabic script, transliteration, Bengali translation, and Hadith references.
  - One-click copy to clipboard.
- **🎨 Mobile-Responsive & Islamic Aesthetic UI:**
  - Dark emerald and golden accents with glassmorphism styling.
  - Bilingual interface (Bengali & English toggle).
  - Mobile bottom navigation bar for effortless one-handed use on smartphones.
  - Progressive Web App (PWA) ready (Installable on Android & iOS).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Asadul09/salah-time-reminder.git

# Navigate to the project directory
cd salah-time-reminder

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The optimized static assets will be generated in the `dist` folder, ready for deployment to GitHub Pages, Vercel, or Netlify.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (Modern Glassmorphism & Islamic Emerald Theme)
- **Icons:** Lucide React
- **Astronomical Prayer Engine:** `adhan` library (Batoul Apps)
- **Audio & Haptics:** Web Audio API (Synthesized acoustic chimes) & Navigator Vibration API
- **Celebration Effects:** Canvas Confetti

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
