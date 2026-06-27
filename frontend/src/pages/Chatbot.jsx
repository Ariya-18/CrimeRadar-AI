import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'

function getAIResponse(message) {
  const msg = message.toLowerCase()

  const areaMatch = coimbatoreAreas.find(function(a) {
    return msg.includes(a.name.toLowerCase())
  })

  if (areaMatch) {
    const score = areaMatch.safeScore
    const status = score >= 80 ? 'SAFE' : score >= 60 ? 'CAUTION' : 'DANGER'
    const crimes = areaMatch.recentCrimes.map(function(c) { return c.type }).join(', ')
    const emoji = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '🚨'

    if (msg.includes('night') || msg.includes('10pm') || msg.includes('pm') || msg.includes('safe')) {
      return emoji + ' ' + areaMatch.name + ' has a safety score of ' + score + '/100 — ' + status + '.\n\n' +
        '🕐 Safe hours: ' + areaMatch.safeTime + '\n' +
        '⚠️ Avoid: ' + areaMatch.unsafeTime + '\n\n' +
        'Recent crimes: ' + crimes + '\n\n' +
        (score < 60 ? '🚨 I would NOT recommend going here at night.' : score < 80 ? '⚠️ Be alert and avoid isolated areas at night.' : '✅ Generally safe but stay aware of your surroundings.')
    }

    return emoji + ' ' + areaMatch.name + ' Safety Report:\n\n' +
      '📊 Safety Score: ' + score + '/100 (' + status + ')\n' +
      '✅ Safe Time: ' + areaMatch.safeTime + '\n' +
      '⚠️ Avoid: ' + areaMatch.unsafeTime + '\n' +
      '🚔 Recent Crimes: ' + crimes + '\n\n' +
      'Total incidents reported: ' + areaMatch.recentCrimes.length
  }

  if (msg.includes('most dangerous') || msg.includes('worst') || msg.includes('unsafe')) {
    const sorted = [...coimbatoreAreas].sort(function(a, b) { return a.safeScore - b.safeScore }).slice(0, 5)
    return '🚨 Top 5 Most Dangerous Areas in Coimbatore:\n\n' +
      sorted.map(function(a, i) { return (i + 1) + '. ' + a.name + ' — Score: ' + a.safeScore }).join('\n') +
      '\n\nAvoid these areas especially after dark.'
  }

  if (msg.includes('safest') || msg.includes('best area') || msg.includes('safe area')) {
    const sorted = [...coimbatoreAreas].sort(function(a, b) { return b.safeScore - a.safeScore }).slice(0, 5)
    return '✅ Top 5 Safest Areas in Coimbatore:\n\n' +
      sorted.map(function(a, i) { return (i + 1) + '. ' + a.name + ' — Score: ' + a.safeScore }).join('\n') +
      '\n\nThese areas have the lowest crime rates and best safety records.'
  }

  if (msg.includes('sos') || msg.includes('emergency') || msg.includes('help')) {
    return '🆘 EMERGENCY CONTACTS:\n\n' +
      '🚔 Police: 100\n' +
      '👩 Women Helpline: 1091\n' +
      '🚑 Ambulance: 108\n' +
      '🔥 Fire: 101\n' +
      '👩 Women in Distress: 181\n\n' +
      'Use the SOS feature in CrimeRadar to auto-alert your emergency contacts!'
  }

  if (msg.includes('chain') || msg.includes('snatching')) {
    const areas = coimbatoreAreas.filter(function(a) {
      return a.recentCrimes.some(function(c) { return c.type.toLowerCase().includes('chain') })
    })
    return '⛓️ Areas with recent chain snatching cases:\n\n' +
      areas.map(function(a) { return '• ' + a.name + ' (Score: ' + a.safeScore + ')' }).join('\n') +
      '\n\nTip: Avoid wearing heavy gold jewelry in low-score areas especially at night.'
  }

  if (msg.includes('vehicle') || msg.includes('bike') || msg.includes('car theft')) {
    const areas = coimbatoreAreas.filter(function(a) {
      return a.recentCrimes.some(function(c) { return c.type.toLowerCase().includes('vehicle') })
    })
    return '🚗 Areas with recent vehicle theft:\n\n' +
      areas.slice(0, 6).map(function(a) { return '• ' + a.name }).join('\n') +
      '\n\nTip: Always lock your vehicle and park in well-lit areas.'
  }

  if (msg.includes('night') || msg.includes('after dark') || msg.includes('late')) {
    const dangerous = coimbatoreAreas.filter(function(a) { return a.safeScore < 60 })
    return '🌙 Areas to AVOID at night in Coimbatore:\n\n' +
      dangerous.map(function(a) { return '🚨 ' + a.name + ' — Avoid after ' + a.unsafeTime.split('–')[0] }).join('\n') +
      '\n\nAlways share your live location with someone when traveling at night.'
  }

  if (msg.includes('women') || msg.includes('girl') || msg.includes('female')) {
    return '👩 Women Safety in Coimbatore:\n\n' +
      '✅ Safest areas for women: Kovaipudur, Saibaba Colony, Kinathukadavu\n' +
      '⚠️ Use caution: Gandhipuram, Town Hall, Coimbatore Junction after 8PM\n' +
      '🚨 Avoid alone at night: Ukkadam, Podanur, Sowripalayam\n\n' +
      '📱 Women Helpline: 1091\n' +
      '🆘 Use our SOS feature to stay protected!'
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return '👋 Hello! I am CrimeRadar AI.\n\nI can help you with:\n• Safety score of any Coimbatore area\n• Best and worst areas to visit\n• Crime patterns and types\n• Women safety information\n• Night travel advice\n• Emergency contacts\n\nJust ask me anything like:\n"Is RS Puram safe at night?"\n"Which is the most dangerous area?"\n"Women safety in Coimbatore"'
  }

  if (msg.includes('coimbatore') || msg.includes('city')) {
    const avg = Math.round(coimbatoreAreas.reduce(function(s, a) { return s + a.safeScore }, 0) / coimbatoreAreas.length)
    const safe = coimbatoreAreas.filter(function(a) { return a.safeScore >= 80 }).length
    return '🏙️ Coimbatore City Safety Overview:\n\n' +
      '📊 Average Safety Score: ' + avg + '/100\n' +
      '✅ Safe Areas: ' + safe + '/' + coimbatoreAreas.length + '\n' +
      '🕐 Peak crime time: 8PM - 12AM\n' +
      '📍 Most monitored: 30 major areas\n\n' +
      'Overall Coimbatore is a moderately safe city. Take extra precautions in central areas after dark.'
  }

  return '🤖 I didn\'t understand that fully. Try asking:\n\n' +
    '• "Is [area name] safe?"\n' +
    '• "Most dangerous areas"\n' +
    '• "Safest places in Coimbatore"\n' +
    '• "Women safety"\n' +
    '• "Night travel tips"\n' +
    '• "Emergency contacts"\n\n' +
    'I know about all 30 major areas in Coimbatore!'
}

