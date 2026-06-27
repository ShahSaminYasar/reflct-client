export function saveToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bearer_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("bearer_token");
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("bearer_token") || "";
}
