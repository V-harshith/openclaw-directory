import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, ArrowUp, ExternalLink, Calendar, Github, Star, MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { formatNumber, getEmoji } from "@/data/mockData";
import { useListing, useAds, useUpvote } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { toast } from "sonner";

const TYPE_TO_PATH: Record<string, string> = {
  mcp_server: "mcp-servers",
  skill: "skills",
  plugin: "plugins",
  template: "templates",
  job: "jobs",
};

const TYPE_LABELS: Record<string, string> = {
  mcp_server: "MCP Server",
  skill: "Skill",
  plugin: "Plugin",
  template: "Template",
  job: "Job",
};

export default function DetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const { data: listing, isLoading, error } = useListing(id || "");
  const { data: ads } = useAds();
  const upvote = useUpvote(Number(id));

  const sidebarAd = ads?.find((a) => a.placement === "sidebar");
  const footerAd = ads?.find((a) => a.placement === "footer");

  const backPath = listing ? `/${TYPE_TO_PATH[listing.type] || `${listing.type}s`}` : "/";
  const backLabel = listing ? (TYPE_LABELS[listing.type] || listing.type) : "";

  useSEO({
    title: listing
      ? `${listing.name} — ${TYPE_LABELS[listing.type] || listing.type} | OpenClaw`
      : "OpenClaw — AI Tools Directory",
    description: listing
      ? `${listing.description} Find more AI tools, MCP servers and agent skills on OpenClaw.`
      : undefined,
    canonical: listing ? `https://openclaw.io${backPath}/${listing.id}` : undefined,
  });

  useEffect(() => {
    if (!listing) return;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": listing.type === "job" ? "JobPosting" : "SoftwareApplication",
      "name": listing.name,
      "description": listing.description,
      "author": { "@type": "Organization", "name": listing.author },
      ...(listing.type === "job" ? {
        "hiringOrganization": { "@type": "Organization", "name": (listing as any).company || listing.author },
        "jobLocation": { "@type": "Place", "name": (listing as any).location || "Remote" },
        "employmentType": (listing as any).job_type || "FULL_TIME",
        "baseSalary": (listing as any).salary_range ? { "@type": "MonetaryAmount", "currency": "USD", "value": (listing as any).salary_range } : undefined,
      } : {}),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    script.id = "listing-structured-data";
    const existing = document.getElementById("listing-structured-data");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [listing?.id]);

  const handleUpvote = async () => {
    try {
      await upvote.mutateAsync();
      toast.success("Upvoted!");
    } catch {
      toast.error("Too many upvotes — slow down!");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <p className="text-muted-foreground mb-6">This listing may have been removed or doesn't exist.</p>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </Layout>
    );
  }

  const isGitHub = !!(listing as any).github_url;
  const githubUrl = (listing as any).github_url;
  const stars = (listing as any).stars;
  const createdDate = listing.created_at ? new Date(listing.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <Layout>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <Link to={backPath} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to {backLabel}s
        </Link>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-6">
              {listing.logo_url ? (
                <img src={listing.logo_url} alt={listing.name} className="h-16 w-16 rounded-2xl object-cover shrink-0 bg-muted" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl shrink-0 border border-primary/20">
                  {getEmoji(listing.id as number)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-3xl font-bold">{listing.name}</h1>
                  {listing.is_sponsored && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">Sponsored</Badge>
                  )}
                  {listing.is_featured && (
                    <Badge variant="secondary" className="text-[10px]">Featured</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">by {listing.author}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="secondary">{listing.category}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{TYPE_LABELS[listing.type]}</Badge>
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
              {isGitHub && (
                <Badge className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs flex items-center gap-1">
                  <Github className="h-3 w-3" /> GitHub
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatNumber(listing.views)} views
              </span>
              {listing.type !== "job" && (
                <button
                  onClick={handleUpvote}
                  disabled={upvote.isPending}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                  title="Upvote"
                >
                  {isGitHub && stars ? (
                    <><Star className="h-4 w-4 text-yellow-400" />{formatNumber(stars)} stars</>
                  ) : (
                    <><ArrowUp className="h-4 w-4" />{formatNumber(listing.upvotes)} upvotes</>
                  )}
                </button>
              )}
              {createdDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {createdDate}
                </span>
              )}
            </div>

            {listing.type === "job" && (
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {(listing as any).company && (
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1"><Building2 className="h-3.5 w-3.5" /> Company</span>
                      <p className="font-medium">{(listing as any).company}</p>
                    </div>
                  )}
                  {(listing as any).location && (
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1"><MapPin className="h-3.5 w-3.5" /> Location</span>
                      <p className="font-medium">{(listing as any).location}</p>
                    </div>
                  )}
                  {(listing as any).job_type && (
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1"><Clock className="h-3.5 w-3.5" /> Type</span>
                      <p className="font-medium">{(listing as any).job_type}</p>
                    </div>
                  )}
                  {(listing as any).salary_range && (
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1"><DollarSign className="h-3.5 w-3.5" /> Salary</span>
                      <p className="font-medium text-primary">{(listing as any).salary_range}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">About this {TYPE_LABELS[listing.type]}</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {githubUrl ? (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Github className="h-4 w-4 mr-2" /> View on GitHub
                  </Button>
                </a>
              ) : listing.website_url && listing.website_url !== "#" ? (
                <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                  </Button>
                </a>
              ) : listing.type === "job" ? (
                <Link to="/submit">
                  <Button variant="outline">
                    Apply / Contact
                  </Button>
                </Link>
              ) : null}

              {listing.type !== "job" && (
                <button
                  onClick={handleUpvote}
                  disabled={upvote.isPending}
                  className="btn-ghost h-10 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4" />
                  Upvote ({formatNumber(listing.upvotes)})
                </button>
              )}
            </div>

            {footerAd && <div className="mt-10"><AdBanner ad={footerAd} /></div>}
          </div>

          {sidebarAd && (
            <div className="hidden lg:block w-[220px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
              <SidebarAd ad={{ ...sidebarAd, id: "ad-detail-2", label: "💡 List Your Tool Here — Free Submission" }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
