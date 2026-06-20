import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'

export default function SOSTrigger() {
  const navigate = useNavigate()
  const [sosData, setSosData] = useState(null)
  const [selectedArea, setSelectedArea] = useState('')
  const [alertSent, setAlertSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [currentArea, setCurrentArea] = useState(null)

  useEffect(function() {
    const saved = localStorage.getItem('crimeradar_sos')
    if (saved) {
      setSosData(JSON.parse(saved))
    }
  }, [])

  function handleAreaSelect(e) {
    const area = coimbatoreAreas.find(function(a) { return a.name === e.target.value })
    setSelectedArea(e.target.value)
    setCurrentArea(area)
  }

  function simulateSOS() {
    if (!currentArea) { alert('Select an area first'); return }
    if (!sosData) { alert('Please setup SOS first'); navigate('/sos'); return }
    setSending(true)
    setTimeout(function() {
      setSending(false)
      setAlertSent(true)
    }, 2500)
  }

  const scoreColor = function(score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={function() { navigate('/') }}
          style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ff3b3b', letterSpacing: '2px' }}>🆘 SOS Trigger Simulator</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Simulate entering a danger zone — alerts sent to your emergency contacts</div>
        </div>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {!sosData && (
            <div style={{ background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <div style={{ fontSize: '13px', color: '#ff3b3b', fontWeight: '600', marginBottom: '4px' }}>SOS Not Setup</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Please setup your SOS profile and emergency contacts first.</div>
              </div>
              <button
                onClick={function() { navigate('/sos') }}
                style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}
              >
                Setup
              </button>
            </div>
          )}

          {sosData && (
            <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>SOS Profile Active</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#2a0d0d', border: '2px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{sosData.profile.name}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{sosData.profile.email}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }}>
                {sosData.contacts.length} emergency contact{sosData.contacts.length > 1 ? 's' : ''} •  Trigger below score <span style={{ color: '#ff3b3b', fontWeight: '700' }}>{sosData.triggerScore}</span>
              </div>
            </div>
          )}

          {/* Area Select */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Simulate Entering Area</div>
            <select
              value={selectedArea}
              onChange={handleAreaSelect}
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: selectedArea ? '#ddd' : '#555', fontSize: '13px', outline: 'none', marginBottom: '14px' }}
            >
              <option value="">-- Select Area --</option>
              {coimbatoreAreas.map(function(a) {
                return (
                  <option key={a.id} value={a.name}>{a.name} — Score {a.safeScore}</option>
                )
              })}
            </select>

            {currentArea && (
              <div style={{ background: '#141414', border: '1px solid ' + scoreColor(currentArea.safeScore) + '44', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#ddd', fontWeight: '600' }}>{currentArea.name}</span>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: scoreColor(currentArea.safeScore) }}>{currentArea.safeScore}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>⚠️ Avoid Time: <span style={{ color: '#ff3b3b' }}>{currentArea.unsafeTime}</span></div>
                <div style={{ fontSize: '12px', color: '#555' }}>Recent crimes: {currentArea.recentCrimes.length} reported</div>

                {sosData && currentArea.safeScore < sosData.triggerScore && (
                  <div style={{ marginTop: '10px', background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#ff3b3b', fontWeight: '600', textAlign: 'center' }}>
                    🆘 This area will trigger SOS Alert!
                  </div>
                )}
                {sosData && currentArea.safeScore >= sosData.triggerScore && (
                  <div style={{ marginTop: '10px', background: '#0d1f0d', border: '1px solid #4ade8044', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#4ade80', fontWeight: '600', textAlign: 'center' }}>
                    ✅ This area is safe — No SOS needed
                  </div>
                )}
              </div>
            )}

            <button
              onClick={simulateSOS}
              disabled={sending || !currentArea}
              style={{ width: '100%', background: sending ? '#8a2020' : '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: currentArea ? 'pointer' : 'not-allowed', opacity: !currentArea ? 0.5 : 1 }}
            >
              {sending ? '📡 Sending SOS Alerts...' : '🆘 Trigger SOS Now'}
            </button>
          </div>
        </div>

        {/* Right — Alert Log */}
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Alert Status</div>

          {!alertSent && !sending && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
              <div style={{ fontSize: '14px', color: '#555' }}>Select an area and trigger SOS to see alert status</div>
            </div>
          )}

          {sending && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ff3b3b', marginBottom: '8px', letterSpacing: '1px' }}>Sending Alerts...</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>Notifying emergency contacts</div>
              {sosData && sosData.contacts.map(function(c, i) {
                return (
                  <div key={i} style={{ background: '#141414', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#ff3b3b', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '13px', color: '#888' }}>Alerting {c.name}...</span>
                  </div>
                )
              })}
            </div>
          )}

          {alertSent && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#4ade80', letterSpacing: '1px' }}>Alerts Sent!</div>
              </div>

              {sosData && sosData.contacts.map(function(c, i) {
                return (
                  <div key={i} style={{ background: '#141414', border: '1px solid #0d2e0d', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{c.name}</div>
                      <span style={{ fontSize: '10px', background: '#0d1f0d', color: '#4ade80', padding: '2px 10px', borderRadius: '20px', fontWeight: '700' }}>✓ SENT</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>📧 {c.email}</div>
                    {c.phone && <div style={{ fontSize: '12px', color: '#555' }}>📱 {c.phone}</div>}
                    <div style={{ marginTop: '8px', background: '#0b0b0b', borderRadius: '6px', padding: '10px', borderLeft: '3px solid #ff3b3b' }}>
                      <div style={{ fontSize: '11px', color: '#ff3b3b', fontWeight: '700', marginBottom: '4px' }}>🆘 SOS Alert Sent</div>
                      <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                        {sosData.profile.name} entered <strong style={{ color: '#ddd' }}>{currentArea && currentArea.name}</strong> — Score: <strong style={{ color: '#ff3b3b' }}>{currentArea && currentArea.safeScore}</strong>. Please check on them immediately.
                      </div>
                    </div>
                  </div>
                )
              })}

              <button
                onClick={function() { setAlertSent(false); setSelectedArea(''); setCurrentArea(null) }}
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