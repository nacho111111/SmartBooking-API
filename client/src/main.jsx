import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner';
import './index.css'
import App from './App.jsx'
import { ActionProvider } from "./context/ActionContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ActionProvider>
      <Toaster position="bottom-right" richColors closeButton />
      <App />
    </ActionProvider>
  </StrictMode>,
)
