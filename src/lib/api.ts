// OpenClaw API layer — calls Express backend connected to Neon PostgreSQL.

import { Listing, Ad } from "@/data/mockData";

const BASE = import.meta.env.VITE_API_URL || "/api";

const KEYS = {
  admin: "oc_admin_token",
};

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(KEYS.admin);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async adminLogin(password: string): Promise<{ token: string }> {
    return request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  async adminMe(): Promise<{ role: string; ok: boolean }> {
    return request("/admin/me");
  },

  // Listings
  async getListings(params?: { type?: string; category?: string }): Promise<Listing[]> {
    const sp = new URLSearchParams();
    if (params?.type) sp.set("type", params.type);
    if (params?.category && params.category !== "All") sp.set("category", params.category);
    const qs = sp.toString();
    return request(`/listings${qs ? `?${qs}` : ""}`);
  },

  async getAllListings(type?: string): Promise<Listing[]> {
    const sp = new URLSearchParams();
    if (type) sp.set("type", type);
    const qs = sp.toString();
    return request(`/listings/all${qs ? `?${qs}` : ""}`);
  },

  async getListing(id: number): Promise<Listing> {
    return request(`/listings/${id}`);
  },

  async search(q: string, type?: string): Promise<Listing[]> {
    const sp = new URLSearchParams({ q });
    if (type) sp.set("type", type);
    return request(`/listings/search?${sp.toString()}`);
  },

  async createListing(data: any): Promise<Listing> {
    return request("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateListing(id: number, data: any): Promise<Listing> {
    return request(`/listings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteListing(id: number): Promise<void> {
    await request(`/listings/${id}`, { method: "DELETE" });
  },

  async upvoteListing(id: number): Promise<Listing> {
    return request(`/listings/${id}/upvote`, { method: "POST" });
  },

  // Submissions
  async getSubmissions(status?: string): Promise<any[]> {
    const sp = new URLSearchParams();
    if (status) sp.set("status", status);
    const qs = sp.toString();
    return request(`/submissions${qs ? `?${qs}` : ""}`);
  },

  async createSubmission(data: any): Promise<any> {
    return request("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSubmissionStatus(id: number, status: string): Promise<any> {
    return request(`/submissions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async deleteSubmission(id: number): Promise<void> {
    await request(`/submissions/${id}`, { method: "DELETE" });
  },

  // Ads
  async getAds(): Promise<Ad[]> {
    return request("/ads");
  },

  async getAllAds(): Promise<Ad[]> {
    return request("/ads/all");
  },

  async createAd(data: any): Promise<Ad> {
    return request("/ads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAd(id: number, data: any): Promise<Ad> {
    return request(`/ads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAd(id: number): Promise<void> {
    await request(`/ads/${id}`, { method: "DELETE" });
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
