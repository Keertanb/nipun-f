import env from './env'

const SSO_KEY = 'ng_sso'

/** Stable mock grant token for local/non-webview login (valid UUID). */
export const LOCAL_MOCK_SSO = {
  grant_token: '00000000-0000-4000-8000-000000000001',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
}

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

function isValidSso(sso) {
  return Boolean(sso?.grant_token && sso?.expires_at)
}

/**
 * Request SwiftChat MiniApp user consent (grant_token + expires_at).
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
        if (data?.success && data.payload && isValidSso(data.payload)) {
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

/**
 * Survey-style SSO for login:
 * - SDK enabled → refresh consent if expired, require real payload
 * - SDK disabled / local → use MiniApp mock or local fallback so backend always gets grant_token
 */
export async function ensureSsoDetailsForLogin() {
  let ssoDetails = getSsoDetails()

  if (env.swiftChatSDKEnabled) {
    if (isSsoExpired(ssoDetails) || !isValidSso(ssoDetails)) {
      ssoDetails = await getUserConsent()
    }
    if (!isValidSso(ssoDetails)) {
      throw new Error('SwiftChat SSO consent is required to sign in')
    }
    return setSsoDetails(ssoDetails)
  }

  // Local / non-SwiftChat: still send grant_token so backend can resolve mobile
  if (!isSsoExpired(ssoDetails) && isValidSso(ssoDetails)) {
    return ssoDetails
  }

  const fromSdk = await getUserConsent()
  if (isValidSso(fromSdk)) {
    return setSsoDetails(fromSdk)
  }

  const fallback = {
    grant_token: LOCAL_MOCK_SSO.grant_token,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  }
  return setSsoDetails(fallback)
}
