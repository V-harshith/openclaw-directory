import { Ad } from "@/data/mockData";

interface BarNoticeProps {
  ad: Ad;
  className?: string;
}

export function AdBanner({ ad, className = "" }: BarNoticeProps) {
  if (!ad.active) return null;

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full ${className}`}
    >
      <div className="group flex items-center gap-3 px-4 py-3 border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.09] transition-all rounded-lg cursor-pointer">
        <span className="shrink-0 text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/40 border border-white/[0.08] px-1.5 py-0.5 rounded">
          partner
        </span>
        <span className="text-[12.5px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          {ad.label}
        </span>
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
      rel="noopener noreferrer"
      className="block"
    >
      <div className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer min-h-[180px] text-center">
        <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/35 border border-white/[0.07] px-1.5 py-0.5 rounded">
          featured
        </span>
        <span className="text-[12px] text-muted-foreground/60 group-hover:text-muted-foreground/90 transition-colors leading-relaxed">
          {ad.label}
        </span>
      </div>
    </a>
  );
}
