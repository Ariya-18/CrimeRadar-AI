import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas from '../data/coimbatoreData'

export default function HeatMapPage() {
  const navigate = useNavigate()

  function getColor(score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }

  function getLabel(score) {
    if (score >= 80) return 'Safe'
    if (score >= 60) return 'Caution'
    return 'Alert'
  }

  const safe    = coimbatoreAreas.filter(function(a) { return a.safeScore >= 80 }).length
  const caution = coimbatoreAreas.filter(function(a) { return a.safeScore >= 60 && a.safeScore < 80 }).length
  const alert   = coimbatoreAreas.filter(function(a) { return a.safeScore < 60 }).length

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={function() { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#fff', letterSpacing: '1px' }}>🗺️ Coimbatore Crime Heatmap</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Live safety zones across all 30 major areas</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { count: safe,    label: 'Safe',    color: '#4ade80' },
            { count: caution, label: 'Caution', color: '#f59e0b' },
            { count: alert,   label: 'Alert',   color: '#ff3b3b' },
          ].map(function(s, i) {
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 70px)' }}>

        {/* Sidebar */}
        <div style={{ width: '260px', background: '#0e0e0e', borderRight: '1px solid #1a1a1a', overflowY: 'auto', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>Legend</div>
          {[
            { color: '#4ade80', label: 'Safe Zone (80-100)',   desc: 'Generally safe to visit' },
            { color: '#f59e0b', label: 'Caution (60-79)',      desc: 'Be alert especially at night' },
            { color: '#ff3b3b', label: 'Danger Zone (<60)',    desc: 'Avoid if possible' },
          ].map(function(l, i) {
            return (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: l.color, flexShrink: 0, marginTop: '2px' }}></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#ddd', fontWeight: '600' }}>{l.label}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{l.desc}</div>
                </div>
              </div>
            )
          })}

          <div style={{ height: '1px', background: '#1a1a1a', margin: '16px 0' }}></div>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>All Areas</div>

          {coimbatoreAreas
            .sort(function(a, b) { return a.safeScore - b.safeScore })
            .map(function(area) {
              const color = getColor(area.safeScore)
              return (
                <div
                  key={area.id}
                  onClick={function() { navigate('/area/' + area.id) }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', background: '#141414', border: '1px solid #1a1a1a' }}
                >
                  <span style={{ fontSize: '12px', color: '#aaa' }}>{area.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: color + '20', color: color }}>{area.safeScore}</span>
                </div>
              )
            })}
        </div>

        {/* Full Map */}
        <div style={{ flex: 1 }}>
          <MapContainer center={[11.0168, 76.9558]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            {coimbatoreAreas.map(function(area) {
              const color = getColor(area.safeScore)
              return (
                <Circle
                  key={area.id}
                  center={[area.lat, area.lng]}
                  radius={900}
                  pathOptions={{ color: color, fillColor: color, fillOpacity: 0.35, weight: 2 }}
                  eventHandlers={{ click: function() { navigate('/area/' + area.id) } }}
                >
                  <Tooltip direction="top" offset={[0, -8]}>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{area.name}</div>
                    <div style={{ color: color, fontSize: '12px' }}>{getLabel(area.safeScore)} — {area.safeScore}/100</div>
                    <div style={{ color: '#888', fontSize: '11px' }}>{area.recentCrimes.length} recent crimes</div>
                    <div style={{ color: '#aaa', fontSize: '11px', marginTop: '2px' }}>Click to view details →</div>
                  </Tooltip>
                </Circle>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}