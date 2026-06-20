import SearchBar from './SearchBar'
import SafetyPanel from './SafetyPanel'

export default function Hero() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '500px', background: '#0b0b0b' }}>

      <div style={{ padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '24px', height: '2px', background: '#ff3b3b', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#ff3b3b', letterSpacing: '2px' }}>AI SAFETY INTELLIGENCE</span>
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '72px', lineHeight: '0.95', color: '#fff', marginBottom: '20px', letterSpacing: '2px' }}>
          Know<br />
          Your<br />
          <span style={{ color: '#ff3b3b' }}>Safe</span><br />
          Zone.
        </h1>

        <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.8', maxWidth: '380px', marginBottom: '30px' }}>
          Real crime data + AI predictions + community alerts.
          Ask "Is it safe at 10pm near me?" and get an instant answer.
        </p>

        <SearchBar />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {['Chennai', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'].map(function(city) {
            return (
              <span key={city} style={{ background: '#141414', border: '1px solid #222', color: '#555', fontSize: '12px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer' }}>
                {city}
              </span>
            )
          })}
        </div>

      </div>

      <div style={{ background: '#0e0e0e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <SafetyPanel />
      </div>

    </section>
  )
}