const SSO_KEY = 'ng_sso'

export function getSsoDetails() {
  try {
    return JSON.parse(localStorage.getItem(SSO_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setSsoDetails(ssoDetails) {
  localStorage.setItem(SSO_KEY, JSON.stringify(ssoDetails || {}))
  return ssoDetails || {}
}

export function clearSsoDetails() {
  localStorage.removeItem(SSO_KEY)
}

export function isSsoExpired(ssoDetails = getSsoDetails()) {
  if (!ssoDetails?.expires_at) return true
  return Date.now() >= Number(ssoDetails.expires_at) * 1000
}

/**
 * Request SwiftChat MiniApp user consent (grant_token).
 * Falls back to empty SSO when SDK is unavailable.
 */
export function getUserConsent() {
  return new Promise((resolve) => {
    const mini = typeof window !== 'undefined' ? window.MiniAppExtension : null
    if (!mini?.getUserConsent) {
      resolve({})
      return
    }
    try {
      mini.getUserConsent((data) => {
        if (data?.success && data.payload) {
          setSsoDetails(data.payload)
          resolve(data.payload)
        } else {
          resolve({})
        }
      })
    } catch {
      resolve({})
    }
  })
}
