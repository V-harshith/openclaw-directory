import { Link } from "react-router-dom";
import { Eye, ArrowUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Listing, formatNumber, getEmoji } from "@/data/mockData";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const detailPath = listing.type === "job"
    ? `/jobs/${listing.id}`
    : `/${listing.type}s/${listing.id}`;

  return (
    <Link to={detailPath} className="block">
      <div className={`card-hover rounded-xl border border-border bg-card p-5 relative ${
        listing.is_sponsored ? "border-primary/30 bg-primary/[0.03]" : ""
      }`}>
        {listing.is_sponsored && (
          <Badge className="absolute top-3 right-3 bg-primary/15 text-primary border-primary/30 text-[10px]">
            <Sparkles className="h-3 w-3 mr-1" />
            Sponsored
          </Badge>
        )}
        {listing.is_featured && !listing.is_sponsored && (
          <Badge className="absolute top-3 right-3 bg-accent/15 text-accent border-accent/30 text-[10px]">
            Featured
          </Badge>
        )}

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl shrink-0">
            {getEmoji(index)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{listing.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{listing.author}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <Badge variant="secondary" className="text-[11px]">
            {listing.category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(listing.views)}
            </span>
            {listing.type !== "job" && (
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                {formatNumber(listing.upvotes)}
              </span>
            )}
          </div>
        </div>

        {listing.type === "job" && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {listing.company && (
              <span className="text-xs text-muted-foreground">{listing.company}</span>
            )}
            {listing.location && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs text-muted-foreground">{listing.location}</span>
              </>
            )}
            {listing.salary_range && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs text-primary font-medium">{listing.salary_range}</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
