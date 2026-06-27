import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'

export default function ReportCrime() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    crimeType: '',
    area: '',
    date: '',
    time: '',
    description: '',
    severity: '',
    anonymous: true,
    name: '',
    phone: '',
    witnessCount: '1',
    weaponInvolved: false,
    vehicleInvolved: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [userArea, setUserArea] = useState('')

  const crimeTypes = [
    { id: 'eve_teasing',     label: 'Eve Teasing',      icon: '😡' },
    { id: 'chain_snatching', label: 'Chain Snatching',  icon: '⛓️' },
    { id: 'vehicle_theft',   label: 'Vehicle Theft',    icon: '🚗' },
    { id: 'robbery',         label: 'Robbery',          icon: '🔫' },
    { id: 'assault',         label: 'Assault',          icon: '👊' },
    { id: 'stalking',        label: 'Stalking',         icon: '👁️' },
    { id: 'drug_activity',   label: 'Drug Activity',    icon: '💊' },
    { id: 'pickpocketing',   label: 'Pickpocketing',    icon: '👜' },
    { id: 'accident',        label: 'Accident',         icon: '🚑' },
    { id: 'other',           label: 'Other',            icon: '📋' },
  ]

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(function(prev) { return { ...prev, [e.target.name]: val } })
  }

  function detectLocation() {
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        let closest = null
        let minDist = Infinity
        coimbatoreAreas.forEach(function(area) {
          const dist = Math.sqrt(Math.pow(area.lat - lat, 2) + Math.pow(area.lng - lng, 2))
          if (dist < minDist) { minDist = dist; closest = area }
        })
        if (closest) {
          setForm(function(prev) { return { ...prev, area: closest.name } })
          setUserArea(closest.name)
        }
        setLocationLoading(false)
      },
      function() { setLocationLoading(false) }
    )
  }

  function handleSubmit() {
    if (!form.crimeType || !form.area || !form.severity) {
      alert('Please fill crime type, area and severity')
      return
    }
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', background: '#141414', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '11px 14px', color: '#ddd',
    fontSize: '13px', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontSize: '11px', color: '#555',
    marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase',
  }

  if (submitted) {
    const reportId = 'CR' + Date.now().toString().slice(-6)
    return (
      <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '440px', width: '90%' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#4ade80', marginBottom: '8px', letterSpacing: '2px' }}>Report Submitted!</div>
          <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            Your report has been submitted anonymously. This will help update the safety score for <span style={{ color: '#fff' }}>{form.area}</span>.
          </div>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '10px' }}>REPORT ID</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ff3b3b', letterSpacing: '3px' }}>{reportId}</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>Save this for reference</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={function() { setSubmitted(false); setStep(1); setForm({ crimeType: '', area: '', date: '', time: '', description: '', severity: '', anonymous: true, name: '', phone: '', witnessCount: '1', weaponInvolved: false, vehicleInvolved: false }) }} style={{ background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              Report Another
            </button>
            <button onClick={function() { navigate('/') }} style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={function() { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#fff', letterSpacing: '1px' }}>📋 Report a Crime</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Anonymous and secure — your identity is always protected</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', padding: '24px 32px 0' }}>
        {['Crime Details', 'Location & Time', 'Submit'].map(function(s, i) {
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= i + 1 ? '#ff3b3b' : '#141414', border: '1px solid ' + (step >= i + 1 ? '#ff3b3b' : '#2a2a2a'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: step >= i + 1 ? '#fff' : '#555' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: '11px', color: step >= i + 1 ? '#ddd' : '#555', whiteSpace: 'nowrap' }}>{s}</div>
              </div>
              {i < 2 && <div style={{ width: '80px', height: '1px', background: step > i + 1 ? '#ff3b3b' : '#2a2a2a', margin: '0 8px 20px' }}></div>}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '24px 32px 40px', maxWidth: '680px', margin: '0 auto' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>What happened?</div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Crime Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {crimeTypes.map(function(ct) {
                  return (
                    <div
                      key={ct.id}
                      onClick={function() { setForm(function(p) { return { ...p, crimeType: ct.label } }) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: form.crimeType === ct.label ? '#1a0d0d' : '#141414', border: '1px solid ' + (form.crimeType === ct.label ? '#ff3b3b' : '#222'), borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '18px' }}>{ct.icon}</span>
                      <span style={{ fontSize: '13px', color: form.crimeType === ct.label ? '#ff3b3b' : '#888', fontWeight: '600' }}>{ct.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Severity *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { val: 'low',    label: 'Low',    color: '#4ade80', desc: 'Minor incident' },
                  { val: 'medium', label: 'Medium', color: '#f59e0b', desc: 'Moderate threat' },
                  { val: 'high',   label: 'High',   color: '#ff3b3b', desc: 'Serious crime' },
                ].map(function(s) {
                  return (
                    <div
                      key={s.val}
                      onClick={function() { setForm(function(p) { return { ...p, severity: s.val } }) }}
                      style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: form.severity === s.val ? s.color + '20' : '#141414', border: '1px solid ' + (form.severity === s.val ? s.color : '#222') }}
                    >
                      <div style={{ fontSize: '13px', color: s.color, fontWeight: '700', marginBottom: '2px' }}>{s.label}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{s.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened in detail..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div
                onClick={function() { setForm(function(p) { return { ...p, weaponInvolved: !p.weaponInvolved } }) }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: form.weaponInvolved ? '#2a0d0d' : '#141414', border: '1px solid ' + (form.weaponInvolved ? '#ff3b3b' : '#222'), borderRadius: '8px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '18px' }}>🔪</span>
                <span style={{ fontSize: '12px', color: form.weaponInvolved ? '#ff3b3b' : '#666', fontWeight: '600' }}>Weapon Involved</span>
              </div>
              <div
                onClick={function() { setForm(function(p) { return { ...p, vehicleInvolved: !p.vehicleInvolved } }) }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: form.vehicleInvolved ? '#2a0d0d' : '#141414', border: '1px solid ' + (form.vehicleInvolved ? '#ff3b3b' : '#222'), borderRadius: '8px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '18px' }}>🚗</span>
                <span style={{ fontSize: '12px', color: form.vehicleInvolved ? '#ff3b3b' : '#666', fontWeight: '600' }}>Vehicle Involved</span>
              </div>
            </div>

            <button
              onClick={function() {
                if (!form.crimeType || !form.severity) { alert('Select crime type and severity'); return }
                setStep(2)
              }}
              style={{ width: '100%', background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              Next → Location & Time
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>Where and When?</div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Area / Location *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select name="area" value={form.area} onChange={handleChange} style={{ ...inputStyle, flex: 1 }}>
                  <option value="">-- Select Area --</option>
                  {coimbatoreAreas.map(function(a) {
                    return <option key={a.id} value={a.name}>{a.name}</option>
                  })}
                </select>
                <button
                  onClick={detectLocation}
                  style={{ background: '#1a3a6e', color: '#60a5fa', border: '1px solid #2a4a8e', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}
                >
                  {locationLoading ? '...' : '📍 Auto'}
                </button>
              </div>
              {userArea && <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px' }}>✓ Auto-detected: {userArea}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Time *</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Number of Witnesses</label>
              <select name="witnessCount" value={form.witnessCount} onChange={handleChange} style={inputStyle}>
                {['0', '1', '2', '3', '4', '5+'].map(function(n) { return <option key={n} value={n}>{n}</option> })}
              </select>
            </div>

            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>Report Anonymously</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>Your identity will never be revealed</div>
                </div>
                <div
                  onClick={function() { setForm(function(p) { return { ...p, anonymous: !p.anonymous } }) }}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.anonymous ? '#ff3b3b' : '#2a2a2a', position: 'relative', cursor: 'pointer' }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: form.anonymous ? '23px' : '3px', transition: 'left 0.2s' }}></div>
                </div>
              </div>

              {!form.anonymous && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid #222' }}>
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Optional" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Optional" style={inputStyle} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={function() { setStep(1) }} style={{ flex: 1, background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '13px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
              <button
                onClick={function() {
                  if (!form.area) { alert('Please select area'); return }
                  setStep(3)
                }}
                style={{ flex: 2, background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Next → Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Review */}
        {step === 3 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>Review & Submit</div>

            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
              {[
                { label: 'Crime Type',  val: form.crimeType },
                { label: 'Severity',    val: form.severity.toUpperCase() },
                { label: 'Area',        val: form.area },
                { label: 'Date',        val: form.date || 'Not specified' },
                { label: 'Time',        val: form.time || 'Not specified' },
                { label: 'Witnesses',   val: form.witnessCount },
                { label: 'Weapon',      val: form.weaponInvolved ? 'Yes' : 'No' },
                { label: 'Vehicle',     val: form.vehicleInvolved ? 'Yes' : 'No' },
                { label: 'Submitted as', val: form.anonymous ? 'Anonymous' : form.name || 'Anonymous' },
              ].map(function(row, i) {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{row.val}</span>
                  </div>
                )
              })}
              {form.description && (
                <div style={{ paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Description</div>
                  <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>{form.description}</div>
                </div>
              )}
            </div>

            <div style={{ background: '#0d1f0d', border: '1px solid #4ade8033', borderRadius: '10px', padding: '12px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>🔒</span>
              <span style={{ fontSize: '12px', color: '#4ade80' }}>Your report is encrypted and submitted anonymously. We never store personal data.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={function() { setStep(2) }} style={{ flex: 1, background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '13px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
              <button onClick={handleSubmit} style={{ flex: 2, background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                📋 Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}