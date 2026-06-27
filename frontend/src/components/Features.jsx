import { useNavigate } from 'react-router-dom'

export default function Features() {
  const navigate = useNavigate()

  const features = [
    { icon: '🗺️', title: 'Live Heatmap',  desc: 'Danger zones in real-time',  bg: '#1a0d0d', path: '/heatmap' },
    { icon: '🤖', title: 'AI Chatbot',     desc: 'Ask safety questions',        bg: '#0d1a0d', path: '/chatbot' },
    { icon: '🛡️', title: 'Safety Score',  desc: 'AI-predicted per locality',   bg: '#1a0d0d', path: '/safe-route' },
    { icon: '👥', title: 'Report',      desc: 'Anonymous reporting',         bg: '#0d1a0d', path: '/report' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1a1a1a', borderTop: '1px solid #1a1a1a' }}>
      {features.map(function(f, i) {
        return (
          <div
            key={i}
            onClick={function() { navigate(f.path) }}
            style={{ background: '#0b0b0b', padding: '20px 18px', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.background = '#111' }}
            onMouseLeave={function(e) { e.currentTarget.style.background = '#0b0b0b' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', background: f.bg, fontSize: '18px' }}>
              {f.icon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '4px' }}>{f.title}</div>
            <div style={{ fontSize: '12px', color: '#333', lineHeight: '1.5' }}>{f.desc}</div>
          </div>
        )
      })}
    </div>
  )
}