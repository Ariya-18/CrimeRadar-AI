import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
    camera: false,
  })
  const [locationMode, setLocationMode] = useState('ask')
  const [saved, setSaved] = useState(false)
  const [locationStatus, setLocationStatus] = useState('unknown')

  useEffect(function () {
    const saved = localStorage.getItem('crimeradar_settings')
    if (saved) {
      const data = JSON.parse(saved)
      setPermissions(data.permissions || permissions)
      setLocationMode(data.locationMode || 'ask')
    }
    checkLocationPermission()
  }, [])

  async function checkLocationPermission() {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' })
        setLocationStatus(result.state)
        if (result.state === 'granted') {
          setPermissions(function (prev) { return { ...prev, location: true } })
        }
      } catch (e) {
        setLocationStatus('unknown')
      }
    }
  }

  function requestLocation() {
    navigator.geolocation.getCurrentPosition(
      function () {
        setLocationStatus('granted')
        setPermissions(function (prev) { return { ...prev, location: true } })
      },
      function () {
        setLocationStatus('denied')
        setPermissions(function (prev) { return { ...prev, location: false } })
      }
    )
  }

  async function requestNotifications() {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermissions(function (prev) { return { ...prev, notifications: result === 'granted' } })
    }
  }

  function saveSettings() {
    localStorage.setItem('crimeradar_settings', JSON.stringify({
      permissions,
      locationMode,
    }))
    setSaved(true)
    setTimeout(function () { setSaved(false) }, 2000)
  }

  const Toggle = function ({ value, onChange }) {
    return (
      <div
        onClick={onChange}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: value ? '#ff3b3b' : '#2a2a2a',
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '3px',
          left: value ? '23px' : '3px',
          transition: 'left 0.2s',
        }}></div>
      </div>
    )
  }

  const Section = function ({ title, children }) {
    return (
      <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '20px 24px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px', fontWeight: '600' }}>{title}</div>
        {children}
      </div>
    )
  }

  const PermRow = function ({ icon, title, desc, status, onRequest, granted }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #141414' }}>
        <div style={{ width: '40px', height: '40px', background: '#141414', border: '1px solid #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: '#ddd', fontWeight: '600', marginBottom: '3px' }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>{desc}</div>
        </div>
        {granted ? (
          <span style={{ fontSize: '11px', background: '#0d1f0d', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', flexShrink: 0 }}>✓ Allowed</span>
        ) : (
          <button
            onClick={onRequest}
            style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}
          >
            Allow
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={function () { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#fff', letterSpacing: '1px' }}>⚙️ Settings</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Manage permissions and preferences</div>
          </div>
        </div>
        <button
          onClick={saveSettings}
          style={{ background: saved ? '#0d1f0d' : '#ff3b3b', color: saved ? '#4ade80' : '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '720px', margin: '0 auto' }}>

        <Section title="App Permissions">
          <PermRow
            icon="📍"
            title="Live Location"
            desc="Required for live tracking, SOS alerts and safe route planning. Your location is never stored on our servers."
            granted={permissions.location}
            onRequest={requestLocation}
          />
          <PermRow
            icon="🔔"
            title="Push Notifications"
            desc="Get instant alerts when crime is reported near your saved areas or when you enter a danger zone."
            granted={permissions.notifications}
            onRequest={requestNotifications}
          />
          <PermRow
            icon="📷"
            title="Camera Access"
            desc="Required to capture and upload photos when reporting a crime incident anonymously."
            granted={permissions.camera}
            onRequest={function () { setPermissions(function (p) { return { ...p, camera: true } }) }}
          />
        </Section>

        <Section title="Location Tracking Mode">
          {[
            { val: 'always', label: 'Always Track', desc: 'Track in background — best for SOS auto-trigger', icon: '🔴' },
            { val: 'whileUsing', label: 'While Using App', desc: 'Track only when app is open', icon: '🟡' },
            { val: 'ask', label: 'Ask Every Time', desc: 'Ask permission each time location is needed', icon: '🟢' },
          ].map(function (opt) {
            return (
              <div
                key={opt.val}
                onClick={function () { setLocationMode(opt.val) }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '10px', border: '1px solid ' + (locationMode === opt.val ? '#ff3b3b' : '#1a1a1a'), background: locationMode === opt.val ? '#1a0d0d' : '#141414', cursor: 'pointer', marginBottom: '8px' }}
              >
                <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '2px' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{opt.desc}</div>
                </div>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid ' + (locationMode === opt.val ? '#ff3b3b' : '#333'), background: locationMode === opt.val ? '#ff3b3b' : 'transparent', flexShrink: 0 }}></div>
              </div>
            )
          })}
        </Section>

        <Section title="SOS Quick Settings">
          {[
            { key: 'sosVibrate', label: 'Vibrate on SOS Trigger', desc: 'Phone vibrates when SOS is activated', icon: '📳' },
            { key: 'sosSound', label: 'Play Alert Sound', desc: 'Loud alarm when entering danger zone', icon: '🔊' },
            { key: 'shareLocation', label: 'Share Live Location in SOS', desc: 'Include GPS coordinates in alert messages', icon: '🗺️' },
          ].map(function (item) {
            return (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #141414' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{item.desc}</div>
                </div>
                <Toggle
                  value={permissions[item.key] || false}
                  onChange={function () { setPermissions(function (p) { return { ...p, [item.key]: !p[item.key] } }) }}
                />
              </div>
            )
          })}
        </Section>

        <Section title="Data & Privacy">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={function () { localStorage.removeItem('crimeradar_sos'); alert('SOS data cleared') }}
              style={{ background: '#141414', color: '#f59e0b', border: '1px solid #f59e0b33', padding: '11px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', fontWeight: '600' }}
            >
              🗑️ Clear SOS Profile & Contacts
            </button>
            <button
              onClick={function () { localStorage.clear(); alert('All data cleared') }}
              style={{ background: '#141414', color: '#ff3b3b', border: '1px solid #ff3b3b33', padding: '11px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', fontWeight: '600' }}
            >
              ⚠️ Clear All App Data
            </button>
          </div>
        </Section>

      </div>
    </div>
  )
}