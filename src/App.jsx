import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import YouTubeSearchApp from './test/YoutubeSearchApp'
import YouTubeSearchMinimal from './test/YoutubeSearchMinimal'
import ReactPlayerTest from './test/ReactPlayerTest'
function App() {
  const [count, setCount] = useState(0)

  return 
  <>
  <YouTubeSearchApp />
 
  <YouTubeSearchMinimal />
  <ReactPlayerTest />
  </>
    ;
  
}

export default App
