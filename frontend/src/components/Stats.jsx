export default function Stats() {
  const stats = [
    { num: '2.4M+', label: 'Areas Monitored' },
    { num: '98.6%', label: 'AI Accuracy' },
    { num: '50K+',  label: 'Community Reports' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #1a1a1a', background: '#0b0b0b' }}>
      {stats.map(function(s, i) {
        return (
          <div key={i} style={{ padding: '24px 0 24px 32px', borderRight: i < 2 ? '1px solid #1a1a1a' : 'none' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#ff3b3b' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#444', marginTop: '2px' }}>{s.label}</div>
          </div>
        )
      })}
    </div>
  )
}