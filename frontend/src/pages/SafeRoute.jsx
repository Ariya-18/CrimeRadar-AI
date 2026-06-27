import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Tooltip, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas from '../data/coimbatoreData'

function FlyTo({ position }) {
  const map = useMap()
  useEffect(function () {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 })
    }
  }, [position, map])
  return null
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;background:#3b82f6;border:3px solid #fff;
    border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const destIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:22px;height:22px;background:#ff3b3b;border:3px solid #fff;
    border-radius:50%;box-shadow:0 0 0 4px rgba(255,59,59,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:10px;color:white;font-weight:bold;
  ">D</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

export default function SafeRoutePlanner() {
  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [destination, setDestination] = useState('')
  const [destSuggestions, setDestSuggestions] = useState([])
  const [destCoords, setDestCoords] = useState(null)
  const [destName, setDestName] = useState('')
  const [route, setRoute] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [dangerZones, setDangerZones] = useState([])
  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558])
  const searchTimeout = useRef(null)

  function getLiveLocation() {
    setLocationLoading(true)
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser')
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coords)
        setMapCenter(coords)
        setLocationLoading(false)
      },
      function (err) {
        setLocationError('Location access denied. Please allow location access.')
        setLocationLoading(false)
        // fallback to Coimbatore center
        setUserLocation([11.0168, 76.9558])
        setMapCenter([11.0168, 76.9558])
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(function () {
    getLiveLocation()
  }, [])

 async function searchDestination(query) {
    setDestination(query)
    if (query.length < 2) { setDestSuggestions([]); return }
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async function () {
      try {
        const url = 'https://nominatim.openstreetmap.org/search' +
          '?format=json' +
          '&q=' + encodeURIComponent(query) +
          '&limit=8' +
          '&countrycodes=in' +
          '&viewbox=76.85,10.90,77.20,11.15' +
          '&bounded=0' +
          '&addressdetails=1' +
          '&extratags=1'
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' }
        })
        const data = await res.json()
        setDestSuggestions(data)
      } catch (e) {
        setDestSuggestions([])
      }
    }, 350)
  }

  function selectDestination(place) {
    const parts = place.display_name.split(',')
    const shortName = parts.slice(0, 3).join(',').trim()
    setDestName(shortName)
    setDestination(shortName)
    setDestCoords([parseFloat(place.lat), parseFloat(place.lon)])
    setMapCenter([parseFloat(place.lat), parseFloat(place.lon)])
    setDestSuggestions([])
  }

  function findDangerZonesOnRoute(start, end) {
    const dangers = coimbatoreAreas.filter(function (area) {
      if (area.safeScore >= 70) return false
      const midLat = (start[0] + end[0]) / 2
      const midLng = (start[1] + end[1]) / 2
      const latDiff = Math.abs(area.lat - midLat)
      const lngDiff = Math.abs(area.lng - midLng)
      return latDiff < 0.03 && lngDiff < 0.03
    })
    return dangers
  }

  function generateSafeRoute(start, end) {
    const dangers = findDangerZonesOnRoute(start, end)
    setDangerZones(dangers)

    if (dangers.length === 0) {
      return [start, end]
    }

    // Add a waypoint to avoid danger zones
    const midLat = (start[0] + end[0]) / 2 + 0.012
    const midLng = (start[1] + end[1]) / 2 + 0.008
    return [start, [midLat, midLng], end]
  }

  function handleFindRoute() {
    if (!userLocation) { alert('Please allow location access first'); return }
    if (!destCoords) { alert('Please select a destination from suggestions'); return }
    setRouteLoading(true)
    setTimeout(function () {
      const safeRoute = generateSafeRoute(userLocation, destCoords)
      setRoute(safeRoute)
      setRouteLoading(false)
    }, 1500)
  }

  function getScoreColor(score) {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#f59e0b'
    return '#ff3b3b'
  }

  const inputStyle = {
    width: '100%',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#ddd',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={function () { navigate('/') }}
            style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
          >
            ← Back
          </button>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#fff', letterSpacing: '1px' }}>🗺️ Safe Route Planner</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Live GPS → Search destination → Get safest route</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', flex: 1, height: 'calc(100vh - 70px)' }}>

        {/* Left Panel */}
        <div style={{ background: '#0e0e0e', borderRight: '1px solid #1a1a1a', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Live Location */}
          <div style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>Your Location (Start)</div>

            {!userLocation && !locationLoading && (
              <button
                onClick={getLiveLocation}
                style={{ width: '100%', background: '#1a3a6e', color: '#60a5fa', border: '1px solid #2a4a8e', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                📍 Get My Live Location
              </button>
            )}

            {locationLoading && (
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '13px', color: '#60a5fa' }}>📡 Detecting your location...</div>
              </div>
            )}

            {locationError && (
              <div style={{ background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: '#ff3b3b' }}>{locationError}</div>
              </div>
            )}

            {userLocation && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>Live Location Active</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>
                      {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={getLiveLocation}
                  style={{ width: '100%', background: '#141414', color: '#60a5fa', border: '1px solid #2a4a8e', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🔄 Refresh Location
                </button>
              </div>
            )}
          </div>

          {/* Destination Search */}
          <div style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', position: 'relative' }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>Destination</div>
            <input
              type="text"
              placeholder="Search place, shop, hotel, bus stand..."
              value={destination}
              onChange={function (e) { searchDestination(e.target.value) }}
              style={inputStyle}
            />

            {/* Suggestions */}
            {destSuggestions.length > 0 && (
              <div style={{ position: 'absolute', left: '16px', right: '16px', top: '88px', background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '10px', zIndex: 999, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                {destSuggestions.map(function (place, i) {
                  const parts = place.display_name.split(',')
                  const mainName = parts[0].trim()
                  const subName = parts.slice(1, 4).join(',').trim()
                  const typeIcon = place.type === 'bus_stop' ? '🚌'
                    : place.type === 'hospital' ? '🏥'
                    : place.type === 'hotel' ? '🏨'
                    : place.type === 'restaurant' ? '🍽️'
                    : place.type === 'school' ? '🏫'
                    : place.type === 'college' ? '🏛️'
                    : place.type === 'shop' ? '🛒'
                    : place.class === 'highway' ? '🛣️'
                    : place.class === 'amenity' ? '📌'
                    : '📍'
                  return (
                    <div
                      key={i}
                      onClick={function () { selectDestination(place) }}
                      style={{ padding: '11px 14px', cursor: 'pointer', borderBottom: i < destSuggestions.length - 1 ? '1px solid #1a1a1a' : 'none', display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                    >
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>{typeIcon}</span>
                      <div>
                        <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '2px' }}>{mainName}</div>
                        <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4' }}>{subName}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {destCoords && (
              <div style={{ marginTop: '10px', background: '#0d1f0d', border: '1px solid #4ade8033', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>✅</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600' }}>Destination Set</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{destName}</div>
                </div>
              </div>
            )}
          </div>

          {/* Find Route Button */}
          <button
            onClick={handleFindRoute}
            disabled={routeLoading || !userLocation || !destCoords}
            style={{
              width: '100%', background: routeLoading ? '#8a2020' : '#ff3b3b',
              color: '#fff', border: 'none', padding: '14px', borderRadius: '10px',
              fontSize: '14px', fontWeight: '700', cursor: (!userLocation || !destCoords) ? 'not-allowed' : 'pointer',
              opacity: (!userLocation || !destCoords) ? 0.5 : 1,
            }}
          >
            {routeLoading ? '🔍 Finding Safe Route...' : '🛡️ Find Safe Route →'}
          </button>

          {/* Route Result */}
          {route && (
            <div style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '600' }}>Route Analysis</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', background: dangerZones.length > 0 ? '#2a1500' : '#0d1f0d', border: '1px solid ' + (dangerZones.length > 0 ? '#f59e0b44' : '#4ade8033'), borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '22px' }}>{dangerZones.length > 0 ? '⚠️' : '✅'}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: dangerZones.length > 0 ? '#f59e0b' : '#4ade80' }}>
                    {dangerZones.length > 0 ? 'Route Adjusted' : 'Route is Safe!'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>
                    {dangerZones.length > 0
                      ? dangerZones.length + ' danger zone(s) avoided'
                      : 'No danger zones on this path'
                    }
                  </div>
                </div>
              </div>

              {dangerZones.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '8px' }}>Danger zones avoided:</div>
                  {dangerZones.map(function (zone, i) {
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0b0b0b', border: '1px solid #2a0d0d', borderRadius: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#ddd' }}>{zone.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: '#2a0d0d', color: '#ff3b3b' }}>{zone.safeScore}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#0b0b0b', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>Est. Distance</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ddd' }}>
                    {userLocation && destCoords
                      ? (Math.sqrt(
                          Math.pow((userLocation[0] - destCoords[0]) * 111, 2) +
                          Math.pow((userLocation[1] - destCoords[1]) * 111, 2)
                        ).toFixed(1)) + ' km'
                      : '--'}
                  </div>
                </div>
                <div style={{ background: '#0b0b0b', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>Safety Level</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: dangerZones.length > 0 ? '#f59e0b' : '#4ade80' }}>
                    {dangerZones.length > 0 ? 'Medium' : 'High'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Legend */}
          <div style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '600' }}>Map Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Your live location</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b3b', flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Destination</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Safe zone (score 80+)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Caution zone (60-79)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b3b', flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Danger zone (&lt;60)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '3px', background: '#4ade80', flexShrink: 0, borderRadius: '2px' }}></div>
                <span style={{ fontSize: '12px', color: '#888' }}>Safe route path</span>
              </div>
            </div>
          </div>

        </div>

        {/* Map */}
        <div style={{ position: 'relative' }}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            <FlyTo position={mapCenter} />

            {/* All area circles */}
            {coimbatoreAreas.map(function (area) {
              const color = getScoreColor(area.safeScore)
              return (
                <Circle
                  key={area.id}
                  center={[area.lat, area.lng]}
                  radius={700}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.25,
                    weight: 1,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>
                    <div style={{ fontWeight: '700', fontSize: '12px' }}>
                      {area.name} — {area.safeScore}
                    </div>
                  </Tooltip>
                </Circle>
              )
            })}

            {/* User live location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Tooltip permanent direction="top" offset={[0, -12]}>
                  <span style={{ fontWeight: '700', color: '#3b82f6' }}>📍 You are here</span>
                </Tooltip>
              </Marker>
            )}

            {/* Destination marker */}
            {destCoords && (
              <Marker position={destCoords} icon={destIcon}>
                <Tooltip permanent direction="top" offset={[0, -12]}>
                  <span style={{ fontWeight: '700', color: '#ff3b3b' }}>🏁 {destName}</span>
                </Tooltip>
              </Marker>
            )}

            {/* Safe route line */}
            {route && (
              <Polyline
                positions={route}
                pathOptions={{ color: '#4ade80', weight: 4, opacity: 0.9, dashArray: '10 6' }}
              />
            )}

          </MapContainer>
        </div>

      </div>
    </div>
  )
}