import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import coimbatoreAreas from '../data/coimbatoreData'

const womenCrimeData = {
  'RS Puram':          { cases: 4,  types: ['Eve Teasing', 'Stalking'],                  womenScore: 82 },
  'Gandhipuram':       { cases: 18, types: ['Eve Teasing', 'Chain Snatching', 'Assault'], womenScore: 45 },
  'Peelamedu':         { cases: 6,  types: ['Stalking', 'Vehicle Theft'],                 womenScore: 74 },
  'Saibaba Colony':    { cases: 2,  types: ['Eve Teasing'],                               womenScore: 88 },
  'Singanallur':       { cases: 12, types: ['Chain Snatching', 'Assault', 'Stalking'],    womenScore: 55 },
  'Ukkadam':           { cases: 24, types: ['Assault', 'Eve Teasing', 'Robbery'],         womenScore: 30 },
  'Tidel Park Area':   { cases: 3,  types: ['Stalking'],                                  womenScore: 84 },
  'Kavundampalayam':   { cases: 7,  types: ['Eve Teasing', 'Chain Snatching'],            womenScore: 68 },
  'Sowripalayam':      { cases: 14, types: ['Assault', 'Stalking', 'Eve Teasing'],        womenScore: 48 },
  'Vadavalli':         { cases: 5,  types: ['Eve Teasing', 'Stalking'],                   womenScore: 78 },
  'Hopes College':     { cases: 8,  types: ['Eve Teasing', 'Stalking'],                   womenScore: 70 },
  'Kovaipudur':        { cases: 1,  types: ['Eve Teasing'],                               womenScore: 91 },
  'Thudiyalur':        { cases: 9,  types: ['Chain Snatching', 'Assault'],                womenScore: 64 },
  'Ramanathapuram':    { cases: 15, types: ['Robbery', 'Assault', 'Eve Teasing'],         womenScore: 50 },
  'Podanur':           { cases: 21, types: ['Assault', 'Robbery', 'Eve Teasing'],         womenScore: 35 },
  'Ganapathy':         { cases: 5,  types: ['Eve Teasing', 'Stalking'],                   womenScore: 76 },
  'Kuniyamuthur':      { cases: 10, types: ['Chain Snatching', 'Stalking'],               womenScore: 60 },
  'Ondipudur':         { cases: 6,  types: ['Eve Teasing', 'Vehicle Theft'],              womenScore: 71 },
  'Neelambur':         { cases: 4,  types: ['Stalking'],                                  womenScore: 75 },
  'Sulur':             { cases: 3,  types: ['Eve Teasing'],                               womenScore: 83 },
  'Kinathukadavu':     { cases: 2,  types: ['Eve Teasing'],                               womenScore: 86 },
  'Perur':             { cases: 2,  types: ['Stalking'],                                  womenScore: 87 },
  'Saravanampatty':    { cases: 5,  types: ['Eve Teasing', 'Chain Snatching'],            womenScore: 79 },
  'Kalapatti':         { cases: 6,  types: ['Stalking', 'Eve Teasing'],                   womenScore: 73 },
  'Vellalore':         { cases: 13, types: ['Assault', 'Robbery'],                        womenScore: 52 },
  'Coimbatore Junction': { cases: 22, types: ['Eve Teasing', 'Chain Snatching', 'Assault'], womenScore: 38 },
  'Town Hall':         { cases: 17, types: ['Eve Teasing', 'Pickpocketing', 'Stalking'],  womenScore: 48 },
  'Nanjundapuram':     { cases: 8,  types: ['Stalking', 'Chain Snatching'],               womenScore: 65 },
  'Pappanaickenpalayam': { cases: 5, types: ['Eve Teasing'],                              womenScore: 77 },
  'Mettupalayam Road': { cases: 10, types: ['Chain Snatching', 'Assault'],                womenScore: 62 },
}

const recentWomenCases = [
  { area: 'Ukkadam',             type: 'Assault',        date: '18 Jun 2025', time: '9:30 PM',  status: 'FIR Filed' },
  { area: 'Coimbatore Junction', type: 'Eve Teasing',    date: '17 Jun 2025', time: '7:00 PM',  status: 'Under Investigation' },
  { area: 'Gandhipuram',         type: 'Chain Snatching',date: '16 Jun 2025', time: '8:30 PM',  status: 'FIR Filed' },
  { area: 'Podanur',             type: 'Stalking',       date: '15 Jun 2025', time: '10:00 PM', status: 'Complaint Filed' },
  { area: 'Town Hall',           type: 'Eve Teasing',    date: '14 Jun 2025', time: '6:30 PM',  status: 'Under Investigation' },
  { area: 'Ramanathapuram',      type: 'Robbery',        date: '13 Jun 2025', time: '9:00 PM',  status: 'FIR Filed' },
  { area: 'Singanallur',         type: 'Stalking',       date: '12 Jun 2025', time: '8:00 PM',  status: 'Complaint Filed' },
  { area: 'Sowripalayam',        type: 'Assault',        date: '11 Jun 2025', time: '11:00 PM', status: 'FIR Filed' },
]

