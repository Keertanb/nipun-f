const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api/v1',
  /** When true, call MiniAppExtension.getUserConsent before send-otp */
  swiftChatSDKEnabled: import.meta.env.VITE_SWIFTCHAT_SDK_ENABLED === 'true',
  /** When true, install local MiniAppExtension / BotExtension stubs */
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  environment: import.meta.env.MODE,
}

export default env
