// Thin auth helpers — delegates to api.ts for all storage.
// The admin token key must match KEYS.admin in api.ts: "oc_admin_token"

const ADMIN_TOKEN_KEY = "oc_admin_token";

export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem(ADMIN_TOKEN_KEY);
}
