const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

let cachedToken = null;
let cachedAt = 0;
const TOKEN_TTL = 4 * 60 * 1000;

async function fetchToken(force = false) {
  const now = Date.now();
  if (!force && cachedToken && now - cachedAt < TOKEN_TTL) return cachedToken;
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) {
      cachedToken = null;
      return null;
    }
    const data = await res.json().catch(() => ({}));
    cachedToken = data.token || res.headers.get("set-auth-jwt") || null;
    cachedAt = now;
    return cachedToken;
  } catch {
    cachedToken = null;
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const send = (token) =>
    fetch(`${serverUrl}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        "content-type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let token = await fetchToken();
  let response = await send(token);

  if (response.status === 401) {
    token = await fetchToken(true);
    response = await send(token);
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  return { response, data };
}