export default function Chatbot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '👋 Hi! I am CrimeRadar AI.\n\nAsk me anything about safety in Coimbatore:\n• "Is RS Puram safe at night?"\n• "Most dangerous areas"\n• "Women safety tips"\n• "Emergency contacts"',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(function() {
    bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendMessage() {
    const text = input.trim()
    if (!text) return

    const userMsg = { role: 'user', text: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(function(prev) { return [...prev, userMsg] })
    setInput('')
    setTyping(true)

    setTimeout(function() {
      const response = getAIResponse(text)
      setMessages(function(prev) { return [...prev, { role: 'ai', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] })
      setTyping(false)
    }, 900)
  }

  const quickQuestions = [
    'Is RS Puram safe at night?',
    'Most dangerous areas',
    'Safest places to live',
    'Women safety tips',
    'Emergency contacts',
    'Vehicle theft areas',
  ]

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={function() { navigate('/') }} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
        <div style={{ width: '38px', height: '38px', background: '#1a0d0d', border: '2px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🤖</div>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '1px' }}>CrimeRadar AI Assistant</div>
          <div style={{ fontSize: '11px', color: '#4ade80' }}>● Online — Knows all 30 Coimbatore areas</div>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {quickQuestions.map(function(q, i) {
          return (
            <button
              key={i}
              onClick={function() { setInput(q); }}
              style={{ background: '#141414', color: '#888', border: '1px solid #2a2a2a', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {q}
            </button>
          )
        })}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px', width: '100%', margin: '0 auto' }}>
        {messages.map(function(msg, i) {
          const isAI = msg.role === 'ai'
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: isAI ? 'flex-start' : 'flex-end' }}>
              {isAI && (
                <div style={{ width: '32px', height: '32px', background: '#1a0d0d', border: '1px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, marginTop: '4px' }}>🤖</div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  background: isAI ? '#0e0e0e' : '#ff3b3b',
                  border: isAI ? '1px solid #1a1a1a' : 'none',
                  borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: isAI ? '#ccc' : '#fff',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '10px', color: '#333', marginTop: '4px', textAlign: isAI ? 'left' : 'right' }}>{msg.time}</div>
              </div>
            </div>
          )
        })}

        {typing && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', background: '#1a0d0d', border: '1px solid #ff3b3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
            <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '4px 14px 14px 14px', padding: '14px 18px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(function(d) {
                return <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#555', animation: 'pulse 1.2s ease-in-out ' + (d * 0.2) + 's infinite' }}></div>
              })}
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }`}</style>

      {/* Input */}
      <div style={{ padding: '16px', borderTop: '1px solid #1a1a1a', background: '#0e0e0e' }}>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '760px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Ask about any Coimbatore area safety..."
            value={input}
            onChange={function(e) { setInput(e.target.value) }}
            onKeyDown={function(e) { if (e.key === 'Enter') sendMessage() }}
            style={{ flex: 1, background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px 16px', color: '#ddd', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={sendMessage}
            style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}