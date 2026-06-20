import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navLinks = ['Map', 'Report', 'Predict', 'Community', 'About']

export default function Navbar() {
  const [active, setActive] = useState('Map')
  const navigate = useNavigate()

  return (
    <nav style={{ height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: '#0b0b0b', borderBottom: '1px solid #1f1f1f', position: 'sticky', top: 0, zIndex: 100 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          onClick={function() { navigate('/') }}
          style={{ width: '38px', height: '38px', background: '#ff3b3b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer' }}
        >📡</div>
        <span
          onClick={function() { navigate('/') }}
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', letterSpacing: '2px', color: '#fff', cursor: 'pointer' }}
        >
          Crime<span style={{ color: '#ff3b3b' }}>Radar</span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '2px' }}>
        {navLinks.map(function(link) {
          return (
            <span
              key={link}
              onClick={function() { setActive(link) }}
              style={{ color: active === link ? '#fff' : '#555', fontSize: '13px', fontWeight: '500', padding: '7px 15px', borderRadius: '8px', background: active === link ? '#1a1a1a' : 'transparent', display: 'inline-block', cursor: 'pointer' }}
            >
              {link}
            </span>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#aaa' }}>
    <div style={{ width: '7px', height: '7px', background: '#ff3b3b', borderRadius: '50%' }}></div>
    2,419 zones live
  </div>
  <button
    onClick={function() { navigate('/sos') }}
    style={{ background: '#2a0d0d', color: '#ff3b3b', border: '1px solid #ff3b3b44', fontSize: '13px', fontWeight: '700', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer' }}
  >
    🆘 SOS
  </button>
  <button
    onClick={function() { navigate('/alerts') }}
    style={{ background: '#ff3b3b', color: '#fff', border: 'none', fontSize: '13px', fontWeight: '700', padding: '9px 22px', borderRadius: '8px', cursor: 'pointer' }}
  >
    Get Alerts 🔔
  </button>
</div>

    </nav>
  )
}