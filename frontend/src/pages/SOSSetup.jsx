import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'

export default function SOSSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [contacts, setContacts] = useState([
    { name: '', email: '', phone: '' },
  ])
  const [triggerScore, setTriggerScore] = useState(60)
  const [saved, setSaved] = useState(false)

  function handleProfile(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  function handleContact(index, e) {
    const updated = contacts.map(function(c, i) {
      if (i === index) return { ...c, [e.target.name]: e.target.value }
      return c
    })
    setContacts(updated)
  }

  function addContact() {
    if (contacts.length < 5) {
      setContacts([...contacts, { name: '', email: '', phone: '' }])
    }
  }

  function removeContact(index) {
    setContacts(contacts.filter(function(_, i) { return i !== index }))
  }

  function handleSave() {
    if (!profile.name || !profile.email) {
      alert('Please fill your name and email')
      return
    }
    const validContacts = contacts.filter(function(c) { return c.name && c.email })
    if (validContacts.length === 0) {
      alert('Add at least one emergency contact')
      return
    }
    const sosData = {
      profile,
      contacts: validContacts,
      triggerScore,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('crimeradar_sos', JSON.stringify(sosData))
    setSaved(true)
  }

  const inputStyle = {
    width: '100%',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '11px 14px',
    color: '#ddd',
    fontSize: '13px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#555',
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  }

  if (saved) {
    return (
      <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '440px', width: '90%' }}>
          <div style={{ width: '72px', height: '72px', background: '#2a0d0d', border: '2px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>🆘</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#ff3b3b', marginBottom: '8px', letterSpacing: '2px' }}>SOS Activated!</div>
          <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', marginBottom: '28px' }}>
            Your SOS profile is saved. When you enter an area with safety score below <span style={{ color: '#ff3b3b', fontWeight: '700' }}>{triggerScore}</span>, alerts will be sent to you and your emergency contacts.
          </div>

          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Emergency Contacts Saved</div>
            {contacts.filter(function(c) { return c.name && c.email }).map(function(c, i) {
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ width: '32px', height: '32px', background: '#2a0d0d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{c.email}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={function() { navigate('/sos-trigger') }}
              style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
            >
              Test SOS Alert
            </button>
            <button
              onClick={function() { navigate('/') }}
              style={{ background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={function() { navigate('/') }}
          style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ff3b3b', letterSpacing: '2px' }}>🆘 SOS Emergency Alerts</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Auto-alert your contacts when you enter a dangerous area</div>
        </div>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', padding: '28px 32px 0' }}>
        {[
          { num: 1, label: 'Your Profile' },
          { num: 2, label: 'Emergency Contacts' },
          { num: 3, label: 'Alert Settings' },
        ].map(function(s, i) {
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                onClick={function() { setStep(s.num) }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: step >= s.num ? '#ff3b3b' : '#141414',
                  border: '1px solid ' + (step >= s.num ? '#ff3b3b' : '#2a2a2a'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700',
                  color: step >= s.num ? '#fff' : '#555',
                }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <div style={{ fontSize: '11px', color: step >= s.num ? '#ddd' : '#555', whiteSpace: 'nowrap' }}>{s.label}</div>
              </div>
              {i < 2 && (
                <div style={{ width: '80px', height: '1px', background: step > s.num ? '#ff3b3b' : '#2a2a2a', margin: '0 8px 20px' }}></div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '28px 32px 40px', maxWidth: '700px', margin: '0 auto' }}>

        {/* STEP 1 - Your Profile */}
        {step === 1 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>Your Details</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input name="name" value={profile.name} onChange={handleProfile} placeholder="Ariya Prakash" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Your Email *</label>
                <input name="email" type="email" value={profile.email} onChange={handleProfile} placeholder="you@gmail.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Your Phone</label>
              <input name="phone" type="tel" value={profile.phone} onChange={handleProfile} placeholder="+91 99999 99999" style={inputStyle} />
            </div>

            <div style={{ background: '#141414', border: '1px solid #2a0d0d', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.6' }}>
                Your details are stored locally on your device only. We never send your personal data to any server. SOS alerts are triggered based on area safety scores.
              </div>
            </div>

            <button
              onClick={function() {
                if (!profile.name || !profile.email) { alert('Please fill name and email'); return }
                setStep(2)
              }}
              style={{ width: '100%', background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              Next — Add Emergency Contacts →
            </button>
          </div>
        )}

        {/* STEP 2 - Emergency Contacts */}
        {step === 2 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Emergency Contacts ({contacts.length}/5)</div>
              {contacts.length < 5 && (
                <button
                  onClick={addContact}
                  style={{ background: '#141414', color: '#ff3b3b', border: '1px solid #ff3b3b44', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                >
                  + Add Contact
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {contacts.map(function(contact, index) {
                return (
                  <div key={index} style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '12px', color: '#ff3b3b', fontWeight: '600' }}>Contact {index + 1}</div>
                      {contacts.length > 1 && (
                        <button
                          onClick={function() { removeContact(index) }}
                          style={{ background: '#2a0d0d', color: '#ff3b3b', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={labelStyle}>Name *</label>
                        <input
                          name="name"
                          value={contact.name}
                          onChange={function(e) { handleContact(index, e) }}
                          placeholder="Friend name"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input
                          name="email"
                          type="email"
                          value={contact.email}
                          onChange={function(e) { handleContact(index, e) }}
                          placeholder="friend@gmail.com"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Phone (optional)</label>
                      <input
                        name="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={function(e) { handleContact(index, e) }}
                        placeholder="+91 99999 99999"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={function() { setStep(1) }}
                style={{ flex: 1, background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '13px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}
              >
                ← Back
              </button>
              <button
                onClick={function() {
                  const valid = contacts.filter(function(c) { return c.name && c.email })
                  if (valid.length === 0) { alert('Add at least one contact with name and email'); return }
                  setStep(3)
                }}
                style={{ flex: 2, background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Next — Alert Settings →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Alert Settings */}
        {step === 3 && (
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>Alert Trigger Settings</div>

            {/* Score Threshold */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Trigger SOS when safety score is below</label>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: triggerScore >= 70 ? '#f59e0b' : '#ff3b3b' }}>{triggerScore}</div>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                value={triggerScore}
                onChange={function(e) { setTriggerScore(parseInt(e.target.value)) }}
                style={{ width: '100%', accentColor: '#ff3b3b', height: '4px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#555' }}>30 (Very Alert)</span>
                <span style={{ fontSize: '11px', color: '#555' }}>80 (Cautious)</span>
              </div>
            </div>

            {/* What areas will trigger */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>Areas that will trigger SOS with your current setting:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {coimbatoreAreas
                  .filter(function(a) { return a.safeScore < triggerScore })
                  .map(function(a) {
                    return (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', background: '#141414', border: '1px solid #2a0d0d', borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#ddd' }}>{a.name}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: '#2a0d0d', color: '#ff3b3b' }}>Score {a.safeScore}</span>
                      </div>
                    )
                  })}
                {coimbatoreAreas.filter(function(a) { return a.safeScore < triggerScore }).length === 0 && (
                  <div style={{ fontSize: '13px', color: '#555', textAlign: 'center', padding: '16px' }}>No areas trigger at this score. Lower the threshold.</div>
                )}
              </div>
            </div>

            {/* Alert Message Preview */}
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Alert Message Preview</div>
              <div style={{ background: '#0b0b0b', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #ff3b3b' }}>
                <div style={{ fontSize: '13px', color: '#ff3b3b', fontWeight: '700', marginBottom: '6px' }}>🆘 CrimeRadar SOS Alert</div>
                <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.7' }}>
                  <strong style={{ color: '#ddd' }}>{profile.name || 'Your Name'}</strong> has entered a high-risk area.<br />
                  📍 Area: <strong style={{ color: '#ddd' }}>[Area Name]</strong><br />
                  ⚠️ Safety Score: <strong style={{ color: '#ff3b3b' }}>[Score] / 100</strong><br />
                  🕐 Time: <strong style={{ color: '#ddd' }}>[Current Time]</strong><br />
                  <br />
                  Recent crimes in this area include chain snatching and vehicle theft. Please check on them.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={function() { setStep(2) }}
                style={{ flex: 1, background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '13px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}
              >
                ← Back
              </button>
              <button
                onClick={handleSave}
                style={{ flex: 2, background: '#ff3b3b', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                🆘 Activate SOS System
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}