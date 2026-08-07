const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api/v1',
  /** When true, prefer refreshing SwiftChat MiniApp consent before login */
  swiftChatSDKEnabled: import.meta.env.VITE_SWIFTCHAT_SDK_ENABLED === 'true',
  environment: import.meta.env.MODE,
}

export default env
