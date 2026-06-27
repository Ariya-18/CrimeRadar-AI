import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas, { EMERGENCY_NUMBERS } from '../data/coimbatoreData'

function buildSystemPrompt() {
  const areasSummary = coimbatoreAreas.map((a) =>
    `- ${a.name}: safeScore=${a.safeScore}, status=${a.status}, safeTime="${a.safeTime}", unsafeTime="${a.unsafeTime}", police="${a.police.station}" (${a.police.phone}, ${a.police.distance}), hospital="${a.hospital.name}" (${a.hospital.phone}), crimes=[${a.recentCrimes.map((c) => c.type).join(', ')}]`
  ).join('\n')

  return `You are CrimeRadar AI, a safety assistant for Coimbatore, Tamil Nadu. Be concise, warm, and direct. Never be alarmist.

Area data:
${areasSummary}

Score guide: 80–100=Safe, 60–79=Caution, below 60=Danger.
Emergency: Police=100, Ambulance=108, Women Helpline=1091.

Rules:
- Keep answers short (2–4 sentences) unless a list is clearly better.
- For area questions: mention score, safe/unsafe times, nearest police.
- If someone is in danger: give emergency numbers immediately.
- Only use data above — never make up crime stats.
- Respond in the same language the user writes in.`
}

const SUGGESTIONS = [
  'Is Ukkadam safe at night?',
  'Which areas should I avoid after 9pm?',
  'Nearest police to Gandhipuram?',
  'Safest areas in Coimbatore?',
  'What crimes happen in Podanur?',
  'Is RS Puram safe for evening walk?',
]

// Simple markdown-like renderer
function renderText(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ color: '#fff', fontWeight: '600' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    // Bullet
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <span style={{ color: '#ff3b3b', flexShrink: 0, marginTop: '2px' }}>•</span>
          <span>{parts.slice(1)}</span>
        </div>
      )
    }
    if (line === '') return <div key={i} style={{ height: '8px' }} />
    return <div key={i}>{parts}</div>
  })
}

export default function Chatbot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const abortRef   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  async function sendMessage(text) {
    const userText = (text || input).trim()
    if (!userText || streaming) return

    setInput('')
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setStreaming(true)
    setStreamingText('')

    abortRef.current = new AbortController()

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          stream: true,
          system: buildSystemPrompt(),
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.delta?.text || ''
            if (delta) {
              fullText += delta
              setStreamingText(fullText)
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: fullText }])
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages([...newMessages, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }])
      }
    }

    setStreaming(false)
    setStreamingText('')
    inputRef.current?.focus()
  }

  function stopStreaming() {
    abortRef.current?.abort()
    if (streamingText) {
      setMessages((prev) => [...prev, { role: 'assistant', content: streamingText }])
    }
    setStreaming(false)
    setStreamingText('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0b0b0b', borderBottom: '1px solid #1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'transparent', color: '#555', border: '1px solid #2a2a2a', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#ff3b3b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>CrimeRadar AI</div>
            <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
              30 areas monitored
            </div>
          </div>
        </div>
        {!isEmpty && (
          <button onClick={() => setMessages([])}
            style={{ marginLeft: 'auto', background: 'transparent', color: '#444', border: 'none', fontSize: '12px', cursor: 'pointer' }}>
            New chat
          </button>
        )}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#ff3b3b', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#fff', letterSpacing: '2px', marginBottom: '8px', textAlign: 'center' }}>
            Crime<span style={{ color: '#ff3b3b' }}>Radar</span> AI
          </h1>
          <p style={{ color: '#555', fontSize: '15px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6', marginBottom: '36px' }}>
            Ask me anything about safety in Coimbatore — area scores, crime patterns, safe routes, or nearest police.
          </p>

          {/* Suggestion grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '600px' }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                style={{
                  background: '#141414', border: '1px solid #222', borderRadius: '12px',
                  padding: '14px 16px', color: '#888', fontSize: '13px', cursor: 'pointer',
                  textAlign: 'left', lineHeight: '1.4', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff3b3b44'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#1a1a1a' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#141414' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {!isEmpty && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '0' }}>

            {messages.map((msg, i) => (
              <div key={i} style={{
                padding: '20px 0',
                borderBottom: '1px solid #111',
                display: 'flex',
                gap: '16px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                  {msg.role === 'assistant'
                    ? <div style={{ width: '32px', height: '32px', background: '#ff3b3b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
                    : <div style={{ width: '32px', height: '32px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#888' }}>👤</div>
                  }
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#444', marginBottom: '8px', fontWeight: '500' }}>
                    {msg.role === 'assistant' ? 'CrimeRadar AI' : 'You'}
                  </div>
                  <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.75' }}>
                    {renderText(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streaming && (
              <div style={{ padding: '20px 0', display: 'flex', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: '32px', height: '32px', background: '#ff3b3b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#444', marginBottom: '8px', fontWeight: '500' }}>CrimeRadar AI</div>
                  <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.75' }}>
                    {streamingText
                      ? <>{renderText(streamingText)}<span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#ff3b3b', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 0.7s infinite' }} /></>
                      : <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingTop: '4px' }}>
                          {[0,1,2].map((i) => <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#333', animation: `bounce 1s ${i*0.15}s infinite` }} />)}
                        </div>
                    }
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: '16px 24px 24px', background: '#0b0b0b' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px',
            display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '12px 14px',
            boxShadow: '0 0 0 1px #1a1a1a',
            transition: 'border-color 0.15s',
          }}
            onFocusCapture={(e) => e.currentTarget.style.borderColor = '#ff3b3b44'}
            onBlurCapture={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              onKeyDown={handleKey}
              placeholder="Ask about any area in Coimbatore..."
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#ddd', fontSize: '15px', lineHeight: '1.5', resize: 'none',
                fontFamily: 'inherit', maxHeight: '160px', overflowY: 'auto',
                padding: '2px 0',
              }}
            />

            {/* Stop / Send button */}
            {streaming
              ? <button onClick={stopStreaming}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#aaa', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ⏹
                </button>
              : <button onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: input.trim() ? '#ff3b3b' : '#1a1a1a',
                    border: 'none', color: '#fff', fontSize: '16px',
                    cursor: input.trim() ? 'pointer' : 'default', transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  ↑
                </button>
            }
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#2a2a2a', marginTop: '10px' }}>
            Powered by Claude AI · CrimeRadar uses AI-generated insights, not a substitute for emergency services
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-4px);opacity:1} }
      `}</style>
    </div>
  )
}