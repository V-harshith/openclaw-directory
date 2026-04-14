// OpenClaw API layer — localStorage-based with full seed data.
// Backend (Express + PostgreSQL) runs in parallel on port 3001.
// When backend is confirmed stable, swap queryFns to call /api/* endpoints.

import { Listing, Ad, seedMcpServers, seedSkills, seedPlugins, seedTemplates, seedJobs, seedAds } from "@/data/mockData";

export const ADMIN_PASSWORD = "openclaw2026";

const KEYS = {
  listings: "oc_listings",
  ads: "oc_ads",
  submissions: "oc_submissions",
  admin: "oc_admin_token",
};

function getStoredListings(): Listing[] {
  try {
    const raw = localStorage.getItem(KEYS.listings);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed = [...seedMcpServers, ...seedSkills, ...seedPlugins, ...seedTemplates, ...seedJobs];
  localStorage.setItem(KEYS.listings, JSON.stringify(seed));
  return seed;
}

function saveListings(listings: Listing[]) {
  localStorage.setItem(KEYS.listings, JSON.stringify(listings));
}

function getStoredAds(): Ad[] {
  try {
    const raw = localStorage.getItem(KEYS.ads);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(KEYS.ads, JSON.stringify(seedAds));
  return [...seedAds];
}

function saveAds(ads: Ad[]) {
  localStorage.setItem(KEYS.ads, JSON.stringify(ads));
}

function getStoredSubmissions(): any[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.submissions) || "[]");
  } catch { return []; }
}

function saveSubmissions(subs: any[]) {
  localStorage.setItem(KEYS.submissions, JSON.stringify(subs));
}

const delay = () => new Promise<void>((r) => setTimeout(r, 40));

export const api = {
  // Auth
  async adminLogin(password: string): Promise<{ token: string }> {
    await delay();
    if (password === ADMIN_PASSWORD) {
      return { token: "oc-admin-token-local" };
    }
    throw new Error("Incorrect password");
  },

  async adminMe(): Promise<{ role: string; ok: boolean }> {
    return { role: "admin", ok: true };
  },

  // Listings
  async getListings(params?: { type?: string; category?: string }): Promise<Listing[]> {
    await delay();
    let items = getStoredListings().filter((l) => l.status === "approved");
    if (params?.type) items = items.filter((l) => l.type === params.type);
    if (params?.category && params.category !== "All") items = items.filter((l) => l.category === params.category);
    return items;
  },

  async getAllListings(type?: string): Promise<Listing[]> {
    await delay();
    let items = getStoredListings();
    if (type) items = items.filter((l) => l.type === type);
    return items;
  },

  async getListing(id: number): Promise<Listing> {
    await delay();
    const item = getStoredListings().find((l) => Number(l.id) === id);
    if (!item) throw new Error("Not found");
    // Increment views locally
    const all = getStoredListings();
    const idx = all.findIndex((l) => Number(l.id) === id);
    if (idx !== -1) { all[idx] = { ...all[idx], views: (all[idx].views || 0) + 1 }; saveListings(all); }
    return item;
  },

  async search(q: string, type?: string): Promise<Listing[]> {
    await delay();
    const lower = q.toLowerCase();
    let items = getStoredListings().filter((l) => l.status === "approved");
    if (type) items = items.filter((l) => l.type === type);
    return items.filter((l) =>
      l.name.toLowerCase().includes(lower) ||
      l.description.toLowerCase().includes(lower) ||
      l.tags.some((t) => t.toLowerCase().includes(lower)) ||
      l.author.toLowerCase().includes(lower) ||
      l.category.toLowerCase().includes(lower)
    );
  },

  async createListing(data: any): Promise<Listing> {
    await delay();
    const all = getStoredListings();
    const newItem: Listing = {
      id: Date.now(),
      views: 0,
      upvotes: 0,
      status: "approved",
      is_sponsored: false,
      is_featured: false,
      logo_url: "",
      tags: data.tags || [],
      created_at: new Date().toISOString(),
      ...data,
    };
    all.unshift(newItem);
    saveListings(all);
    return newItem;
  },

  async updateListing(id: number, data: any): Promise<Listing> {
    await delay();
    const all = getStoredListings();
    const idx = all.findIndex((l) => Number(l.id) === id);
    if (idx === -1) throw new Error("Not found");
    all[idx] = { ...all[idx], ...data };
    saveListings(all);
    return all[idx];
  },

  async deleteListing(id: number): Promise<void> {
    await delay();
    saveListings(getStoredListings().filter((l) => Number(l.id) !== id));
  },

  async upvoteListing(id: number): Promise<Listing> {
    await delay();
    const all = getStoredListings();
    const idx = all.findIndex((l) => Number(l.id) === id);
    if (idx === -1) throw new Error("Not found");
    all[idx] = { ...all[idx], upvotes: (all[idx].upvotes || 0) + 1 };
    saveListings(all);
    return all[idx];
  },

  // Submissions
  async getSubmissions(_status?: string): Promise<any[]> {
    await delay();
    const subs = getStoredSubmissions();
    if (_status) return subs.filter((s: any) => s.status === _status);
    return subs;
  },

  async createSubmission(data: any): Promise<any> {
    await delay();
    const subs = getStoredSubmissions();
    const newSub = {
      id: Date.now(),
      submitted_at: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      is_sponsored: false,
      is_featured: false,
      logo_url: "",
      ...data,
    };
    subs.unshift(newSub);
    saveSubmissions(subs);
    return newSub;
  },

  async updateSubmissionStatus(id: number, status: string): Promise<any> {
    await delay();
    const subs = getStoredSubmissions();
    const idx = subs.findIndex((s: any) => Number(s.id) === id);
    if (idx === -1) throw new Error("Not found");
    subs[idx].status = status;
    saveSubmissions(subs);
    if (status === "approved") {
      const all = getStoredListings();
      if (!all.find((l) => Number(l.id) === id)) {
        all.unshift({ ...subs[idx], status: "approved" });
        saveListings(all);
      }
    }
    return subs[idx];
  },

  async deleteSubmission(id: number): Promise<void> {
    await delay();
    saveSubmissions(getStoredSubmissions().filter((s: any) => Number(s.id) !== id));
  },

  // Ads
  async getAds(): Promise<Ad[]> {
    await delay();
    return getStoredAds().filter((a) => a.active);
  },

  async getAllAds(): Promise<Ad[]> {
    await delay();
    return getStoredAds();
  },

  async createAd(data: any): Promise<Ad> {
    await delay();
    const ads = getStoredAds();
    const newAd: Ad = { id: Date.now(), image_url: "", active: true, ...data };
    ads.push(newAd);
    saveAds(ads);
    return newAd;
  },

  async updateAd(id: number, data: any): Promise<Ad> {
    await delay();
    const ads = getStoredAds();
    const idx = ads.findIndex((a) => Number(a.id) === Number(id));
    if (idx === -1) throw new Error("Not found");
    ads[idx] = { ...ads[idx], ...data };
    saveAds(ads);
    return ads[idx];
  },

  async deleteAd(id: number): Promise<void> {
    await delay();
    saveAds(getStoredAds().filter((a) => Number(a.id) !== Number(id)));
  },

  // Token management
  saveToken(token: string) {
    localStorage.setItem(KEYS.admin, token);
  },
  clearToken() {
    localStorage.removeItem(KEYS.admin);
  },
  isLoggedIn(): boolean {
    return !!localStorage.getItem(KEYS.admin);
  },
};
