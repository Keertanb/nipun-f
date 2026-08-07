import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import env from './helpers/env'
import { installSwiftSdkMocks } from './mocks/swiftSdk'

if (env.useMocks || !env.swiftChatSDKEnabled || !window.MiniAppExtension?.getUserConsent) {
  // Local browser / missing SDK: stub MiniApp so login can send grant_token
  installSwiftSdkMocks()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
