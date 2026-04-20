// Set REACT_APP_API_URL at build time to your backend (e.g. https://api.example.com)
const fromEnv = process.env.REACT_APP_API_URL;
const browserFallback =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5000";
const trimSlash = (u) => u.replace(/\/$/, "");
export const API_BASE_URL = trimSlash(
  fromEnv != null && String(fromEnv).trim() !== ""
    ? String(fromEnv)
    : browserFallback
);

/** Serves /public/images/... on the API host */
export function getImageUrl(path) {
  if (path == null || path === "") return "/fallback.jpg";
  const s = String(path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${API_BASE_URL}/images/${s.replace(/^\//, "")}`;
}
