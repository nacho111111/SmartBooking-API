import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ActionProvider } from "./context/ActionContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ActionProvider>
      <App />
    </ActionProvider>
  </StrictMode>,
)
