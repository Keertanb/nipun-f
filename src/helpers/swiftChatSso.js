const SSO_KEY = "ng_sso";

export function getSsoDetails() {
  try {
    return JSON.parse(localStorage.getItem(SSO_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setSsoDetails(ssoDetails) {
  localStorage.setItem(SSO_KEY, JSON.stringify(ssoDetails || {}));
  return ssoDetails || {};
}

export function clearSsoDetails() {
  localStorage.removeItem(SSO_KEY);
}

export function isSsoExpired(ssoDetails = getSsoDetails()) {
  if (!ssoDetails?.expires_at) return true;
  return Date.now() >= Number(ssoDetails.expires_at) * 1000;
}

function isValidSso(sso) {
  return Boolean(sso?.grant_token && sso?.expires_at);
}

/**
 * Request SwiftChat MiniApp user consent (grant_token + expires_at from SDK only).
 */
export function getUserConsent() {
  return new Promise((resolve, reject) => {
    const mini = typeof window !== "undefined" ? window.MiniAppExtension : null;
    console.log(mini, "mini");
    if (!mini?.getUserConsent) {
      reject(new Error("SwiftChat MiniApp SDK is not available"));
      return;
    }
    try {
      mini.getUserConsent((data) => {
        if (data?.success && data.payload && isValidSso(data.payload)) {
          setSsoDetails(data.payload);
          resolve(data.payload);
        } else {
          reject(new Error("SwiftChat SSO consent was denied or incomplete"));
        }
      });
    } catch (err) {
      reject(
        err instanceof Error ? err : new Error("SwiftChat SSO consent failed"),
      );
    }
  });
}

/**
 * Survey-style SSO for login — only SDK-generated ssoDetails (no static mocks).
 */
export async function ensureSsoDetailsForLogin() {
  let ssoDetails = getSsoDetails();

  if (!isSsoExpired(ssoDetails) && isValidSso(ssoDetails)) {
    return ssoDetails;
  }

  ssoDetails = await getUserConsent();
  if (!isValidSso(ssoDetails)) {
    throw new Error("SwiftChat SSO consent is required");
  }
  return setSsoDetails(ssoDetails);
}
