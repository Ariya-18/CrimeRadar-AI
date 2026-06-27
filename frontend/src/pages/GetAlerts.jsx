import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import coimbatoreAreas from '../data/coimbatoreData'
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from '../utils/emailConfig'

export default function GetAlerts() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    severity: 'all',
    alertType: 'both',
  })
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.area) {
      alert('Please fill name, email and area')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    try {
      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        {
          to_name:   form.name,
          to_email:  form.email,
          subject:   `✅ CrimeRadar Alerts Activated for ${form.area}`,
          message:   `Hi ${form.name},\n\nYour safety alerts are now active!\n\nArea: ${form.area}\nAlert type: ${form.alertType === 'both' ? 'Email & SMS' : form.alertType}\nSeverity: ${form.severity}\n\nYou will be notified when crimes are reported in ${form.area}.\n\nStay safe!\n— CrimeRadar`,
          maps_link: '',
          user_name: form.name,
        },
        EMAIL_PUBLIC_KEY
      )
    } catch (err) {
      console.error('Email failed:', err)
      setErrorMsg('Could not send confirmation email. Check your EmailJS keys in emailConfig.js')
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ width: '64px', height: '64px', background: '#0d1f0d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✅</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#4ade80', marginBottom: '8px' }}>Alerts Activated!</div>
          <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>
            You will receive safety alerts for <span style={{ color: '#fff', fontWeight: '600' }}>{form.area}</span> via {form.alertType === 'both' ? 'Email & SMS' : form.alertType === 'email' ? 'Email' : 'SMS'}.
          </div>

          {errorMsg && (
            <div style={{ background: '#2a1a00', border: '1px solid #f59e0b44', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#f59e0b', textAlign: 'left' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {!errorMsg && (
            <div style={{ background: '#0d1f0d', border: '1px solid #4ade8044', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: '#4ade80' }}>
              📧 Confirmation email sent to {form.email}
            </div>
          )}

          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Alert Summary</div>
            {[
              ['Name',     form.name],
              ['Email',    form.email],
              ['Area',     form.area],
              ['Severity', form.severity],
            ].map(function ([label, value]) {
              return (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#ddd', textTransform: 'capitalize' }}>{value}</span>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={function () { setSubmitted(false); setErrorMsg('') }}
              style={{ background: '#141414', color: '#aaa', border: '1px solid #2a2a2a', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              Add Another
            </button>
            <button
              onClick={function () { navigate('/') }}
              style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={function () { navigate('/') }}
          style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#fff', letterSpacing: '1px' }}>Get Safety Alerts</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Be notified when crime is reported near your area</div>
        </div>
      </div>

      <div style={{ padding: '40px 32px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Form card */}
        <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>Alert Setup</div>

          {/* Name */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px' }}>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name"
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: '#ddd', fontSize: '14px', outline: 'none' }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px' }}>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: '#ddd', fontSize: '14px', outline: 'none' }} />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px' }}>Phone Number (optional)</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999"
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: '#ddd', fontSize: '14px', outline: 'none' }} />
          </div>

          {/* Area */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px' }}>Select Area *</label>
            <select name="area" value={form.area} onChange={handleChange}
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: form.area ? '#ddd' : '#555', fontSize: '14px', outline: 'none' }}>
              <option value="">-- Choose Coimbatore Area --</option>
              {coimbatoreAreas.map(function (a) {
                return <option key={a.id} value={a.name}>{a.name} — Score {a.safeScore}</option>
              })}
            </select>
          </div>

          {/* Severity */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '10px' }}>Alert me for severity</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { val: 'all',    label: 'All Crimes', color: '#aaa' },
                { val: 'high',   label: 'High Only',  color: '#ff3b3b' },
                { val: 'medium', label: 'Medium Only', color: '#f59e0b' },
              ].map(function (s) {
                return (
                  <div key={s.val} onClick={function () { setForm({ ...form, severity: s.val }) }}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: form.severity === s.val ? '#1a1a1a' : '#141414', border: `1px solid ${form.severity === s.val ? s.color : '#2a2a2a'}` }}>
                    <div style={{ fontSize: '13px', color: s.color, fontWeight: '600' }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Alert type */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '10px' }}>Alert via</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { val: 'email', label: '📧 Email' },
                { val: 'sms',   label: '📱 SMS' },
                { val: 'both',  label: '🔔 Both' },
              ].map(function (t) {
                return (
                  <div key={t.val} onClick={function () { setForm({ ...form, alertType: t.val }) }}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: form.alertType === t.val ? '#1a1a1a' : '#141414', border: `1px solid ${form.alertType === t.val ? '#ff3b3b' : '#2a2a2a'}` }}>
                    <div style={{ fontSize: '13px', color: form.alertType === t.val ? '#fff' : '#555', fontWeight: '600' }}>{t.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{ background: '#2a0d0d', border: '1px solid #ff3b3b44', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#ff3b3b' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: '100%', background: submitting ? '#8a2020' : '#ff3b3b', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: submitting ? 'default' : 'pointer' }}
          >
            {submitting ? '📡 Sending...' : 'Activate Alerts 🔔'}
          </button>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* How it works */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px', fontWeight: '600' }}>How It Works</div>
            {[
              { icon: '📍', title: 'Choose Your Area',  desc: 'Select any of 30 Coimbatore areas to monitor' },
              { icon: '⚙️', title: 'Set Severity',      desc: 'Get alerted for all crimes or only high severity' },
              { icon: '🔔', title: 'Instant Alerts',    desc: 'Receive email the moment a crime is reported' },
              { icon: '🛡️', title: 'Stay Safe',        desc: 'Make informed decisions about when and where to go' },
            ].map(function (item, i) {
              return (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#141414', border: '1px solid #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>{item.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* High risk areas */}
          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '600' }}>High Risk Areas</div>
            {coimbatoreAreas.filter(function (a) { return a.safeScore < 60 }).map(function (a) {
              return (
                <div key={a.id} onClick={function () { setForm({ ...form, area: a.name }) }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#141414', border: '1px solid #2a0d0d', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#ddd' }}>{a.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: '#2a0d0d', color: '#ff3b3b' }}>Score {a.safeScore}</span>
                </div>
              )
            })}
            <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Click area to auto-select</div>
          </div>
        </div>
      </div>
    </div>
  )
}