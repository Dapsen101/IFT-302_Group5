import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply persisted theme (or system preference) before React mounts
try {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (stored === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} catch (e) {
  // ignore
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
