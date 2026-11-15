export const BANGLADESH_DIVISIONS = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    coordinates: { latitude: 23.8103, longitude: 90.4125 },
    isDefault: true,
    description: 'রাজধানী ও কেন্দ্রীয় সময় মানদণ্ড (Central Standard)',
    diffDhakaMinutes: 0
  },
  {
    id: 'chittagong',
    name: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    coordinates: { latitude: 22.3569, longitude: 91.7832 },
    isDefault: false,
    description: 'পূর্বাঞ্চলীয় বন্দর নগরী (পূর্বাঞ্চলীয় সময়)',
    diffDhakaMinutes: -5
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameBn: 'সিলেট',
    coordinates: { latitude: 24.8949, longitude: 91.8687 },
    isDefault: false,
    description: 'উত্তর-পূর্বাঞ্চল ও চায়ের দেশ',
    diffDhakaMinutes: -6
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    coordinates: { latitude: 24.3636, longitude: 88.6241 },
    isDefault: false,
    description: 'পশ্চিমাঞ্চল ও সিল্ক সিটি',
    diffDhakaMinutes: +7
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameBn: 'খুলনা',
    coordinates: { latitude: 22.8456, longitude: 89.5403 },
    isDefault: false,
    description: 'দক্ষিণ-পশ্চিমাঞ্চল ও সুন্দরবন উপকূল',
    diffDhakaMinutes: +4
  },
  {
    id: 'barishal',
    name: 'Barishal',
    nameBn: 'বরিশাল',
    coordinates: { latitude: 22.7010, longitude: 90.3535 },
    isDefault: false,
    description: 'দক্ষিণাঞ্চল ও নদীমাতৃক অঞ্চল',
    diffDhakaMinutes: +1
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    nameBn: 'রংপুর',
    coordinates: { latitude: 25.7439, longitude: 89.2752 },
    isDefault: false,
    description: 'উত্তরাঞ্চল ও তিস্তা অববাহিকা',
    diffDhakaMinutes: +5
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    coordinates: { latitude: 24.7471, longitude: 90.4203 },
    isDefault: false,
    description: 'ব্রহ্মপুত্র নদ তীরবর্তী প্রাচীন শিক্ষানগরী',
    diffDhakaMinutes: 0
  }
];

export const DEFAULT_DIVISION = BANGLADESH_DIVISIONS[0]; // Dhaka
