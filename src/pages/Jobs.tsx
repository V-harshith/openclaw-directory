import { useState, useMemo } from "react";
import { Search, MapPin, Clock, DollarSign, Sparkles, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/AdBanner";
import { JOB_TYPES, JOB_CATEGORIES } from "@/data/mockData";
import { useJobs, useAds } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { data: jobs, isLoading } = useJobs();
  const { data: ads } = useAds();

  useSEO({
    title: "AI & Agent Engineering Jobs — OpenClaw Job Board",
    description: "Find the best AI jobs, agent engineer roles, prompt engineering and ML positions. Remote and onsite AI jobs from top AI companies.",
    canonical: "https://openclaw.io/jobs",
  });

  const headerAd = ads?.find((a) => a.placement === "header");
  const inContentAd = ads?.find((a) => a.placement === "in-content");

  const filtered = useMemo(() => {
    let items = [...(jobs || [])];
    if (search) items = items.filter((j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      (j as any).company?.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== "All") items = items.filter((j) => (j as any).job_type === typeFilter);
    if (categoryFilter !== "All") items = items.filter((j) => j.category === categoryFilter);
    const sponsored = items.filter((j) => j.is_sponsored);
    const rest = items.filter((j) => !j.is_sponsored);
    return [...sponsored, ...rest];
  }, [search, typeFilter, categoryFilter, jobs]);

  return (
    <Layout>
      {headerAd && (
        <div className="container mx-auto px-4 max-w-4xl pt-3">
          <AdBanner ad={headerAd} />
        </div>
      )}

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Jobs</h1>
            <p className="text-muted-foreground">Find your next role in the AI industry</p>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs, companies, roles…" className="pl-10 bg-card border-border" data-testid="input-search-jobs" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-muted-foreground self-center">Type:</span>
          {["All", ...JOB_TYPES].map((type) => (
            <button key={type} onClick={() => setTypeFilter(type)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${typeFilter === type ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs text-muted-foreground self-center">Category:</span>
          {JOB_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : filtered.map((job, i) => (
                <div key={job.id}>
                  <Link to={`/jobs/${job.id}`}>
                    <div className={`card-hover rounded-xl border bg-card p-5 relative ${job.is_sponsored ? "border-primary/30 bg-primary/[0.03]" : "border-border"}`}>
                      {job.is_sponsored && (
                        <Badge className="absolute top-3 right-3 bg-primary/15 text-primary border-primary/30 text-[10px]">
                          <Sparkles className="h-3 w-3 mr-1" />Sponsored
                        </Badge>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{job.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                            {(job as any).company && <span className="font-medium text-foreground">{(job as any).company}</span>}
                            {(job as any).location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{(job as any).location}</span>}
                            {(job as any).job_type && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{(job as any).job_type}</span>}
                            {(job as any).salary_range && <span className="flex items-center gap-1 text-primary font-medium"><DollarSign className="h-3 w-3" />{(job as any).salary_range}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 hidden sm:flex">{job.category}</Badge>
                      </div>
                    </div>
                  </Link>
                  {i === 1 && inContentAd && <div className="my-3"><AdBanner ad={inContentAd} /></div>}
                </div>
              ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No jobs found.</p>
              <p className="text-sm mt-1">Try a different search or filter.</p>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="mt-10 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
            <h3 className="font-semibold mb-2">Hiring AI talent?</h3>
            <p className="text-sm text-muted-foreground mb-4">Post a job listing and reach thousands of AI developers and engineers.</p>
            <Link to="/submit">
              <button className="btn-primary h-9 px-5 text-sm">Post a Job →</button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
