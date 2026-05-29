const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/FINAL%20VOTING%20SYSTEM/insurance_policy_backend/api";
const RESPONSE_ENCRYPTION_KEY =
  import.meta.env.VITE_RESPONSE_ENCRYPTION_KEY ||
  "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("insurance_session") || "null")?.token;
  } catch {
    return null;
  }
}

function hexToBytes(hex) {
  if (!/^[a-fA-F0-9]{64}$/.test(hex)) {
    throw new Error("Response encryption key must be a 64-character hex string.");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function importApiKey(usage) {
  if (!window.crypto?.subtle) {
    throw new Error("Browser crypto support is required for encrypted API traffic.");
  }

  return window.crypto.subtle.importKey(
    "raw",
    hexToBytes(RESPONSE_ENCRYPTION_KEY),
    "AES-GCM",
    false,
    [usage]
  );
}

async function decryptEncryptedResponse(payload) {
  if (!payload?.encrypted_data || !payload?.iv || !payload?.auth_tag) {
    return payload;
  }

  const key = await importApiKey("decrypt");
  const ciphertext = base64ToBytes(payload.encrypted_data);
  const tag = base64ToBytes(payload.auth_tag);
  const encrypted = new Uint8Array(ciphertext.length + tag.length);
  encrypted.set(ciphertext, 0);
  encrypted.set(tag, ciphertext.length);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(payload.iv), tagLength: 128 },
    key,
    encrypted
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

async function encryptRequestBody(body) {
  const key = await importApiKey("encrypt");
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(body));
  const encrypted = new Uint8Array(
    await window.crypto.subtle.encrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, encoded)
  );
  const tagLength = 16;
  const ciphertext = encrypted.slice(0, encrypted.length - tagLength);
  const tag = encrypted.slice(encrypted.length - tagLength);

  return {
    encrypted_data: bytesToBase64(ciphertext),
    iv: bytesToBase64(iv),
    auth_tag: bytesToBase64(tag)
  };
}

async function request(path, options = {}) {
  const token = getToken();
  const encryptedBody = options.body ? await encryptRequestBody(options.body) : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: encryptedBody ? JSON.stringify(encryptedBody) : undefined
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || "Invalid server response." };
  }

  if (data?.encrypted_data && data?.iv && data?.auth_tag) {
    try {
      data = await decryptEncryptedResponse(data);
    } catch (error) {
      data = { error: "Could not decrypt encrypted API response.", details: error.message };
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.error || data?.message || "Request failed.", response.status, data);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body })
};
