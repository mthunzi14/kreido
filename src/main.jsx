import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AudioProvider } from './context/AudioContext'
import { NavigationProvider } from './context/NavigationContext'

// Force unregister any legacy service worker to clear browser cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Legacy service worker unregistered successfully.');
          window.location.reload();
        }
      });
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AudioProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </AudioProvider>
  </React.StrictMode>
)
