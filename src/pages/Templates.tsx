import { useState, useMemo } from "react";
import { Search, FileCode, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { useAds, useTemplates } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";
import { TEMPLATE_CATEGORIES } from "@/data/mockData";

const SORT_OPTIONS = ["Popular", "Newest", "Most Viewed"];

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  const { data: templates, isLoading, error } = useTemplates();
  const { data: ads } = useAds();

  useSEO({
    title: "AI Agent Templates — OpenClaw Directory",
    description: "Browse ready-to-use AI agent templates. Research agents, code review bots, customer support agents and more. Built for Claude and compatible LLMs.",
    canonical: "https://openclaw.io/templates",
  });

  const sidebarAd = ads?.find((a) => a.placement === "sidebar");
  const headerAd = ads?.find((a) => a.placement === "header");

  const filtered = useMemo(() => {
    let items = [...(templates || [])];
    if (search) items = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") items = items.filter((s) => s.category === category);

    const sponsored = items.filter((s) => s.is_sponsored);
    const rest = items.filter((s) => !s.is_sponsored);

    if (sort === "Popular") rest.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "Newest") rest.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else rest.sort((a, b) => b.views - a.views);

    return [...sponsored, ...rest];
  }, [search, category, sort, templates]);

  return (
    <Layout>
      {headerAd && (
        <div className="container mx-auto px-4 max-w-6xl pt-3">
          <AdBanner ad={headerAd} />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Agent Templates</h1>
              <p className="text-muted-foreground text-sm">Ready-to-deploy AI agent blueprints</p>
            </div>
          </div>
          {isLoading && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading…
            </span>
          )}
        </div>

        <p className="text-muted-foreground mb-6 mt-4 max-w-2xl text-sm leading-relaxed">
          Skip the boilerplate. These agent templates are battle-tested blueprints for common AI use cases. Fork them, adapt them, and ship faster.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400">
            Failed to load templates. Please try refreshing.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${sort === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : filtered.map((template, i) => <ListingCard key={template.id} listing={template} index={i} />)}
            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No templates found. <a href="/submit" className="text-primary hover:underline">Submit one!</a>
              </div>
            )}
          </div>
          {sidebarAd && (
            <div className="hidden lg:block w-[200px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
