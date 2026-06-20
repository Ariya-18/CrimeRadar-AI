import { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas from '../data/coimbatoreData'

function FlyToArea({ area }) {
  const map = useMap()
  useEffect(function() {
    if (area) {
      map.flyTo([area.lat, area.lng], 14, { duration: 1.5 })
    }
  }, [area, map])
  return null
}

export default function HeatMap({ selectedId }) {
  const selectedArea = coimbatoreAreas.find(function(a) { return a.id === selectedId })

  function getColor(score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }

  function getFillOpacity(score) {
    if (score >= 80) return 0.25
    if (score >= 60) return 0.35
    return 0.45
  }

  function getRadius(score) {
    if (score >= 80) return 700
    if (score >= 60) return 850
    return 1000
  }

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80' }}></div>
          <span style={{ fontSize: '11px', color: '#555' }}>Safe (80+)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
          <span style={{ fontSize: '11px', color: '#555' }}>Caution (60-79)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b3b' }}></div>
          <span style={{ fontSize: '11px', color: '#555' }}>Alert (&lt;60)</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a', height: '420px' }}>
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* Dark map tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Fly to selected area */}
          {selectedArea && <FlyToArea area={selectedArea} />}

          {/* Draw each area as colored circle */}
          {coimbatoreAreas.map(function(area) {
            const color = getColor(area.safeScore)
            const isSelected = area.id === selectedId

            return (
              <Circle
                key={area.id}
                center={[area.lat, area.lng]}
                radius={isSelected ? getRadius(area.safeScore) * 1.4 : getRadius(area.safeScore)}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.6 : getFillOpacity(area.safeScore),
                  weight: isSelected ? 3 : 1,
                  opacity: isSelected ? 1 : 0.7,
                }}
              >
                <Tooltip
                  permanent={isSelected}
                  direction="top"
                  offset={[0, -10]}
                >
                  <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '12px' }}>
                    {area.name}<br />
                    <span style={{ color: color }}>Score: {area.safeScore}</span>
                  </div>
                </Tooltip>
              </Circle>
            )
          })}

        </MapContainer>
      </div>
    </div>
  )
}