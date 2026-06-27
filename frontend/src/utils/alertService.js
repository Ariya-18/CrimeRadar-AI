import emailjs from '@emailjs/browser';

// ─── CONFIGURE THESE ──────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // from emailjs.com
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // from emailjs.com
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // from emailjs.com → Account

// Your emergency contacts
export const EMERGENCY_CONTACTS = [
  { name: 'Mom',    email: 'mom@example.com',    phone: '9XXXXXXXXX' },
  { name: 'Friend', email: 'friend@example.com', phone: '9XXXXXXXXX' },
];

// ─── GET CURRENT GPS LOCATION ─────────────────────────────────────────────────
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: null, lng: null })
    );
  });
}

// ─── BUILD MAPS LINK ──────────────────────────────────────────────────────────
function mapsLink(location) {
  if (!location?.lat) return 'Location unavailable';
  return `https://maps.google.com/?q=${location.lat},${location.lng}`;
}

// ─── SEND EMAIL VIA EMAILJS ───────────────────────────────────────────────────
export async function sendEmailAlert({ type, location, userName = 'CrimeRadar User', zoneName = '' }) {
  const isSOS = type === 'sos';

  const subject = isSOS
    ? `🚨 SOS EMERGENCY — ${userName} needs help NOW`
    : `⚠️ Danger Zone Alert — ${userName} entered ${zoneName}`;

  const message = isSOS
    ? `EMERGENCY SOS TRIGGERED\n\n${userName} has pressed the SOS button and needs immediate help.\n\nLast known location:\n${mapsLink(location)}\n\nPlease call them immediately or contact local emergency services (112).`
    : `DANGER ZONE ALERT\n\n${userName} has entered a flagged danger zone${zoneName ? `: ${zoneName}` : ''}.\n\nCurrent location:\n${mapsLink(location)}\n\nThis is an automated alert from CrimeRadar.`;

  const sends = EMERGENCY_CONTACTS.map((contact) =>
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name:   contact.name,
        to_email:  contact.email,
        from_name: 'CrimeRadar Alert',
        subject,
        message,
        maps_link: mapsLink(location),
        user_name: userName,
      },
      EMAILJS_PUBLIC_KEY
    )
  );

  return Promise.allSettled(sends);
}

// ─── SEND SMS VIA FAST2SMS (India) ────────────────────────────────────────────
// This calls your own Vite proxy to avoid CORS — see vite.config.js setup below
export async function sendSMSAlert({ type, location, userName = 'CrimeRadar User', zoneName = '' }) {
  const isSOS = type === 'sos';

  const text = isSOS
    ? `🚨 SOS! ${userName} needs help NOW. Location: ${mapsLink(location)} — from CrimeRadar`
    : `⚠️ ${userName} entered danger zone${zoneName ? ` (${zoneName})` : ''}. Location: ${mapsLink(location)} — CrimeRadar`;

  const phones = EMERGENCY_CONTACTS.map((c) => c.phone).join(',');

  try {
    const res = await fetch('/api/sms', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ phones, message: text }),
    });
    return res.json();
  } catch (err) {
    console.error('SMS failed:', err);
    return { error: err.message };
  }
}

// ─── MASTER TRIGGER (email + SMS together) ────────────────────────────────────
export async function triggerAlert({ type, location, userName, zoneName }) {
  // Always get fresh location if not passed
  const loc = location ?? await getCurrentLocation();

  const [emailResult, smsResult] = await Promise.allSettled([
    sendEmailAlert({ type, location: loc, userName, zoneName }),
    sendSMSAlert({ type, location: loc, userName, zoneName }),
  ]);

  console.log('[CrimeRadar] Alert sent:', { emailResult, smsResult });
  return { emailResult, smsResult, location: loc };
}