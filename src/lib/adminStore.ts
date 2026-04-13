import { Listing, Ad } from "@/data/mockData";

const ADMIN_KEY = "aidir_admin_auth";
const LISTINGS_KEY = "aidir_listings";
const ADS_KEY = "aidir_ads";
const SUBMISSIONS_KEY = "aidir_submissions";

export const ADMIN_PASSWORD = "admin123";

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}

export type ListingOverride = {
  id: string;
  status: "approved" | "pending" | "rejected";
  is_sponsored: boolean;
  is_featured: boolean;
};

export function getListingOverrides(): Record<string, ListingOverride> {
  try {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setListingOverride(id: string, override: Partial<ListingOverride>) {
  const all = getListingOverrides();
  all[id] = { ...(all[id] || { id, status: "approved", is_sponsored: false, is_featured: false }), ...override, id };
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all));
}

export function applyOverrides(listings: Listing[]): Listing[] {
  const overrides = getListingOverrides();
  return listings.map((l) => {
    const o = overrides[l.id];
    if (!o) return l;
    return { ...l, status: o.status, is_sponsored: o.is_sponsored, is_featured: o.is_featured };
  });
}

export function getAds(): Ad[] {
  try {
    const saved = localStorage.getItem(ADS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveAds(ads: Ad[]) {
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
}

export type Submission = Listing & { submitted_at: string; submitter_email: string };

export function getSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addSubmission(submission: Submission) {
  const all = getSubmissions();
  all.unshift(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
}

export function updateSubmissionStatus(id: string, status: "approved" | "pending" | "rejected") {
  const all = getSubmissions().map((s) => (s.id === id ? { ...s, status } : s));
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
}

export function deleteSubmission(id: string) {
  const all = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
}
