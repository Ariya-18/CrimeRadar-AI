import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Circle, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas from '../data/coimbatoreData'
import { triggerAlert } from '../utils/alertService'

const USER_NAME = 'Your Name' // ← match SafetyPanel

// How close (degrees) before we fire an alert — ~300m
const DANGER_RADIUS_DEG = 0.003

function FlyToArea({ area }) {
  const map = useMap()
  useEffect(() => {
    if (area) map.flyTo([area.lat, area.lng], 14, { duration: 1.5 })
  }, [area, map])
  return null
}

// Euclidean distance in degrees (good enough for ~city scale)
function distanceDeg(lat1, lng1, lat2, lng2) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
}

export default function HeatMap({ selectedId }) {
  const selectedArea    = coimbatoreAreas.find((a) => a.id === selectedId)
  const alertedZones    = useRef(new Set())        // zones already alerted this session
  const insideZones     = useRef(new Set())        // zones currently inside (for exit detection)
  const watchIdRef      = useRef(null)
  const [activeAlert, setActiveAlert] = useState(null)  // { name, score } | null

  // ── COLOR HELPERS ──────────────────────────────────────────────────────────
  function getColor(score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }
  function getFillOpacity(score) {
    if (score >= 80) return 0.25
    if (score >= 60) return 0.35
    return 0.45
  }
  function getRadius(score) {
    if (score >= 80) return 700
    if (score >= 60) return 850
    return 1000
  }

  // ── DANGER ZONE WATCHER ────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords

        // Check every area with score < 60 (danger zones only)
        const dangerZones = coimbatoreAreas.filter((a) => a.safeScore < 60)

        dangerZones.forEach((zone) => {
          const dist = distanceDeg(lat, lng, zone.lat, zone.lng)
          const isNearby = dist < DANGER_RADIUS_DEG

          if (isNearby) {
            insideZones.current.add(zone.id)

            // Only alert once per zone per session
            if (!alertedZones.current.has(zone.id)) {
              alertedZones.current.add(zone.id)

              // Show in-page banner
              setActiveAlert({ name: zone.name, score: zone.safeScore })
              setTimeout(() => setActiveAlert(null), 12000)

              // Browser notification
              if (Notification.permission === 'granted') {
                new Notification(`⚠️ Danger Zone: ${zone.name}`, {
                  body: `Safety score: ${zone.safeScore}/100. Your emergency contacts are being notified.`,
                  icon: '/favicon.ico',
                })
              }

              // Email + SMS
              triggerAlert({
                type: 'danger-zone',
                location: { lat, lng },
                userName: USER_NAME,
                zoneName: zone.name,
              })
            }
          } else {
            // They left the zone — allow re-alerting if they re-enter (optional)
            if (insideZones.current.has(zone.id)) {
              insideZones.current.delete(zone.id)
              // To re-alert on re-entry, also delete from alertedZones:
              // alertedZones.current.delete(zone.id)
            }
          }
        })
      },
      (err) => console.warn('Geolocation error:', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Danger zone entry banner ──────────────────────────────────── */}
      {activeAlert && (
        <div style={{
          background: '#2d0000', border: '1px solid #ff3b3b',
          borderRadius: '10px', padding: '14px 20px',
          marginBottom: '14px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          animation: 'slideIn 0.3s ease',
        }}>
          <div>
            <div style={{ color: '#ff3b3b', fontWeight: '700', fontSize: '14px' }}>
              ⚠️ Danger Zone Detected: {activeAlert.name}
            </div>
            <div style={{ color: '#ff3b3b99', fontSize: '12px', marginTop: '3px' }}>
              Safety score {activeAlert.score}/100 · Email & SMS sent to your contacts
            </div>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            style={{ background: 'none', border: 'none', color: '#ff3b3b88', fontSize: '18px', cursor: 'pointer' }}
          >×</button>
        </div>
      )}

      {/* ── Legend ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {[
          { color: '#4ade80', label: 'Safe (80+)' },
          { color: '#f59e0b', label: 'Caution (60–79)' },
          { color: '#ff3b3b', label: 'Alert (<60)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '11px', color: '#555' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a', height: '420px' }}>
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {selectedArea && <FlyToArea area={selectedArea} />}

          {coimbatoreAreas.map((area) => {
            const color      = getColor(area.safeScore)
            const isSelected = area.id === selectedId

            return (
              <Circle
                key={area.id}
                center={[area.lat, area.lng]}
                radius={isSelected ? getRadius(area.safeScore) * 1.4 : getRadius(area.safeScore)}
                pathOptions={{
                  color,
                  fillColor:   color,
                  fillOpacity: isSelected ? 0.6 : getFillOpacity(area.safeScore),
                  weight:      isSelected ? 3 : 1,
                  opacity:     isSelected ? 1 : 0.7,
                }}
              >
                <Tooltip permanent={isSelected} direction="top" offset={[0, -10]}>
                  <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '12px' }}>
                    {area.name}<br />
                    <span style={{ color }}>Score: {area.safeScore}</span>
                    {area.safeScore < 60 && (
                      <><br /><span style={{ color: '#ff3b3b', fontSize: '10px' }}>⚠️ Danger Zone</span></>
                    )}
                  </div>
                </Tooltip>
              </Circle>
            )
          })}
        </MapContainer>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}