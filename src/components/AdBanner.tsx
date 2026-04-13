import { Ad } from "@/data/mockData";

interface AdBannerProps {
  ad: Ad;
  className?: string;
}

export function AdBanner({ ad, className = "" }: AdBannerProps) {
  if (!ad.active) return null;

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block w-full ${className}`}
    >
      <div className="ad-slot px-4 py-3 hover:border-primary/40 transition-colors cursor-pointer group">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 border border-muted-foreground/20 px-1.5 py-0.5 rounded">
            Ad
          </span>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {ad.label}
          </span>
        </div>
      </div>
    </a>
  );
}

export function SidebarAd({ ad }: { ad: Ad }) {
  if (!ad.active) return null;

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block"
    >
      <div className="ad-slot flex-col gap-2 p-4 hover:border-primary/40 transition-colors cursor-pointer group" style={{ minHeight: "200px" }}>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 border border-muted-foreground/20 px-1.5 py-0.5 rounded">
          Sponsored
        </span>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center mt-2">
          {ad.label}
        </span>
      </div>
    </a>
  );
}