export default function WomenSafety() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('map')
  const [selectedArea, setSelectedArea] = useState(null)
  const [filterType, setFilterType] = useState('all')

  const crimeTypes = ['all', 'Eve Teasing', 'Stalking', 'Assault', 'Chain Snatching', 'Robbery']

  function getWomenColor(score) {
    if (score >= 75) return '#a855f7'
    if (score >= 55) return '#f59e0b'
    return '#ff3b3b'
  }

  function getWomenLabel(score) {
    if (score >= 75) return 'Safe for Women'
    if (score >= 55) return 'Use Caution'
    return 'High Risk'
  }

  const allAreasWithWomen = coimbatoreAreas.map(function (area) {
    const w = womenCrimeData[area.name] || { cases: 0, types: [], womenScore: 80 }
    return { ...area, ...w }
  })

  const filteredCases = filterType === 'all'
    ? recentWomenCases
    : recentWomenCases.filter(function (c) { return c.type === filterType })

  const Tab = function ({ id, label, icon }) {
    return (
      <button
        onClick={function () { setActiveTab(id) }}
        style={{
          background: activeTab === id ? '#ff3b3b' : '#141414',
          color: activeTab === id ? '#fff' : '#555',
          border: '1px solid ' + (activeTab === id ? '#ff3b3b' : '#2a2a2a'),
          padding: '9px 20px', borderRadius: '8px',
          cursor: 'pointer', fontSize: '13px', fontWeight: '600',
        }}
      >
        {icon} {label}
      </button>
    )
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={function () { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#a855f7', letterSpacing: '2px' }}>👩 Women Safety Zone</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Coimbatore area safety index specifically for women</div>
        </div>
        <a href="tel:1091" style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
          📞 Women Helpline: 1091
        </a>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #1a1a1a' }}>
        {[
          { num: allAreasWithWomen.filter(function (a) { return a.womenScore >= 75 }).length, label: 'Safe Areas', color: '#a855f7' },
          { num: allAreasWithWomen.filter(function (a) { return a.womenScore < 55 }).length, label: 'High Risk Areas', color: '#ff3b3b' },
          { num: recentWomenCases.length, label: 'Cases This Month', color: '#f59e0b' },
          { num: recentWomenCases.filter(function (c) { return c.status === 'FIR Filed' }).length, label: 'FIRs Filed', color: '#4ade80' },
        ].map(function (s, i) {
          return (
            <div key={i} style={{ padding: '18px 0 18px 28px', borderRight: i < 3 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: s.color }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: '#444' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div style={{ padding: '20px 32px 0', display: 'flex', gap: '10px' }}>
        <Tab id="map"    label="Safety Map"      icon="🗺️" />
        <Tab id="cases"  label="Recent Cases"    icon="📋" />
        <Tab id="areas"  label="Area Rankings"   icon="📊" />
        <Tab id="tips"   label="Safety Tips"     icon="🛡️" />
      </div>

      <div style={{ padding: '20px 32px 40px' }}>

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>Women Safety Legend</div>
                {[
                  { color: '#a855f7', label: 'Safe for Women (75+)' },
                  { color: '#f59e0b', label: 'Use Caution (55-74)' },
                  { color: '#ff3b3b', label: 'High Risk (<55)' },
                ].map(function (l, i) {
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: l.color, flexShrink: 0 }}></div>
                      <span style={{ fontSize: '12px', color: '#888' }}>{l.label}</span>
                    </div>
                  )
                })}
              </div>

              {selectedArea && (
                <div style={{ background: '#0e0e0e', border: '1px solid #a855f744', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#a855f7', fontWeight: '700', marginBottom: '12px' }}>{selectedArea.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#555' }}>Women Safety Score</span>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: getWomenColor(selectedArea.womenScore) }}>{selectedArea.womenScore}</span>
                  </div>
                  <div style={{ background: '#141414', borderRadius: '4px', height: '4px', marginBottom: '12px' }}>
                    <div style={{ width: selectedArea.womenScore + '%', height: '4px', background: getWomenColor(selectedArea.womenScore), borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>Cases this month: <span style={{ color: '#ff3b3b', fontWeight: '700' }}>{selectedArea.cases}</span></div>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>Crime types:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedArea.types.map(function (t, i) {
                      return (
                        <span key={i} style={{ fontSize: '10px', background: '#2a0d0d', color: '#ff3b3b', padding: '3px 8px', borderRadius: '20px', fontWeight: '600' }}>{t}</span>
                      )
                    })}
                  </div>
                  <div style={{ marginTop: '12px', background: '#141414', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: '700' }}>{getWomenLabel(selectedArea.womenScore)}</div>
                  </div>
                </div>
              )}

              <div style={{ background: '#150d1f', border: '1px solid #a855f733', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: '700', marginBottom: '8px' }}>Emergency Numbers</div>
                {[
                  { num: '1091', label: 'Women Helpline' },
                  { num: '100',  label: 'Police' },
                  { num: '181',  label: 'Women in Distress' },
                  { num: '1098', label: 'Child Helpline' },
                ].map(function (h, i) {
                  return (
                    <a key={i} href={'tel:' + h.num} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none', textDecoration: 'none' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>{h.label}</span>
                      <span style={{ fontSize: '13px', color: '#a855f7', fontWeight: '700' }}>{h.num}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a', height: '520px' }}>
              <MapContainer center={[11.0168, 76.9558]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                {allAreasWithWomen.map(function (area) {
                  const color = getWomenColor(area.womenScore)
                  return (
                    <Circle
                      key={area.id}
                      center={[area.lat, area.lng]}
                      radius={750}
                      pathOptions={{ color: color, fillColor: color, fillOpacity: 0.3, weight: 2 }}
                      eventHandlers={{ click: function () { setSelectedArea(area) } }}
                    >
                      <Tooltip direction="top">
                        <div style={{ fontWeight: '700' }}>{area.name}</div>
                        <div style={{ color: color }}>Women Score: {area.womenScore}</div>
                        <div style={{ color: '#888', fontSize: '11px' }}>Cases: {area.cases}</div>
                      </Tooltip>
                    </Circle>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        )}

        {/* CASES TAB */}
        {activeTab === 'cases' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {crimeTypes.map(function (type) {
                return (
                  <button
                    key={type}
                    onClick={function () { setFilterType(type) }}
                    style={{ background: filterType === type ? '#a855f7' : '#141414', color: filterType === type ? '#fff' : '#555', border: '1px solid ' + (filterType === type ? '#a855f7' : '#2a2a2a'), padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}
                  >
                    {type === 'all' ? 'All Cases' : type}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredCases.map(function (c, i) {
                const statusColor = c.status === 'FIR Filed' ? '#4ade80' : c.status === 'Under Investigation' ? '#f59e0b' : '#60a5fa'
                const statusBg = c.status === 'FIR Filed' ? '#0d1f0d' : c.status === 'Under Investigation' ? '#1f1500' : '#0d1a30'
                return (
                  <div key={i} style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700', marginBottom: '4px' }}>{c.type}</div>
                        <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: '600' }}>📍 {c.area}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: statusBg, color: statusColor }}>{c.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#555' }}>📅 {c.date}</span>
                      <span style={{ fontSize: '12px', color: '#555' }}>🕐 {c.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* AREA RANKINGS TAB */}
        {activeTab === 'areas' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {allAreasWithWomen
              .sort(function (a, b) { return b.womenScore - a.womenScore })
              .map(function (area, i) {
                const color = getWomenColor(area.womenScore)
                return (
                  <div key={area.id} style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#333', width: '28px', flexShrink: 0 }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{area.name}</span>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: color }}>{area.womenScore}</span>
                      </div>
                      <div style={{ background: '#141414', borderRadius: '3px', height: '4px', marginBottom: '6px' }}>
                        <div style={{ width: area.womenScore + '%', height: '4px', background: color, borderRadius: '3px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: color }}>{getWomenLabel(area.womenScore)}</span>
                        <span style={{ fontSize: '11px', color: '#555' }}>{area.cases} cases</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* SAFETY TIPS TAB */}
        {activeTab === 'tips' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { icon: '📱', title: 'Save Emergency Numbers', tip: 'Save 1091 (Women Helpline), 100 (Police) and 181 on speed dial. Share your live location with a trusted friend when going out at night.', color: '#a855f7' },
              { icon: '🆘', title: 'Use CrimeRadar SOS', tip: 'Set up your SOS profile with emergency contacts. When you enter a high-risk area, your contacts will be automatically alerted with your location.', color: '#ff3b3b' },
              { icon: '🗺️', title: 'Plan Safe Routes', tip: 'Use the Safe Route Planner to avoid areas like Ukkadam, Podanur and Coimbatore Junction after 8 PM. Stick to well-lit main roads.', color: '#f59e0b' },
              { icon: '🚌', title: 'Avoid Late Night Travel', tip: 'Avoid traveling alone in Gandhipuram, Town Hall and Bus Stand areas after 9 PM. Use cab services with tracking features.', color: '#60a5fa' },
              { icon: '👥', title: 'Travel in Groups', tip: 'When visiting markets like Town Hall or Gandhipuram, travel in groups. If alone, stay on main roads and keep your phone charged.', color: '#4ade80' },
              { icon: '📷', title: 'Document Incidents', tip: 'If you witness or face harassment, use CrimeRadar\'s anonymous report feature to document the incident. Your identity is always protected.', color: '#a855f7' },
              { icon: '🚔', title: 'Know Your Police Stations', tip: 'RS Puram, Peelamedu and Saibaba Colony have the fastest police response. Save your nearest station\'s direct number.', color: '#ff3b3b' },
              { icon: '🛡️', title: 'Trust Your Instincts', tip: 'If an area feels unsafe, leave immediately. Your safety is more important than anything else. Alert someone about your whereabouts always.', color: '#f59e0b' },
            ].map(function (tip, i) {
              return (
                <div key={i} style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: tip.color + '20', border: '1px solid ' + tip.color + '44', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{tip.icon}</div>
                    <div style={{ fontSize: '14px', color: tip.color, fontWeight: '700' }}>{tip.title}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>{tip.tip}</div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}