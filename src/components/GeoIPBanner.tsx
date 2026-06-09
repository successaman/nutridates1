'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Timezone → Indian city/state mapping ── */
const TIMEZONE_CITY_MAP: Record<string, { city: string; state: string }> = {
  'Asia/Kolkata': { city: 'Ranchi', state: 'Jharkhand' },
};

/* ── Major Indian cities for random social-proof rotation ── */
const INDIAN_CITIES = [
  { city: 'Hazaribagh', state: 'Jharkhand' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Jamshedpur', state: 'Jharkhand' },
  { city: 'Dhanbad', state: 'Jharkhand' },
  { city: 'Bokaro', state: 'Jharkhand' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Delhi', state: 'NCR' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Chandigarh', state: 'Punjab' },
];

function getRandomBuyerCount() {
  return Math.floor(Math.random() * 30) + 12;
}

function getRandomCity() {
  return INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
}

export default function GeoIPBanner() {
  const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null);
  const [socialProof, setSocialProof] = useState<{ city: string; count: number } | null>(null);
  const [showProof, setShowProof] = useState(false);

  useEffect(() => {
    // Detect city from timezone (instant, no network call)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const mapped = TIMEZONE_CITY_MAP[tz];

    // Try ipapi.co for more accurate city detection (free tier)
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data?.city && data?.region) {
          setUserLocation({ city: data.city, state: data.region });
        } else if (mapped) {
          setUserLocation(mapped);
        } else {
          setUserLocation({ city: 'your city', state: 'India' });
        }
      })
      .catch(() => {
        setUserLocation(mapped || { city: 'your city', state: 'India' });
      });
  }, []);

  // Rotating social proof ticker
  useEffect(() => {
    const tick = () => {
      const c = getRandomCity();
      setSocialProof({ city: c.city, count: getRandomBuyerCount() });
      setShowProof(true);
      setTimeout(() => setShowProof(false), 4000);
    };

    tick();
    const interval = setInterval(tick, 7000);
    return () => clearInterval(interval);
  }, []);

  if (!userLocation) return null;

  return (
    <div className="w-full bg-[#111111] text-white overflow-hidden border-b border-[#2a2a2a]">
      {/* Main geo banner */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 text-xs sm:text-sm font-bold tracking-wide">
        <span className="inline-block h-2 w-2 rounded-full bg-[#FF5000] animate-pulse flex-shrink-0" />
        <span>
          Now delivering to{' '}
          <span className="text-[#FF5000] font-black">{userLocation.city}, {userLocation.state}</span>
          {' '}&mdash; Express shipping across India
        </span>
      </div>

      {/* Social proof ticker */}
      <AnimatePresence>
        {showProof && socialProof && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1a1a1a] overflow-hidden"
          >
            <p className="text-center text-[10px] sm:text-xs font-semibold text-stone-400 py-1.5 px-4">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {socialProof.count} people in {socialProof.city} ordered this week
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
