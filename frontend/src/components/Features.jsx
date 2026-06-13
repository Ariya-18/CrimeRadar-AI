const features = [
  { icon: '🗺️', title: 'Live Heatmap',   desc: 'Danger zones in real-time',  accent: '#ff3b3b', bg: '#1a0d0d' },
  { icon: '🤖', title: 'AI Chatbot',      desc: 'Ask safety questions',        accent: '#4ade80', bg: '#0d1a0d' },
  { icon: '🛡️', title: 'Safety Score',   desc: 'AI-predicted per locality',   accent: '#ff3b3b', bg: '#1a0d0d' },
  { icon: '👥', title: 'Community',       desc: 'Anonymous reporting',         accent: '#4ade80', bg: '#0d1a0d' },
]

export default function Features() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1px',
      background: '#1a1a1a',
      borderTop: '1px solid #1a1a1a',
    }}>
      {features.map((f, i) => (
        <div key={i} style={{ background: '#0b0b0b', padding: '14px 16px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px', background: f.bg, fontSize: '16px',
          }}>{f.icon}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '2px' }}>{f.title}</div>
          <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.5' }}>{f.desc}</div>
        </div>
      ))}
    </div>
  )
}