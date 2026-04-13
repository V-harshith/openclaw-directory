import { Link } from "react-router-dom";
import { Star, Eye, Github, Sparkles, ArrowUpRight } from "lucide-react";
import { Listing, formatNumber, getEmoji } from "@/data/mockData";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

const TYPE_TO_PATH: Record<string, string> = {
  mcp_server: "mcp-servers",
  skill: "skills",
  plugin: "plugins",
  template: "templates",
  job: "jobs",
};

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const detailPath = `/${TYPE_TO_PATH[listing.type] || `${listing.type}s`}/${listing.id}`;

  const isGitHub = !!(listing as any).github_url;
  const stars = (listing as any).stars;

  return (
    <Link to={detailPath} className="block group" data-testid={`card-listing-${listing.id}`}>
      <div className={`card-hover relative h-full rounded-xl p-5 surface ${
        listing.is_sponsored ? "border-primary/20" : ""
      }`}>
        {listing.is_sponsored && (
          <span className="badge-sponsored absolute top-3.5 right-3.5">
            <Sparkles className="h-2.5 w-2.5" /> Sponsored
          </span>
        )}
        {listing.is_featured && !listing.is_sponsored && (
          <span className="badge-featured absolute top-3.5 right-3.5">
            Featured
          </span>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0">
            {listing.logo_url ? (
              <img
                src={listing.logo_url}
                alt={listing.author}
                className="h-10 w-10 rounded-lg object-cover bg-white/[0.04]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-lg border border-white/[0.06]">
                {getEmoji(index)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-[14.5px] text-foreground truncate group-hover:text-primary transition-colors">
                {listing.name}
              </h3>
              {isGitHub && (
                <Github className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              )}
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{listing.author}</p>
          </div>

          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all shrink-0 -translate-y-0.5 translate-x-0.5 group-hover:translate-x-0 group-hover:translate-y-0" />
        </div>

        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground bg-white/[0.04] border border-white/[0.06]">
            {listing.category}
          </span>
          <div className="flex items-center gap-3 text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(listing.views)}
            </span>
            {listing.type !== "job" && (
              <span className="flex items-center gap-1">
                {isGitHub
                  ? <Star className="h-3 w-3 text-amber-400/70" />
                  : <Star className="h-3 w-3" />
                }
                {formatNumber(listing.upvotes)}
              </span>
            )}
          </div>
        </div>

        {listing.type === "job" && (
          <div className="flex items-center gap-2 mt-3 flex-wrap text-[11.5px] text-muted-foreground">
            {listing.company && <span className="text-foreground/70 font-medium">{listing.company}</span>}
            {listing.location && (
              <>
                <span className="text-white/10">·</span>
                <span>{listing.location}</span>
              </>
            )}
            {listing.salary_range && (
              <>
                <span className="text-white/10">·</span>
                <span className="text-primary/80 font-medium">{listing.salary_range}</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
