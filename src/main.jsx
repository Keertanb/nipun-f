import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import env from './helpers/env'
import { installSwiftSdkMocks } from './mocks/swiftSdk'

if (env.useMocks || !env.swiftChatSDKEnabled) {
  // Local browser: stub SDK when not inside SwiftChat webview
  installSwiftSdkMocks()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
