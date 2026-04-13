import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  LayoutDashboard, ListChecks, Megaphone, FileText,
  CheckCircle2, XCircle, Clock, Trash2, ExternalLink,
  LogOut, Shield, Github, Star, Eye, Plus, RefreshCw,
  TrendingUp, Zap, Database, Briefcase,
} from "lucide-react";
import { formatNumber, LISTING_TYPES } from "@/data/mockData";

type Tab = "dashboard" | "listings" | "submissions" | "ads";

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
      <CheckCircle2 className="h-3 w-3" /> Approved
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
      <XCircle className="h-3 w-3" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = { mcp_server: "MCP Server", skill: "Skill", plugin: "Plugin", template: "Template", job: "Job" };
  return (
    <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-muted-foreground border border-white/[0.07]">
      {labels[type] || type}
    </span>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authed, setAuthed] = useState(api.isLoggedIn());
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [listingType, setListingType] = useState("mcp_server");
  const [newAd, setNewAd] = useState({ placement: "header", label: "", target_url: "", active: true });

  const { data: allListings = [], isLoading: listingsLoading, refetch: refetchListings } = useQuery({
    queryKey: ["/api/listings/all", listingType],
    queryFn: () => api.getAllListings(listingType),
    enabled: authed && tab === "listings",
  });

  const { data: submissions = [], isLoading: subsLoading, refetch: refetchSubs } = useQuery({
    queryKey: ["/api/submissions"],
    queryFn: () => api.getSubmissions(),
    enabled: authed,
  });

  const { data: allAds = [], isLoading: adsLoading, refetch: refetchAds } = useQuery({
    queryKey: ["/api/ads/all"],
    queryFn: () => api.getAllAds(),
    enabled: authed && tab === "ads",
  });

  const updateListing = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateListing(id, data),
    onSuccess: () => { refetchListings(); toast.success("Listing updated."); },
    onError: () => toast.error("Failed to update listing."),
  });

  const deleteListing = useMutation({
    mutationFn: (id: number) => api.deleteListing(id),
    onSuccess: () => { refetchListings(); toast.success("Listing deleted."); },
  });

  const updateSub = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.updateSubmissionStatus(id, status),
    onSuccess: () => { refetchSubs(); qc.invalidateQueries({ queryKey: ["/api/listings"] }); toast.success("Submission updated."); },
  });

  const deleteSub = useMutation({
    mutationFn: (id: number) => api.deleteSubmission(id),
    onSuccess: () => { refetchSubs(); toast.success("Submission deleted."); },
  });

  const createAd = useMutation({
    mutationFn: (data: any) => api.createAd(data),
    onSuccess: () => { refetchAds(); toast.success("Ad created."); setNewAd({ placement: "header", label: "", target_url: "", active: true }); },
  });

  const updateAd = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateAd(id, data),
    onSuccess: () => refetchAds(),
  });

  const deleteAd = useMutation({
    mutationFn: (id: number) => api.deleteAd(id),
    onSuccess: () => { refetchAds(); toast.success("Ad deleted."); },
  });

  const pendingCount = submissions.filter((s: any) => s.status === "pending").length;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await api.adminLogin(password);
      api.saveToken(token);
      setAuthed(true);
      toast.success("Welcome to the OpenClaw admin.");
    } catch {
      toast.error("Incorrect password.");
    }
  };

  const handleLogout = () => {
    api.clearToken();
    setAuthed(false);
    navigate("/");
  };

  if (!authed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-sm">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-5">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-2">Sign in to manage OpenClaw directory</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="bg-white/[0.04] border-white/[0.1] h-10"
                autoFocus
                data-testid="input-admin-password"
              />
            </div>
            <button type="submit" className="btn-primary w-full h-10 text-sm" data-testid="button-admin-login">
              Sign in
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  const tabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "listings", label: "Listings", icon: ListChecks },
    { id: "submissions", label: "Submissions", icon: FileText, badge: pendingCount },
    { id: "ads", label: "Ads", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/[0.05] bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-6xl flex h-12 items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="text-[13px] font-semibold flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" /> Admin
            </span>
            <nav className="flex gap-0.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-testid={`tab-${t.id}`}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-md transition-colors ${tab === t.id ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"}`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                  {t.badge ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-bold">
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-8">

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Listings", value: submissions.length + allListings.length, icon: Database, sub: "in database" },
                { label: "Pending Review", value: pendingCount, icon: Clock, sub: "need action" },
                { label: "MCP Servers", value: "–", icon: Zap, sub: "approved" },
                { label: "Jobs Posted", value: "–", icon: Briefcase, sub: "active" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-5 surface">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-muted-foreground">{s.label}</span>
                    <s.icon className="h-3.5 w-3.5 text-primary/60" />
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-xl surface p-5">
                <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Recent Submissions
                </h3>
                {submissions.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground">No submissions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 6).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-[13px] truncate max-w-[180px]">{s.name}</p>
                          <TypeBadge type={s.type} />
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl surface p-5">
                <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Database Status
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "PostgreSQL (Neon)", status: "Connected" },
                    { label: "Listings table", status: "Active" },
                    { label: "Submissions table", status: "Active" },
                    { label: "Ads table", status: "Active" },
                    { label: "GitHub supplemental data", status: "Enabled" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[12px] px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-green-400 font-medium">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings */}
        {tab === "listings" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold tracking-tight">Manage Listings</h2>
              <p className="text-[12px] text-muted-foreground">Changes persist to PostgreSQL.</p>
            </div>
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {LISTING_TYPES.map((t) => (
                <button key={t.value} onClick={() => setListingType(t.value)}
                  className={`px-3 py-1.5 text-[12px] rounded-lg transition-colors ${listingType === t.value ? "bg-primary text-primary-foreground" : "surface text-muted-foreground hover:text-foreground"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {listingsLoading ? (
                <p className="text-muted-foreground text-sm py-8 text-center">Loading…</p>
              ) : allListings.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No listings of this type.</p>
              ) : (
                allListings.map((listing: any) => (
                  <div key={listing.id} className="rounded-xl surface p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {listing.logo_url ? (
                          <img src={listing.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-sm shrink-0">⚡</div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-medium text-[13px]">{listing.name}</span>
                            <StatusBadge status={listing.status} />
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate max-w-md">{listing.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                            <span>{listing.category}</span>
                            <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5 text-amber-400" />{formatNumber(listing.upvotes || listing.stars || 0)}</span>
                            <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{formatNumber(listing.views || 0)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col gap-1.5">
                          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                            <Switch checked={listing.is_sponsored} onCheckedChange={(v) => updateListing.mutate({ id: listing.id, data: { is_sponsored: v } })} className="scale-75 origin-left" />
                            Sponsored
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                            <Switch checked={listing.is_featured} onCheckedChange={(v) => updateListing.mutate({ id: listing.id, data: { is_featured: v } })} className="scale-75 origin-left" />
                            Featured
                          </label>
                        </div>

                        <div className="flex flex-col gap-1">
                          {["approved", "rejected", "pending"].map((s) => (
                            <button key={s} onClick={() => updateListing.mutate({ id: listing.id, data: { status: s } })}
                              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-colors capitalize ${
                                listing.status === s
                                  ? s === "approved" ? "bg-green-500/15 text-green-400" : s === "rejected" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                                  : "bg-white/[0.04] text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-col gap-1">
                          {listing.github_url && (
                            <a href={listing.github_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-muted-foreground hover:text-foreground">
                              <Github className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button onClick={() => deleteListing.mutate(listing.id)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Submissions */}
        {tab === "submissions" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold tracking-tight">Submissions Queue</h2>
              <div className="flex gap-2">
                <span className="inline-flex text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{pendingCount} pending</span>
              </div>
            </div>

            {subsLoading ? (
              <p className="text-muted-foreground text-center py-12 text-sm">Loading…</p>
            ) : submissions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub: any) => (
                  <div key={sub.id} className="rounded-xl surface p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-semibold text-[14px]">{sub.name}</span>
                          <TypeBadge type={sub.type} />
                          <StatusBadge status={sub.status} />
                        </div>
                        <p className="text-[13px] text-muted-foreground mb-2 line-clamp-2">{sub.description}</p>
                        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          <span>Category: <span className="text-foreground/80">{sub.category}</span></span>
                          {sub.submitter_email && <span>Email: <span className="text-foreground/80">{sub.submitter_email}</span></span>}
                          <span>Submitted: <span className="text-foreground/80">{new Date(sub.submitted_at).toLocaleDateString()}</span></span>
                          {sub.website_url && sub.website_url !== "#" && (
                            <a href={sub.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Website
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        {sub.status !== "approved" && (
                          <button onClick={() => updateSub.mutate({ id: sub.id, status: "approved" })}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            data-testid={`button-approve-${sub.id}`}
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                        )}
                        {sub.status !== "rejected" && (
                          <button onClick={() => updateSub.mutate({ id: sub.id, status: "rejected" })}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        )}
                        <button onClick={() => deleteSub.mutate(sub.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-lg bg-white/[0.04] text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ads */}
        {tab === "ads" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold tracking-tight">Ad Management</h2>
            </div>

            {/* Create new ad */}
            <div className="rounded-xl surface p-5 mb-6">
              <h3 className="text-[13px] font-semibold mb-4">Create New Ad</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Label / Text</Label>
                  <Input value={newAd.label} onChange={(e) => setNewAd((p) => ({ ...p, label: e.target.value }))} placeholder="Ad copy..." className="bg-white/[0.03] border-white/[0.08] h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Target URL</Label>
                  <Input value={newAd.target_url} onChange={(e) => setNewAd((p) => ({ ...p, target_url: e.target.value }))} placeholder="https://..." className="bg-white/[0.03] border-white/[0.08] h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Placement</Label>
                  <select value={newAd.placement} onChange={(e) => setNewAd((p) => ({ ...p, placement: e.target.value }))}
                    className="w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-foreground">
                    {["header", "footer", "sidebar", "in-content"].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => createAd.mutate(newAd)} disabled={!newAd.label}
                className="btn-primary h-9 px-4 text-[13px] disabled:opacity-40" data-testid="button-create-ad">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Ad
              </button>
            </div>

            {/* Existing ads */}
            {adsLoading ? (
              <p className="text-muted-foreground text-sm text-center py-8">Loading…</p>
            ) : (
              <div className="space-y-3">
                {allAds.map((ad: any) => (
                  <div key={ad.id} className="rounded-xl surface p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{ad.label}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                          <span className="capitalize">{ad.placement}</span>
                          {ad.target_url && ad.target_url !== "#" && (
                            <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                          <Switch checked={ad.active} onCheckedChange={(v) => updateAd.mutate({ id: ad.id, data: { active: v } })} className="scale-75" />
                          {ad.active ? "Active" : "Inactive"}
                        </label>
                        <button onClick={() => deleteAd.mutate(ad.id)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
