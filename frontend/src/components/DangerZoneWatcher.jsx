import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import coimbatoreAreas from '../data/coimbatoreData'
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from '../utils/emailConfig'

// ~300 metres in degrees
const TRIGGER_RADIUS = 0.003

function distanceDeg(lat1, lng1, lat2, lng2) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
}

export default function DangerZoneWatcher() {
  const [status, setStatus]       = useState('idle')   // idle | watching | denied
  const [alert, setAlert]         = useState(null)      // { area, location }
  const [permission, setPermission] = useState('default')
  const alertedZones              = useRef(new Set())
  const watchIdRef                = useRef(null)

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermission)
    } else if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  function startWatching() {
    if (!navigator.geolocation) return
    setStatus('watching')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords

        // Check only danger zones (score < 60)
        const dangerZones = coimbatoreAreas.filter((a) => a.safeScore < 60)

        dangerZones.forEach((zone) => {
          const dist = distanceDeg(lat, lng, zone.lat, zone.lng)

          if (dist < TRIGGER_RADIUS && !alertedZones.current.has(zone.id)) {
            alertedZones.current.add(zone.id)

            const location = { lat, lng }
            setAlert({ area: zone, location })

            // Browser push notification
            if (Notification.permission === 'granted') {
              new Notification(`⚠️ Danger Zone: ${zone.name}`, {
                body: `Safety score ${zone.safeScore}/100. Nearest police: ${zone.police.station} (${zone.police.phone})`,
                icon: '/favicon.ico',
              })
            }

            // Send email to emergency contacts
            const sosData = JSON.parse(localStorage.getItem('crimeradar_sos') || 'null')
            if (sosData?.contacts?.length) {
              const mapsLink = `https://maps.google.com/?q=${lat},${lng}`
              const time = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

              sosData.contacts.forEach((contact) => {
                emailjs.send(
                  EMAIL_SERVICE_ID,
                  EMAIL_TEMPLATE_ID,
                  {
                    to_name:   contact.name,
                    to_email:  contact.email,
                    subject:   `⚠️ ${sosData.profile.name} entered danger zone: ${zone.name}`,
                    message:   `${sosData.profile.name} has automatically entered a flagged danger zone.\n\nArea: ${zone.name}\nSafety Score: ${zone.safeScore}/100\nTime: ${time}\n\nNearest Police: ${zone.police.station}\nPolice Phone: ${zone.police.phone}\n\nLocation: ${mapsLink}\n\nThis is an automatic alert from CrimeRadar.`,
                    maps_link: mapsLink,
                    user_name: sosData.profile.name,
                  },
                  EMAIL_PUBLIC_KEY
                ).catch(console.error)
              })
            }
          }
        })
      },
      (err) => {
        if (err.code === 1) setStatus('denied')
        else setStatus('idle')
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )
  }

  function stopWatching() {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setStatus('idle')
    alertedZones.current.clear()
  }

  return (
    <>
      {/* Floating watcher badge — shown always */}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px',
      }}>

        {/* Danger zone alert banner */}
        {alert && (
          <div style={{
            background: '#1a0000', border: '1px solid #ff3b3b',
            borderRadius: '12px', padding: '14px 18px', maxWidth: '300px',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ff3b3b' }}>
                ⚠️ Danger Zone: {alert.area.name}
              </div>
              <button onClick={() => setAlert(null)}
                style={{ background: 'none', border: 'none', color: '#555', fontSize: '16px', cursor: 'pointer', marginLeft: '8px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '10px', lineHeight: '1.6' }}>
              Safety score <span style={{ color: '#ff3b3b', fontWeight: '700' }}>{alert.area.safeScore}/100</span> · Email sent to contacts
            </div>
            {/* Nearest police */}
            <a href={`tel:${alert.area.police.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2a0000', border: '1px solid #ff3b3b33', borderRadius: '8px', padding: '8px 12px', textDecoration: 'none' }}>
              <span style={{ fontSize: '16px' }}>🚔</span>
              <div>
                <div style={{ fontSize: '11px', color: '#ff3b3b', fontWeight: '600' }}>{alert.area.police.station}</div>
                <div style={{ fontSize: '12px', color: '#ddd' }}>{alert.area.police.phone} · {alert.area.police.distance}</div>
              </div>
            </a>
          </div>
        )}

        {/* Watch toggle button */}
        <button
          onClick={status === 'watching' ? stopWatching : startWatching}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: status === 'watching' ? '#0d1f0d' : '#141414',
            border: `1px solid ${status === 'watching' ? '#22c55e' : '#2a2a2a'}`,
            borderRadius: '24px', padding: '10px 18px',
            color: status === 'watching' ? '#22c55e' : '#888',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            boxShadow: status === 'watching' ? '0 0 20px #22c55e22' : 'none',
            transition: 'all 0.3s',
          }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: status === 'watching' ? '#22c55e' : '#555',
            animation: status === 'watching' ? 'pulse 1.5s infinite' : 'none',
          }} />
          {status === 'watching' ? 'Monitoring Active' : status === 'denied' ? 'Location Denied' : 'Start Monitoring'}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}