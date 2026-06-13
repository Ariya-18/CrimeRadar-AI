const areas = [
  { name: 'Anna Nagar',   score: 94, status: 'Safe',  color: '#4ade80', bg: '#0d1f0d' },
  { name: 'Koramangala',  score: 88, status: 'Safe',  color: '#4ade80', bg: '#0d1f0d' },
  { name: 'Dharavi',      score: 58, status: 'Alert', color: '#ff3b3b', bg: '#2a0d0d' },
  { name: 'Paharganj',    score: 71, status: 'Watch', color: '#f59e0b', bg: '#1f1500' },
]

export default function SafetyPanel() {
  return (
    <div style={{ width: '230px', zIndex: 2 }}>
      {/* Score Card */}
      <div style={{
        background: '#141414', border: '1px solid #222',
        borderRadius: '14px', padding: '18px 20px',
        marginBottom: '10px', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '64px', color: '#fff', lineHeight: 1,
        }}>
          8<span style={{ color: '#ff3b3b' }}>9</span>
        </div>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>
          City Safety Score
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '4px', margin: '12px 0 4px' }}>
          <div style={{ width: '89%', height: '4px', background: '#ff3b3b', borderRadius: '4px' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#ff3b3b', fontWeight: '600' }}>No active alerts nearby</div>
      </div>

      {/* Area List */}
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
          fontSize: '10px', color: '#333', letterSpacing: '2px',
          textTransform: 'uppercase', fontWeight: '600',
        }}>
          Area Index — Live
        </div>
        {areas.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 16px',
            borderBottom: i < areas.length - 1 ? '1px solid #141414' : 'none',
          }}>
            <span style={{ fontSize: '13px', color: '#aaa' }}>{a.name}</span>
            <span style={{
              fontSize: '10px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '20px',
              background: a.bg, color: a.color,
            }}>
              {a.status} {a.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}