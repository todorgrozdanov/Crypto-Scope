import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import {GlobalProvider} from "./GlobalContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <GlobalProvider>
              <App />
          </GlobalProvider>
      </BrowserRouter>
  </StrictMode>,
)
