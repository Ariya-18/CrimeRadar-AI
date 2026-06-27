import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Map',        path: null },
  { label: 'Safe Route', path: '/safe-route' },
  { label: '🤖 AI Chat', path: '/chat' },
  { label: 'Report',     path: '/report' },
  { label: 'Community',  path: null },
]

export default function Navbar() {
  const [active, setActive] = useState('Map')
  const navigate = useNavigate()

  function handleNav(link) {
    setActive(link.label)
    if (link.path) navigate(link.path)
  }

  return (
    <nav style={{ height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: '#0b0b0b', borderBottom: '1px solid #1f1f1f', position: 'sticky', top: 0, zIndex: 100 }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          onClick={() => navigate('/')}
          style={{ width: '38px', height: '38px', background: '#ff3b3b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer' }}
        >📡</div>
        <span
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', letterSpacing: '2px', color: '#fff', cursor: 'pointer' }}
        >
          Crime<span style={{ color: '#ff3b3b' }}>Radar</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {navLinks.map((link) => (
          <span
            key={link.label}
            onClick={() => handleNav(link)}
            style={{
              color: active === link.label ? '#fff' : '#555',
              fontSize: '13px', fontWeight: '500',
              padding: '7px 15px', borderRadius: '8px',
              background: active === link.label ? '#1a1a1a' : 'transparent',
              display: 'inline-block', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {link.label}
          </span>
        ))}
      </div>

      {/* Right buttons */}
     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#aaa' }}>
    <div style={{ width: '7px', height: '7px', background: '#ff3b3b', borderRadius: '50%' }}></div>
    2,419 zones live
  </div>
  <button
    onClick={function() { navigate('/women-safety') }}
    style={{ background: '#150d1f', color: '#a855f7', border: '1px solid #a855f744', fontSize: '13px', fontWeight: '700', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer' }}
  >
    👩 Women
  </button>
  <button
    onClick={function() { navigate('/sos') }}
    style={{ background: '#2a0d0d', color: '#ff3b3b', border: '1px solid #ff3b3b44', fontSize: '13px', fontWeight: '700', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer' }}
  >
    🆘 SOS
  </button>
  <button
    onClick={function() { navigate('/settings') }}
    style={{ background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', fontSize: '13px', fontWeight: '700', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer' }}
  >
    ⚙️
  </button>
  <button
    onClick={function() { navigate('/alerts') }}
    style={{ background: '#ff3b3b', color: '#fff', border: 'none', fontSize: '13px', fontWeight: '700', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer' }}
  >
    Get Alerts 🔔
  </button>
</div>

    </nav>
  )
}