const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("openclaw_admin_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
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
  async searchListings(q: string, type?: string): Promise<any[]> {
    const qs = new URLSearchParams({ q });
    if (type) qs.set("type", type);
    return request(`/listings/search?${qs}`);
  },

  async getListings(params?: { type?: string; category?: string }): Promise<any[]> {
    const qs = new URLSearchParams();
    if (params?.type) qs.set("type", params.type);
    if (params?.category) qs.set("category", params.category);
    return request(`/listings?${qs}`);
  },

  async getAllListings(type?: string): Promise<any[]> {
    const qs = type ? `?type=${type}` : "";
    return request(`/listings/all${qs}`);
  },

  async getListing(id: number): Promise<any> {
    return request(`/listings/${id}`);
  },

  async createListing(data: any): Promise<any> {
    return request("/listings", { method: "POST", body: JSON.stringify(data) });
  },

  async updateListing(id: number, data: any): Promise<any> {
    return request(`/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  async deleteListing(id: number): Promise<void> {
    return request(`/listings/${id}`, { method: "DELETE" });
  },

  async upvoteListing(id: number): Promise<any> {
    return request(`/listings/${id}/upvote`, { method: "POST" });
  },

  // Submissions
  async getSubmissions(status?: string): Promise<any[]> {
    const qs = status ? `?status=${status}` : "";
    return request(`/submissions${qs}`);
  },

  async createSubmission(data: any): Promise<any> {
    return request("/submissions", { method: "POST", body: JSON.stringify(data) });
  },

  async updateSubmissionStatus(id: number, status: string): Promise<any> {
    return request(`/submissions/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  },

  async deleteSubmission(id: number): Promise<void> {
    return request(`/submissions/${id}`, { method: "DELETE" });
  },

  // Highlights (promotion system — neutral naming for ad-blocker resistance)
  async getHighlights(): Promise<any[]> {
    return request("/highlights");
  },

  async getAllHighlights(): Promise<any[]> {
    return request("/highlights/all");
  },

  async createHighlight(data: any): Promise<any> {
    return request("/highlights", { method: "POST", body: JSON.stringify(data) });
  },

  async updateHighlight(id: number, data: any): Promise<any> {
    return request(`/highlights/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  async deleteHighlight(id: number): Promise<void> {
    return request(`/highlights/${id}`, { method: "DELETE" });
  },

  // Token management
  saveToken(token: string) {
    localStorage.setItem("openclaw_admin_token", token);
  },

  clearToken() {
    localStorage.removeItem("openclaw_admin_token");
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },
};
