import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import YouTubeSearchApp from './test/YoutubeSearchApp'
import YouTubeSearchMinimal from './test/YoutubeSearchMinimal'
import ReactPlayerTest from './test/ReactPlayerTest'
import QuietYouTubePlayer from './test/QuietYoutubePlayer'
import ClickToPlayYouTube from './test/ClickToPlayYouTube'

function App() {
  const [count, setCount] = useState(0)

  return 
  <>
  <YouTubeSearchApp />
 
  <YouTubeSearchMinimal />
  <ReactPlayerTest />
  <QuietYouTubePlayer/>
  <ClickToPlayYouTube />

  </>
    ;
  
}

export default App
