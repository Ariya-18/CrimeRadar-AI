export default function Ticker() {
  const items = [
    'Safe Zone', 'CrimeRadar AI', 'Know Before You Go',
    'Real-Time Safety', 'AI Powered', 'India No 1',
    'Safe Zone', 'CrimeRadar AI', 'Know Before You Go',
    'Real-Time Safety', 'AI Powered', 'India No 1',
  ]

  return (
    <div style={{ background: '#ff3b3b', padding: '9px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <style>{'@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }'}</style>
      <div style={{ display: 'inline-flex', animation: 'ticker 16s linear infinite' }}>
        {items.map(function(item, i) {
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px', color: '#fff', padding: '0 24px' }}>{item}</span>
              <span style={{ color: '#ffffff55', fontSize: '12px' }}>◆</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}