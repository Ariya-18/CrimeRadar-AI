import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import AreaDetail from './pages/AreaDetail'
import GetAlerts from './pages/GetAlerts'
import SOSSetup from './pages/SOSSetup'
import SOSTrigger from './pages/SOSTrigger'
import DangerZoneWatcher from './components/DangerZoneWatcher'
import SafeRoute from './pages/SafeRoute'
import Chatbot from './pages/Chatbot'
function HomePage() {
  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>
      <Navbar />
      <Ticker />
      <Hero />
      <Stats />
      <Features />
      <DangerZoneWatcher />  {/* ← add this */}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/area/:id" element={<AreaDetail />} />
        <Route path="/alerts" element={<GetAlerts />} />
        <Route path="/sos" element={<SOSSetup />} />
        <Route path="/sos-trigger" element={<SOSTrigger />} />
        <Route path="/safe-route" element={<SafeRoute />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App