import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import coimbatoreAreas from '../data/coimbatoreData'
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from '../utils/emailConfig'

export default function SOSTrigger() {
  const navigate = useNavigate()
  const [sosData, setSosData]         = useState(null)
  const [selectedArea, setSelectedArea] = useState('')
  const [alertSent, setAlertSent]     = useState(false)
  const [sending, setSending]         = useState(false)
  const [currentArea, setCurrentArea] = useState(null)
  const [errorMsg, setErrorMsg]       = useState('')

  useEffect(function () {
    const saved = localStorage.getItem('crimeradar_sos')
    if (saved) setSosData(JSON.parse(saved))
  }, [])

  function handleAreaSelect(e) {
    const area = coimbatoreAreas.find(function (a) { return a.name === e.target.value })
    setSelectedArea(e.target.value)
    setCurrentArea(area)
    setAlertSent(false)
    setErrorMsg('')
  }

  async function simulateSOS() {
    if (!currentArea) { alert('Select an area first'); return }
    if (!sosData)     { alert('Please setup SOS first'); navigate('/sos'); return }

    setSending(true)
    setErrorMsg('')

    // Try to get real GPS; fall back to area coordinates
    let location = { lat: currentArea.lat, lng: currentArea.lng }
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
      )
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    } catch { /* use area coords */ }

    const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`
    const time     = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

    // Send one email per emergency contact
    const results = await Promise.allSettled(
      sosData.contacts.map(function (contact) {
        return emailjs.send(
          EMAIL_SERVICE_ID,
          EMAIL_TEMPLATE_ID,
          {
            to_name:   contact.name,
            to_email:  contact.email,
            subject:   `🆘 SOS — ${sosData.profile.name} entered ${currentArea.name}`,
            message:   `${sosData.profile.name} has entered a danger zone and needs you to check on them.\n\nArea: ${currentArea.name}\nSafety Score: ${currentArea.safeScore} / 100\nTime: ${time}\n\nGoogle Maps: ${mapsLink}\n\nPlease call or reach them immediately.`,
            maps_link: mapsLink,
            user_name: sosData.profile.name,
          },
          EMAIL_PUBLIC_KEY
        )
      })
    )

    const anyFailed = results.some(function (r) { return r.status === 'rejected' })
    if (anyFailed) {
      setErrorMsg('Some emails failed. Check your EmailJS keys in emailConfig.js')
    }

    setSending(false)
    setAlertSent(true)
  }

  const scoreColor = function (score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={function () { navigate('/') }}
          style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ff3b3b', letterSpacing: '2px' }}>🆘 SOS Alert System</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Sends real emails to your emergency contacts</div>
        </div>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* SOS not set up warning */}
          {!sosData && (
            <div style={{ background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <div style={{ fontSize: '13px', color: '#ff3b3b', fontWeight: '600', marginBottom: '4px' }}>SOS Not Setup</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Please setup your SOS profile and emergency contacts first.</div>
              </div>
              <button
                onClick={function () { navigate('/sos') }}
                style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}
              >
                Setup
              </button>
            </div>
          )}

          {/* Profile card */}
          {sosData && (
            <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>SOS Profile Active</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#2a0d0d', border: '2px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{sosData.profile.name}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{sosData.profile.email}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }}>
                {sosData.contacts.length} emergency contact{sosData.contacts.length > 1 ? 's' : ''} · Trigger below score <span style={{ color: '#ff3b3b', fontWeight: '700' }}>{sosData.triggerScore}</span>
              </div>
            </div>
          )}

          {/* Area selector */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Select Area</div>
            <select
              value={selectedArea}
              onChange={handleAreaSelect}
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: selectedArea ? '#ddd' : '#555', fontSize: '13px', outline: 'none', marginBottom: '14px' }}
            >
              <option value="">-- Select Area --</option>
              {coimbatoreAreas.map(function (a) {
                return <option key={a.id} value={a.name}>{a.name} — Score {a.safeScore}</option>
              })}
            </select>

            {/* Area info card */}
            {currentArea && (
              <div style={{ background: '#141414', border: `1px solid ${scoreColor(currentArea.safeScore)}44`, borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#ddd', fontWeight: '600' }}>{currentArea.name}</span>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: scoreColor(currentArea.safeScore) }}>{currentArea.safeScore}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>
                  ⚠️ Avoid Time: <span style={{ color: '#ff3b3b' }}>{currentArea.unsafeTime}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#555' }}>
                  Recent crimes: {currentArea.recentCrimes?.length ?? 0} reported
                </div>

                {/* Will this trigger SOS? */}
                {sosData && currentArea.safeScore < sosData.triggerScore && (
                  <div style={{ marginTop: '10px', background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#ff3b3b', fontWeight: '600', textAlign: 'center' }}>
                    🆘 This area WILL trigger SOS Alert!
                  </div>
                )}
                {sosData && currentArea.safeScore >= sosData.triggerScore && (
                  <div style={{ marginTop: '10px', background: '#0d1f0d', border: '1px solid #4ade8044', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#4ade80', fontWeight: '600', textAlign: 'center' }}>
                    ✅ This area is safe — No SOS needed
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <div style={{ background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '12px', color: '#ff3b3b' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* SOS trigger button */}
            <button
              onClick={simulateSOS}
              disabled={sending || !currentArea || !sosData}
              style={{
                width: '100%',
                background: sending ? '#8a2020' : '#ff3b3b',
                color: '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: currentArea && sosData ? 'pointer' : 'not-allowed',
                opacity: !currentArea || !sosData ? 0.5 : 1,
                transition: 'background 0.2s',
              }}
            >
              {sending ? '📡 Sending Real Emails...' : '🆘 Send SOS Alert Now'}
            </button>
          </div>
        </div>

        {/* Right column — alert log */}
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Alert Status</div>

          {/* Idle state */}
          {!alertSent && !sending && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
              <div style={{ fontSize: '14px', color: '#555' }}>Select an area and press SOS to send real email alerts</div>
            </div>
          )}

          {/* Sending state */}
          {sending && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ff3b3b', marginBottom: '8px', letterSpacing: '1px' }}>Sending Emails...</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>Contacting your emergency contacts</div>
              {sosData && sosData.contacts.map(function (c, i) {
                return (
                  <div key={i} style={{ background: '#141414', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#ff3b3b', borderRadius: '50%' }} />
                    <span style={{ fontSize: '13px', color: '#888' }}>Emailing {c.name} at {c.email}...</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sent state */}
          {alertSent && !sending && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{errorMsg ? '⚠️' : '✅'}</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: errorMsg ? '#f59e0b' : '#4ade80', letterSpacing: '1px' }}>
                  {errorMsg ? 'Partially Sent' : 'Emails Sent!'}
                </div>
              </div>

              {sosData && sosData.contacts.map(function (c, i) {
                return (
                  <div key={i} style={{ background: '#141414', border: '1px solid #0d2e0d', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{c.name}</div>
                      <span style={{ fontSize: '10px', background: '#0d1f0d', color: '#4ade80', padding: '2px 10px', borderRadius: '20px', fontWeight: '700' }}>✓ EMAILED</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>📧 {c.email}</div>
                    {c.phone && <div style={{ fontSize: '12px', color: '#555' }}>📱 {c.phone}</div>}
                    <div style={{ marginTop: '8px', background: '#0b0b0b', borderRadius: '6px', padding: '10px', borderLeft: '3px solid #ff3b3b' }}>
                      <div style={{ fontSize: '11px', color: '#ff3b3b', fontWeight: '700', marginBottom: '4px' }}>🆘 Email Sent</div>
                      <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                        {sosData.profile.name} entered <strong style={{ color: '#ddd' }}>{currentArea?.name}</strong> — Score: <strong style={{ color: '#ff3b3b' }}>{currentArea?.safeScore}</strong>. Please check on them immediately.
                      </div>
                    </div>
                  </div>
                )
              })}

              <button
                onClick={function () { setAlertSent(false); setSelectedArea(''); setCurrentArea(null); setErrorMsg('') }}
                style={{ width: '100%', marginTop: '10px', background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '11px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}