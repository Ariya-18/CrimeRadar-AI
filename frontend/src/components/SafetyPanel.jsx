import { useState, useEffect, useRef } from 'react'
import { triggerAlert, EMERGENCY_CONTACTS } from '../utils/alertService'

const USER_NAME = 'Your Name' // ← replace with auth user later

const areas = [
  { name: 'RS Puram',     score: 94, status: 'Safe',  color: '#4ade80', bg: '#0d1f0d' },
  { name: 'Gandhipuram',  score: 71, status: 'Watch', color: '#f59e0b', bg: '#1f1500' },
  { name: 'Ukkadam',      score: 54, status: 'Alert', color: '#ff3b3b', bg: '#2a0d0d' },
  { name: 'Peelamedu',    score: 88, status: 'Safe',  color: '#4ade80', bg: '#0d1f0d' },
]

export default function SafetyPanel() {
  // SOS state: idle | confirm | sending | sent | error
  const [sosState, setSosState]   = useState('idle')
  const [countdown, setCountdown] = useState(5)
  const [sentCount, setSentCount] = useState(0)
  const timerRef                  = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  function startSOS() {
    setSosState('confirm')
    setCountdown(5)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          fireSOS()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function cancelSOS() {
    clearInterval(timerRef.current)
    setSosState('idle')
    setCountdown(5)
  }

  async function fireSOS() {
    setSosState('sending')
    try {
      await triggerAlert({ type: 'sos', userName: USER_NAME })
      setSentCount(EMERGENCY_CONTACTS.length)
      setSosState('sent')
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SOS Sent', {
          body: `Emergency alert sent to ${EMERGENCY_CONTACTS.length} contacts.`,
        })
      }
      setTimeout(() => setSosState('idle'), 8000)
    } catch {
      setSosState('error')
      setTimeout(() => setSosState('idle'), 4000)
    }
  }

  const sosCfg = {
    idle:    { bg: '#ff3b3b', border: '#ff3b3b44', label: '🆘 SOS',                sub: `Alerts ${EMERGENCY_CONTACTS.length} contacts instantly` },
    confirm: { bg: '#cc4400', border: '#ff660044', label: `CANCEL  (${countdown}s)`, sub: 'Tap to cancel · sending automatically…' },
    sending: { bg: '#222',    border: '#33333344',  label: '📡 Sending...',          sub: 'Notifying your contacts…' },
    sent:    { bg: '#166534', border: '#22c55e44',  label: '✅ Sent!',               sub: `${sentCount} contacts notified via email + SMS` },
    error:   { bg: '#7f1d1d', border: '#ff3b3b44',  label: '❌ Failed',             sub: 'Check connection & try again' },
  }
  const cfg        = sosCfg[sosState]
  const isDisabled = sosState === 'sending' || sosState === 'sent'

  return (
    <div style={{ width: '260px' }}>

      {/* City Safety Score — unchanged */}
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', padding: '24px', marginBottom: '12px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '72px', color: '#fff', lineHeight: 1 }}>
          8<span style={{ color: '#ff3b3b' }}>9</span>
        </div>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>
          City Safety Score
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '4px', margin: '14px 0 6px' }}>
          <div style={{ width: '89%', height: '4px', background: '#ff3b3b', borderRadius: '4px' }} />
        </div>
        <div style={{ fontSize: '12px', color: '#ff3b3b', fontWeight: '600' }}>No active alerts nearby</div>
      </div>

      {/* Area Index — unchanged */}
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #1e1e1e', fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>
          Area Index — Live
        </div>
        {areas.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', borderBottom: i < areas.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
            <span style={{ fontSize: '13px', color: '#aaa' }}>{a.name}</span>
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: a.bg, color: a.color }}>
              {a.status} {a.score}
            </span>
          </div>
        ))}
      </div>

      {/* SOS card — new */}
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', padding: '16px' }}>

        {/* Contact pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {EMERGENCY_CONTACTS.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '3px 10px', fontSize: '10px', color: '#555' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
              {c.name}
            </div>
          ))}
        </div>

        {/* SOS button */}
        <button
          onClick={sosState === 'idle' ? startSOS : sosState === 'confirm' ? cancelSOS : undefined}
          disabled={isDisabled}
          style={{
            width: '100%',
            padding: '14px 0',
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: '10px',
            color: '#fff',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '20px',
            letterSpacing: '3px',
            cursor: isDisabled ? 'default' : 'pointer',
            transition: 'background 0.25s, border 0.25s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Countdown drain bar */}
          {sosState === 'confirm' && (
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${(countdown / 5) * 100}%`,
              background: '#ffffff15',
              transition: 'width 1s linear',
              pointerEvents: 'none',
            }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{cfg.label}</span>
        </button>

        {/* Sub-text */}
        <div style={{
          fontSize: '10px',
          color: sosState === 'sent' ? '#22c55e' : sosState === 'error' ? '#ff3b3b' : '#2a2a2a',
          textAlign: 'center',
          marginTop: '8px',
          letterSpacing: '0.3px',
          transition: 'color 0.3s',
        }}>
          {cfg.sub}
        </div>
      </div>
    </div>
  )
}