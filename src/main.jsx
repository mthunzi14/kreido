import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AudioProvider } from './context/AudioContext'
import { NavigationProvider } from './context/NavigationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AudioProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </AudioProvider>
  </React.StrictMode>
)
