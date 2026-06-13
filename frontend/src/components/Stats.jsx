const stats = [
  { num: '2.4M+', label: 'Areas Monitored' },
  { num: '98.6%', label: 'AI Accuracy' },
  { num: '50K+',  label: 'Community Reports' },
]

export default function Stats() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      borderTop: '1px solid #1a1a1a',
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '16px 0 16px 26px',
          borderRight: i < stats.length - 1 ? '1px solid #1a1a1a' : 'none',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px', color: '#ff3b3b',
          }}>{s.num}</div>
          <div style={{ fontSize: '11px', color: '#333', marginTop: '1px' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}