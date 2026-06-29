export function saveToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bearer_token", token);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `ba_token=${token}; path=/; expires=${expires}; SameSite=Lax; Secure`;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("bearer_token");
  document.cookie = "ba_token=; path=/; max-age=0; SameSite=Lax";
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("bearer_token") || "";
}
