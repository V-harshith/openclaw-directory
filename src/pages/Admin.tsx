import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  isAdminLoggedIn, adminLogin, adminLogout,
  getListingOverrides, setListingOverride,
  getAds, saveAds, Ad,
  getSubmissions, updateSubmissionStatus, deleteSubmission, Submission,
  ADMIN_PASSWORD,
} from "@/lib/adminStore";
import { useAllListings } from "@/hooks/useListings";
import { mockJobs, formatNumber } from "@/data/mockData";
import {
  LayoutDashboard, ListChecks, Megaphone, FileText,
  CheckCircle2, XCircle, Clock, Trash2, ExternalLink,
  LogOut, Shield, Github, Star, Eye, Plus, RefreshCw,
  TrendingUp, Zap, Puzzle, Briefcase,
} from "lucide-react";

type Tab = "dashboard" | "listings" | "submissions" | "ads";

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: any; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
  if (status === "rejected") return <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px]"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
  return <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-[10px]"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isAdminLoggedIn());
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [listingTab, setListingTab] = useState<"skills" | "plugins" | "jobs">("skills");
  const [overrides, setOverrides] = useState(getListingOverrides());
  const [submissions, setSubmissions] = useState<Submission[]>(getSubmissions());
  const [ads, setAds] = useState<Ad[]>(getAds());
  const [refresh, setRefresh] = useState(0);

  const { skills, plugins, jobs, isLoading } = useAllListings();

  const allListings = [...skills, ...plugins, ...jobs, ...mockJobs];

  const refreshData = () => {
    setOverrides(getListingOverrides());
    setSubmissions(getSubmissions());
    setAds(getAds());
    setRefresh((r) => r + 1);
  };

  useEffect(() => { refreshData(); }, []);

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setAuthed(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Incorrect password.");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
    navigate("/");
  };

  const handleOverride = (id: string, field: "status" | "is_sponsored" | "is_featured", value: any) => {
    setListingOverride(id, { [field]: value });
    setOverrides(getListingOverrides());
    toast.success("Listing updated.");
  };

  const handleApproveSubmission = (id: string) => {
    updateSubmissionStatus(id, "approved");
    refreshData();
    toast.success("Submission approved.");
  };

  const handleRejectSubmission = (id: string) => {
    updateSubmissionStatus(id, "rejected");
    refreshData();
    toast.error("Submission rejected.");
  };

  const handleDeleteSubmission = (id: string) => {
    deleteSubmission(id);
    refreshData();
    toast.success("Submission deleted.");
  };

  const handleSaveAds = () => {
    saveAds(ads);
    toast.success("Ads saved.");
  };

  const addNewAd = () => {
    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      placement: "header",
      image_url: "",
      target_url: "#",
      label: "New Ad",
      active: true,
    };
    setAds((prev) => [...prev, newAd]);
  };

  const updateAd = (id: string, field: keyof Ad, value: any) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const removeAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const listingsForTab = listingTab === "skills" ? skills : listingTab === "plugins" ? plugins : jobs;

  if (!authed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 max-w-md">
          <div className="text-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Enter your admin password to continue.</p>
            <p className="text-xs text-muted-foreground mt-1 opacity-60">Demo password: {ADMIN_PASSWORD}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-card border-border"
                autoFocus
                data-testid="input-admin-password"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-admin-login">
              Sign In
            </Button>
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
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Admin
            </span>
            <nav className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-testid={`tab-${t.id}`}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
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
          <div className="flex items-center gap-2">
            <button onClick={refreshData} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Refresh">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <Button size="sm" variant="outline" onClick={handleLogout} className="text-xs h-7 gap-1 border-border text-muted-foreground">
              <LogOut className="h-3 w-3" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {tab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Skills" value={isLoading ? "…" : skills.length} icon={Zap} sub="from GitHub + manual" />
                <StatCard label="Total Plugins" value={isLoading ? "…" : plugins.length} icon={Puzzle} sub="from GitHub + manual" />
                <StatCard label="Total Jobs" value={isLoading ? "…" : jobs.length} icon={Briefcase} sub="in directory" />
                <StatCard label="Pending Reviews" value={pendingCount} icon={Clock} sub={`${approvedCount} approved`} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Top Skills by Stars</h3>
                <div className="space-y-3">
                  {[...skills].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {(s as any).github_url && <Github className="h-3 w-3 text-muted-foreground" />}
                        <span className="truncate max-w-[180px]">{s.name}</span>
                      </div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />{formatNumber(s.upvotes)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Recent Submissions</h3>
                {submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No submissions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium truncate max-w-[180px]">{s.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{s.type}</p>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4">Data Sources</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  { label: "MCP Servers (topic:mcp-server)", status: "Live" },
                  { label: "Claude Skills (topic:claude-skill)", status: "Live" },
                  { label: "AI Skills (topic:ai-skill)", status: "Live" },
                  { label: "OpenAI Plugins (topic:openai-plugin)", status: "Live" },
                  { label: "ChatGPT Plugins (topic:chatgpt-plugin)", status: "Live" },
                  { label: "AI Plugins (topic:ai-plugin)", status: "Live" },
                  { label: "LLM Plugins (topic:llm-plugin)", status: "Live" },
                  { label: "Manual Submissions", status: "Active" },
                ].map((src) => (
                  <div key={src.label} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span className="flex items-center gap-2"><Github className="h-3.5 w-3.5" />{src.label}</span>
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[10px]">{src.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "listings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Listings</h2>
              <p className="text-xs text-muted-foreground">Changes override GitHub data and persist in browser storage.</p>
            </div>
            <div className="flex gap-2 mb-6">
              {(["skills", "plugins", "jobs"] as const).map((t) => (
                <button key={t} onClick={() => setListingTab(t)}
                  className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${listingTab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
                >
                  {t} ({listingTab === t ? listingsForTab.length : "…"})
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading listings from GitHub…</p>
              ) : listingsForTab.length === 0 ? (
                <p className="text-muted-foreground text-sm">No listings found.</p>
              ) : (
                listingsForTab.map((listing) => {
                  const o = overrides[listing.id] || {};
                  const status = o.status || listing.status;
                  const isSponsored = o.is_sponsored !== undefined ? o.is_sponsored : listing.is_sponsored;
                  const isFeatured = o.is_featured !== undefined ? o.is_featured : listing.is_featured;
                  const isGH = !!(listing as any).github_url;

                  return (
                    <div key={listing.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {listing.logo_url ? (
                            <img src={listing.logo_url} alt="" className="h-9 w-9 rounded-lg object-cover bg-muted shrink-0" />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm shrink-0">⚡</div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{listing.name}</span>
                              {isGH && <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-[10px] flex items-center gap-1"><Github className="h-2.5 w-2.5" />GitHub</Badge>}
                              <StatusBadge status={status} />
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-md mt-0.5">{listing.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{listing.category}</span>
                              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />{formatNumber(listing.upvotes)}</span>
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(listing.views)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                              <Switch
                                checked={isSponsored}
                                onCheckedChange={(v) => handleOverride(listing.id, "is_sponsored", v)}
                                className="scale-75"
                              />
                              Sponsored
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                              <Switch
                                checked={isFeatured}
                                onCheckedChange={(v) => handleOverride(listing.id, "is_featured", v)}
                                className="scale-75"
                              />
                              Featured
                            </label>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleOverride(listing.id, "status", "approved")}
                              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-colors ${status === "approved" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                              data-testid={`button-approve-${listing.id}`}
                            >
                              <CheckCircle2 className="h-3 w-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleOverride(listing.id, "status", "rejected")}
                              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-colors ${status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                              data-testid={`button-reject-${listing.id}`}
                            >
                              <XCircle className="h-3 w-3" /> Reject
                            </button>
                            <button
                              onClick={() => handleOverride(listing.id, "status", "pending")}
                              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-colors ${status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                            >
                              <Clock className="h-3 w-3" /> Pending
                            </button>
                          </div>

                          {(listing as any).github_url && (
                            <a href={(listing as any).github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab === "submissions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Submissions Queue</h2>
              <div className="flex gap-2">
                <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30">{pendingCount} pending</Badge>
                <Badge className="bg-green-500/15 text-green-400 border-green-500/30">{approvedCount} approved</Badge>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No submissions yet. Share the Submit Listing page to collect community contributions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold">{sub.name}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">{sub.type}</Badge>
                          <StatusBadge status={sub.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{sub.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Category: <span className="text-foreground">{sub.category}</span></span>
                          {sub.submitter_email && <span>Email: <span className="text-foreground">{sub.submitter_email}</span></span>}
                          <span>Submitted: <span className="text-foreground">{new Date(sub.submitted_at).toLocaleDateString()}</span></span>
                          {sub.website_url && sub.website_url !== "#" && (
                            <a href={sub.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Website
                            </a>
                          )}
                        </div>
                        {sub.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sub.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {sub.status !== "approved" && (
                          <button
                            onClick={() => handleApproveSubmission(sub.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"
                            data-testid={`button-approve-sub-${sub.id}`}
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                        )}
                        {sub.status !== "rejected" && (
                          <button
                            onClick={() => handleRejectSubmission(sub.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                            data-testid={`button-reject-sub-${sub.id}`}
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          data-testid={`button-delete-sub-${sub.id}`}
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

        {tab === "ads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Ad Management</h2>
              <Button size="sm" onClick={addNewAd} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1" data-testid="button-add-ad">
                <Plus className="h-4 w-4" /> Add Ad
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Manage ads displayed across the directory. Placements: <strong>header</strong>, <strong>footer</strong>, <strong>sidebar</strong>, <strong>in-content</strong>.
              Click "Save All Ads" after making changes.
            </p>

            {ads.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground rounded-xl border border-dashed border-border">
                <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No custom ads yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Ad Label / Text</Label>
                        <Input value={ad.label} onChange={(e) => updateAd(ad.id, "label", e.target.value)} className="bg-background border-border text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Target URL</Label>
                        <Input value={ad.target_url} onChange={(e) => updateAd(ad.id, "target_url", e.target.value)} className="bg-background border-border text-sm" placeholder="https://..." />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Placement</Label>
                        <select
                          value={ad.placement}
                          onChange={(e) => updateAd(ad.id, "placement", e.target.value)}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                        >
                          {["header", "footer", "sidebar", "in-content"].map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Image URL (optional)</Label>
                        <Input value={ad.image_url} onChange={(e) => updateAd(ad.id, "image_url", e.target.value)} className="bg-background border-border text-sm" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Switch checked={ad.active} onCheckedChange={(v) => updateAd(ad.id, "active", v)} />
                        {ad.active ? "Active" : "Inactive"}
                      </label>
                      <button onClick={() => removeAd(ad.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Button onClick={handleSaveAds} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-ads">
                Save All Ads
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
