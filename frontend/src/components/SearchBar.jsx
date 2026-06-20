import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import coimbatoreAreas from '../data/coimbatoreData'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  function handleInput(e) {
    const val = e.target.value
    setQuery(val)
    if (val.length > 1) {
      const filtered = coimbatoreAreas.filter(function(a) {
        return a.name.toLowerCase().includes(val.toLowerCase())
      })
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  function handleScan() {
    const found = coimbatoreAreas.find(function(a) {
      return a.name.toLowerCase() === query.toLowerCase()
    })
    if (found) {
      navigate('/area/' + found.id)
    } else {
      alert('Area not found. Try: RS Puram, Gandhipuram, Peelamedu...')
    }
  }

  function handleSelect(area) {
    setQuery(area.name)
    setSuggestions([])
    navigate('/area/' + area.id)
  }

  return (
    <div style={{ position: 'relative', marginBottom: '14px' }}>
      <div style={{ display: 'flex', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden' }}>
        <input
          type="text"
          placeholder="Search Coimbatore area..."
          value={query}
          onChange={handleInput}
          onKeyDown={function(e) { if (e.key === 'Enter') handleScan() }}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ccc', fontSize: '14px', padding: '14px 16px', flex: 1 }}
        />
        <button
          onClick={handleScan}
          style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '0 26px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          SCAN
        </button>
      </div>

      {suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', marginTop: '4px', zIndex: 999, overflow: 'hidden' }}>
          {suggestions.map(function(area) {
            return (
              <div
                key={area.id}
                onClick={function() { handleSelect(area) }}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#ccc', fontSize: '13px' }}>{area.name}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px',
                  background: area.safeScore >= 80 ? '#0d1f0d' : area.safeScore >= 60 ? '#1f1500' : '#2a0d0d',
                  color: area.safeScore >= 80 ? '#4ade80' : area.safeScore >= 60 ? '#f59e0b' : '#ff3b3b'
                }}>
                  {area.status} {area.safeScore}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}