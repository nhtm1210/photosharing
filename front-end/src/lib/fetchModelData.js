const BASE_URL = "http://localhost:8081/";
const TOKEN_KEY = "photoAppToken";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function buildUrl(url) {
  if (/^https?:\/\//.test(url)) return url;
  const base = BASE_URL.replace(/\/+$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return base + path;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchModel(url) {
  const response = await fetch(buildUrl(url), {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    err.body = await response.text().catch(() => "");
    throw err;
  }
  return response.json();
}

async function postModel(url, body) {
  const response = await fetch(buildUrl(url), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body || {}),
  });
  console.log(response);
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    err.body = await response.text().catch(() => "");
    throw err;
  }
  if (response.status === 204) return null;
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log(err);

    return text;
  }
}

async function postFormData(url, formData) {
  const response = await fetch(buildUrl(url), {
    method: "POST",
    headers: { ...authHeaders() }, // KHÔNG set Content-Type cho FormData
    body: formData,
  });
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    err.body = await response.text().catch(() => "");
    throw err;
  }
  return response.json();
}

export { postModel, postFormData, setToken, clearToken, getToken, BASE_URL };
export default fetchModel;
