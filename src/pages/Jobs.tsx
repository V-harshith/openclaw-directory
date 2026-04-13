import { useState, useMemo } from "react";
import { Search, MapPin, Clock, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/AdBanner";
import { mockJobs, mockAds, JOB_TYPES } from "@/data/mockData";
import { Sparkles } from "lucide-react";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const headerAd = mockAds.find((a) => a.placement === "header");
  const inContentAd = mockAds.find((a) => a.placement === "in-content");

  const filtered = useMemo(() => {
    let items = [...mockJobs];
    if (search) items = items.filter((j) => j.name.toLowerCase().includes(search.toLowerCase()) || j.description.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "All") items = items.filter((j) => j.job_type === typeFilter);
    const sponsored = items.filter((j) => j.is_sponsored);
    const rest = items.filter((j) => !j.is_sponsored);
    return [...sponsored, ...rest];
  }, [search, typeFilter]);

  return (
    <Layout>
      {headerAd && <AdBanner ad={headerAd} />}
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">AI Jobs</h1>
        <p className="text-muted-foreground mb-6">Find your next role in the AI industry</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs..." className="pl-10 bg-card border-border" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setTypeFilter("All")} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${typeFilter === "All" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>All</button>
          {JOB_TYPES.map((type) => (
            <button key={type} onClick={() => setTypeFilter(type)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${typeFilter === type ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((job, i) => (
            <div key={job.id}>
              <div className={`card-hover rounded-xl border bg-card p-5 relative ${job.is_sponsored ? "border-primary/30 bg-primary/[0.03]" : "border-border"}`}>
                {job.is_sponsored && (
                  <Badge className="absolute top-3 right-3 bg-primary/15 text-primary border-primary/30 text-[10px]">
                    <Sparkles className="h-3 w-3 mr-1" />Sponsored
                  </Badge>
                )}
                <h3 className="font-semibold text-lg">{job.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                  {job.company && <span className="font-medium text-foreground">{job.company}</span>}
                  {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                  {job.job_type && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type}</span>}
                  {job.salary_range && <span className="flex items-center gap-1 text-primary font-medium"><DollarSign className="h-3 w-3" />{job.salary_range}</span>}
                </div>
              </div>
              {i === 1 && inContentAd && <div className="my-3"><AdBanner ad={inContentAd} /></div>}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-20 text-muted-foreground">No jobs found.</div>}
        </div>
      </div>
    </Layout>
  );
}
