import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AvengerProvider } from './context/AvengerContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AvengerProvider>
      <App />
    </AvengerProvider>
  </StrictMode>,
)