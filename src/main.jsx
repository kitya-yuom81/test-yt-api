import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import YouTubeSearchApp from './test/YoutubeSearchApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Your main app */}
    <App />

    {/* YouTube search app */}
    <YouTubeSearchApp />
  </StrictMode>,
)
