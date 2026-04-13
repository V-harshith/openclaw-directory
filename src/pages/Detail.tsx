import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, ArrowUp, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { mockSkills, mockPlugins, mockJobs, mockAds, formatNumber, getEmoji } from "@/data/mockData";

export default function DetailPage() {
  const { id } = useParams();

  const allListings = [...mockSkills, ...mockPlugins, ...mockJobs];
  const listing = allListings.find((l) => l.id === id);
  const sidebarAd = mockAds.find((a) => a.placement === "sidebar");
  const footerAd = mockAds.find((a) => a.placement === "footer");

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </Layout>
    );
  }

  const backPath = listing.type === "job" ? "/jobs" : `/${listing.type}s`;
  const idx = allListings.indexOf(listing);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <Link to={backPath} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to {listing.type}s
        </Link>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-2xl shrink-0">
                {getEmoji(idx)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <p className="text-muted-foreground mt-1">by {listing.author}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">{listing.category}</Badge>
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{formatNumber(listing.views)} views</span>
              {listing.type !== "job" && <span className="flex items-center gap-1"><ArrowUp className="h-4 w-4" />{formatNumber(listing.upvotes)} upvotes</span>}
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{listing.created_at}</span>
            </div>

            {listing.type === "job" && (
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Company</span><p className="font-medium mt-1">{listing.company}</p></div>
                  <div><span className="text-muted-foreground">Location</span><p className="font-medium mt-1">{listing.location}</p></div>
                  <div><span className="text-muted-foreground">Type</span><p className="font-medium mt-1">{listing.job_type}</p></div>
                  <div><span className="text-muted-foreground">Salary</span><p className="font-medium text-primary mt-1">{listing.salary_range}</p></div>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This is a detailed view of the listing. When connected to a database, this section will display the full content, documentation, setup instructions, and other rich information about this {listing.type}.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
              </Button>
            </div>

            {footerAd && <div className="mt-8"><AdBanner ad={footerAd} /></div>}
          </div>

          {sidebarAd && (
            <div className="hidden lg:block w-[220px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
              <SidebarAd ad={{ ...sidebarAd, id: "ad-d2", label: "💡 List Your Tool Here — Free Submission" }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
