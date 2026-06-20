import { useParams, useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'
import HeatMap from '../components/HeatMap'

export default function AreaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const area = coimbatoreAreas.find(function(a) { return a.id === parseInt(id) })

  if (!area) {
    return (
      <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>Area not found</div>
          <button onClick={function() { navigate('/') }} style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const scoreColor = area.safeScore >= 80 ? '#4ade80' : area.safeScore >= 60 ? '#f59e0b' : '#ff3b3b'
  const scoreBg = area.safeScore >= 80 ? '#0d1f0d' : area.safeScore >= 60 ? '#1f1500' : '#2a0d0d'
  const severityColor = function(s) {
    if (s === 'high') return { color: '#ff3b3b', bg: '#2a0d0d' }
    if (s === 'medium') return { color: '#f59e0b', bg: '#1f1500' }
    return { color: '#4ade80', bg: '#0d1f0d' }
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Top Bar */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={function() { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            ← Back
          </button>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#fff', letterSpacing: '1px' }}>{area.name}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Coimbatore, Tamil Nadu</div>
          </div>
        </div>
        <div style={{ background: scoreBg, border: '1px solid ' + scoreColor + '44', borderRadius: '12px', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: scoreColor, lineHeight: 1 }}>{area.safeScore}</div>
          <div style={{ fontSize: '10px', color: scoreColor, letterSpacing: '1px', textTransform: 'uppercase' }}>Safety Score</div>
        </div>
      </div>

      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Safe Score Card */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Safety Overview</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - area.safeScore / 100)}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: scoreColor, lineHeight: 1 }}>{area.safeScore}</div>
                  <div style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>/ 100</div>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: scoreColor, marginBottom: '4px' }}>{area.status}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  Based on crime frequency,<br />severity and time patterns
                </div>
              </div>
            </div>

            {/* Safe / Unsafe Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#0d1f0d', border: '1px solid #1a3a1a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: '#4ade80', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '6px' }}>✅ Safe Time</div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{area.safeTime}</div>
              </div>
              <div style={{ background: '#2a0d0d', border: '1px solid #3a1a1a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: '#ff3b3b', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '6px' }}>⚠️ Avoid Time</div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{area.unsafeTime}</div>
              </div>
            </div>
          </div>

          {/* Recent Crimes */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>
              Recent Crimes ({area.recentCrimes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {area.recentCrimes.map(function(crime, i) {
                const sc = severityColor(crime.severity)
                return (
                  <div key={i} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#ddd', fontWeight: '600', marginBottom: '4px' }}>{crime.type}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{crime.date} &nbsp;•&nbsp; {crime.time}</div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: sc.bg, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {crime.severity}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>
              Coimbatore Heatmap
            </div>
            <HeatMap selectedId={area.id} />
          </div>

          {/* All Areas Quick List */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Compare Other Areas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
              {coimbatoreAreas.map(function(a) {
                const c = a.safeScore >= 80 ? { color: '#4ade80', bg: '#0d1f0d' } : a.safeScore >= 60 ? { color: '#f59e0b', bg: '#1f1500' } : { color: '#ff3b3b', bg: '#2a0d0d' }
                return (
                  <div
                    key={a.id}
                    onClick={function() { navigate('/area/' + a.id) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: a.id === area.id ? '#1a1a1a' : '#141414', border: '1px solid ' + (a.id === area.id ? '#2a2a2a' : '#1a1a1a'), borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '13px', color: a.id === area.id ? '#fff' : '#888' }}>{a.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: c.bg, color: c.color }}>{a.safeScore}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}