import { Ad } from "@/data/mockData";
import { ExternalLink } from "lucide-react";

interface PromoProps {
  ad: Ad;
  className?: string;
}

export function PromoStrip({ ad, className = "" }: PromoProps) {
  if (!ad.active) return null;

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full group ${className}`}
    >
      <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-lg overflow-hidden transition-all duration-200 bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.06] hover:border-white/[0.12]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-transparent pointer-events-none" />
        <span className="relative shrink-0 text-[9px] uppercase tracking-[0.12em] font-semibold text-primary/50 border border-primary/20 bg-primary/[0.06] px-1.5 py-0.5 rounded">
          featured
        </span>
        <span className="relative flex-1 text-[12.5px] text-muted-foreground/65 group-hover:text-muted-foreground/90 transition-colors leading-snug truncate">
          {ad.label}
        </span>
        <ExternalLink className="relative shrink-0 h-3 w-3 text-muted-foreground/25 group-hover:text-primary/50 transition-colors" />
      </div>
    </a>
  );
}

export function SpotlightCard({ ad }: { ad: Ad }) {
  if (!ad.active) return null;

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl overflow-hidden transition-all duration-200 border border-white/[0.07] hover:border-white/[0.13] bg-white/[0.02] hover:bg-white/[0.04] min-h-[180px] text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
        <span className="relative text-[9px] uppercase tracking-[0.12em] font-semibold text-primary/45 border border-primary/15 bg-primary/[0.06] px-1.5 py-0.5 rounded">
          partner
        </span>
        <span className="relative text-[12px] text-muted-foreground/55 group-hover:text-muted-foreground/85 transition-colors leading-relaxed">
          {ad.label}
        </span>
        <span className="relative flex items-center gap-1 text-[10px] text-primary/40 group-hover:text-primary/70 transition-colors font-medium">
          Learn more <ExternalLink className="h-2.5 w-2.5" />
        </span>
      </div>
    </a>
  );
}

// Aliases for existing import compatibility
export const AdBanner = PromoStrip;
export const SidebarAd = SpotlightCard;
