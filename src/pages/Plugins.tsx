import { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { PLUGIN_CATEGORIES } from "@/data/mockData";
import { usePlugins, useAds } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";

const SORT_OPTIONS = ["Popular", "Newest", "Most Viewed"];

export default function PluginsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  const { data: plugins, isLoading, error } = usePlugins();
  const { data: ads } = useAds();

  useSEO({
    title: "AI Plugins Directory — OpenClaw",
    description: "Browse the best AI plugins and integrations. Connect your AI assistant to analytics, communication, storage and more tools.",
    canonical: "https://openclaw.io/plugins",
  });

  const sidebarAd = ads?.find((a) => a.placement === "sidebar");
  const headerAd = ads?.find((a) => a.placement === "header");

  const filtered = useMemo(() => {
    let items = [...(plugins || [])];
    if (search) items = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") items = items.filter((s) => s.category === category);
    const sponsored = items.filter((s) => s.is_sponsored);
    const rest = items.filter((s) => !s.is_sponsored);
    if (sort === "Popular") rest.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "Newest") rest.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else rest.sort((a, b) => b.views - a.views);
    return [...sponsored, ...rest];
  }, [search, category, sort, plugins]);

  return (
    <Layout>
      {headerAd && (
        <div className="container mx-auto px-4 max-w-6xl pt-3">
          <AdBanner ad={headerAd} />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">AI Plugins</h1>
          {isLoading && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading…
            </span>
          )}
        </div>
        <p className="text-muted-foreground mb-6">Extend your AI assistant with powerful integrations</p>

        {error && (
          <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400">
            Failed to load plugins. Please try refreshing.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plugins…" className="pl-10 bg-card border-border" data-testid="input-search-plugins" />
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-2 text-sm rounded-lg transition-colors ${sort === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {PLUGIN_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : filtered.map((plugin, i) => <ListingCard key={plugin.id} listing={plugin} index={i + 5} />)}
            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">No plugins found.</div>
            )}
          </div>
          {sidebarAd && (
            <div className="hidden lg:block w-[200px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
              <SidebarAd ad={{ ...sidebarAd, id: "ad-plugins-2", label: "🔌 List your plugin — Free submission" }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
