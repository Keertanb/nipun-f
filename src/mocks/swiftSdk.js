/**
 * TEMP SwiftChat / MiniApp stubs for local browser testing.
 * Remove or stop importing when running inside the real SwiftChat webview.
 */
export function installSwiftSdkMocks() {
  if (typeof window === 'undefined') return

  if (!window.BotExtension) {
    window.BotExtension = {
      getPayload: (cb) => cb?.({ value: 'mock-token' }),
      close: () => {},
    }
  }

  // Always ensure getUserConsent exists for local login SSO payload
  window.MiniAppExtension = {
    ...(window.MiniAppExtension || {}),
    getUserConsent:
      window.MiniAppExtension?.getUserConsent ||
      ((cb) => {
        cb?.({
          success: true,
          payload: {
            grant_token: '00000000-0000-4000-8000-000000000001',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          },
        })
      }),
    checkPermission: window.MiniAppExtension?.checkPermission || ((_perm, cb) => cb?.({ success: true, granted: true })),
    getPermission: window.MiniAppExtension?.getPermission || ((_perm, cb) => cb?.({ success: true, granted: true })),
  }

  // eslint-disable-next-line no-console
  console.info('[mocks] SwiftChat SDK stubs installed')
}
