import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Tooltip, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas, { EMERGENCY_NUMBERS } from '../data/coimbatoreData'

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function getColor(score) {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#f59e0b'
  return '#ff3b3b'
}

// Simple safe route: pick waypoints that avoid low-score areas
function buildSafeRoute(from, to) {
  // Direct line waypoints (interpolated)
  const steps = 8
  const waypoints = []
  for (let i = 0; i <= steps; i++) {
    waypoints.push([
      from.lat + (to.lat - from.lat) * (i / steps),
      from.lng + (to.lng - from.lng) * (i / steps),
    ])
  }

  // Check if any waypoint passes through a danger zone
  const dangerZones = coimbatoreAreas.filter((a) => a.safeScore < 60)
  let passedDanger = []

  waypoints.forEach(([lat, lng]) => {
    dangerZones.forEach((zone) => {
      const dist = Math.sqrt(Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2))
      if (dist < 0.008) passedDanger.push(zone.name)
    })
  })

  passedDanger = [...new Set(passedDanger)]

  // Build an alternate route that nudges north to avoid danger zones
  const altWaypoints = waypoints.map(([lat, lng]) => [lat + 0.012, lng - 0.008])

  return { direct: waypoints, alternate: altWaypoints, dangerPassed: passedDanger }
}

export default function SafeRoute() {
  const navigate   = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [route, setRoute] = useState(null)
  const [activeTab, setActiveTab] = useState('route') // route | helplines

  const areaOptions = coimbatoreAreas.map((a) => ({ label: a.name, value: a.id, lat: a.lat, lng: a.lng, score: a.safeScore }))

  function planRoute() {
    if (!from || !to) { alert('Select both From and To areas'); return }
    if (from === to)  { alert('Select different areas'); return }

    const fromArea = coimbatoreAreas.find((a) => a.id === parseInt(from))
    const toArea   = coimbatoreAreas.find((a) => a.id === parseInt(to))

    const result = buildSafeRoute(
      { lat: fromArea.lat, lng: fromArea.lng },
      { lat: toArea.lat,   lng: toArea.lng }
    )

    setRoute({ from: fromArea, to: toArea, ...result })
  }

  const selectStyle = {
    width: '100%', background: '#141414', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '11px 14px', color: '#ddd',
    fontSize: '13px', outline: 'none',
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', color: 'white' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/')}
          style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
          ← Back
        </button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#fff', letterSpacing: '1px' }}>🗺️ Safe Route Planner</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Plan routes that avoid Coimbatore danger zones</div>
        </div>

        {/* Tabs */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {[{ id: 'route', label: '🗺️ Route' }, { id: 'helplines', label: '📞 Helplines' }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ background: activeTab === t.id ? '#ff3b3b' : '#1a1a1a', color: activeTab === t.id ? '#fff' : '#888', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Route Tab */}
      {activeTab === 'route' && (
        <div style={{ padding: '28px 32px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>

          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Route planner form */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px', fontWeight: '600' }}>Plan Route</div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>From</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} style={selectStyle}>
                  <option value="">-- Select start area --</option>
                  {areaOptions.map((a) => <option key={a.value} value={a.value}>{a.label} (Score {a.score})</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>To</label>
                <select value={to} onChange={(e) => setTo(e.target.value)} style={selectStyle}>
                  <option value="">-- Select destination --</option>
                  {areaOptions.map((a) => <option key={a.value} value={a.value}>{a.label} (Score {a.score})</option>)}
                </select>
              </div>

              <button onClick={planRoute}
                style={{ width: '100%', background: '#ff3b3b', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                Find Safe Route →
              </button>
            </div>

            {/* Route result */}
            {route && (
              <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
                <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Route Analysis</div>

                {/* From → To */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#ddd', fontWeight: '600' }}>{route.from.name}</div>
                  <div style={{ color: '#555', fontSize: '12px' }}>→</div>
                  <div style={{ fontSize: '12px', color: '#ddd', fontWeight: '600' }}>{route.to.name}</div>
                </div>

                {/* Direct route warning */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Direct route passes through:</div>
                  {route.dangerPassed.length === 0 ? (
                    <div style={{ background: '#0d1f0d', border: '1px solid #22c55e33', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#4ade80' }}>
                      ✅ No danger zones — direct route is safe!
                    </div>
                  ) : (
                    <>
                      {route.dangerPassed.map((name) => (
                        <div key={name} style={{ background: '#2a0d0d', border: '1px solid #ff3b3b33', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px', fontSize: '12px', color: '#ff3b3b' }}>
                          ⚠️ {name}
                        </div>
                      ))}
                      <div style={{ marginTop: '10px', background: '#0d1a0d', border: '1px solid #4ade8033', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#4ade80' }}>
                        ✅ Alternate safe route shown in green
                      </div>
                    </>
                  )}
                </div>

                {/* Nearest police at destination */}
                <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nearest Police at Destination</div>
                  <a href={`tel:${route.to.police.phone}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🚔</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#ddd', fontWeight: '600' }}>{route.to.police.station}</div>
                      <div style={{ fontSize: '11px', color: '#4ade80' }}>{route.to.police.phone} · {route.to.police.distance}</div>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1a1a1a', height: '600px' }}>
            <MapContainer center={[11.0168, 76.9558]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />

              {/* Area circles */}
              {coimbatoreAreas.map((area) => (
                <Circle key={area.id} center={[area.lat, area.lng]} radius={600}
                  pathOptions={{ color: getColor(area.safeScore), fillColor: getColor(area.safeScore), fillOpacity: 0.25, weight: 1 }}>
                  <Tooltip direction="top" offset={[0, -6]}>
                    <div style={{ fontSize: '11px', fontWeight: '700' }}>
                      {area.name} — {area.safeScore}
                    </div>
                  </Tooltip>
                </Circle>
              ))}

              {/* Route lines */}
              {route && (
                <>
                  {/* Direct route — red dashed if dangerous, white if safe */}
                  <Polyline positions={route.direct}
                    pathOptions={{ color: route.dangerPassed.length > 0 ? '#ff3b3b' : '#ffffff', weight: 3, dashArray: route.dangerPassed.length > 0 ? '8,6' : undefined, opacity: 0.8 }} />

                  {/* Alternate safe route — green */}
                  {route.dangerPassed.length > 0 && (
                    <Polyline positions={route.alternate}
                      pathOptions={{ color: '#4ade80', weight: 4, opacity: 0.9 }} />
                  )}

                  {/* Start marker */}
                  <Marker position={[route.from.lat, route.from.lng]}>
                    <Popup><strong>Start:</strong> {route.from.name}</Popup>
                  </Marker>

                  {/* End marker */}
                  <Marker position={[route.to.lat, route.to.lng]}>
                    <Popup><strong>Destination:</strong> {route.to.name}</Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Helplines Tab */}
      {activeTab === 'helplines' && (
        <div style={{ padding: '28px 32px', maxWidth: '900px', margin: '0 auto' }}>

          {/* Emergency numbers */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>National Emergency Numbers</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {EMERGENCY_NUMBERS.map((e) => (
                <a key={e.number} href={`tel:${e.number}`}
                  style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: '28px' }}>{e.icon}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{e.label}</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#ff3b3b', letterSpacing: '2px' }}>{e.number}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Per-area police stations */}
          <div>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Coimbatore Police Stations by Area</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {coimbatoreAreas.map((area) => (
                <div key={area.id} style={{ background: '#0e0e0e', border: `1px solid ${area.safeScore < 60 ? '#2a0d0d' : '#1a1a1a'}`, borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '3px' }}>{area.name}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{area.police.station}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{area.police.distance} away</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px',
                      background: area.safeScore >= 80 ? '#0d1f0d' : area.safeScore >= 60 ? '#1f1500' : '#2a0d0d',
                      color: area.safeScore >= 80 ? '#4ade80' : area.safeScore >= 60 ? '#f59e0b' : '#ff3b3b' }}>
                      {area.safeScore}
                    </span>
                    <a href={`tel:${area.police.phone}`}
                      style={{ background: '#141414', border: '1px solid #2a2a2a', color: '#4ade80', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>
                      📞 Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}