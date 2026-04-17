import { useState, useMemo, useEffect } from "react";
import { Search, Server, Github, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { useAds, useMcpServers } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";
import { MCP_CATEGORIES } from "@/data/mockData";
import { useSearchParams } from "react-router-dom";

const SORT_OPTIONS = ["Popular", "Newest", "Most Viewed"];

export default function MCPServersPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams]);

  const { data: mcpServers, isLoading, error } = useMcpServers();
  const { data: ads } = useAds();

  useSEO({
    title: "Best MCP Servers for Claude — OpenClaw Directory",
    description: "Browse the best Model Context Protocol (MCP) servers for Claude. Find MCP servers for file systems, databases, GitHub, Slack, browsers and more.",
    canonical: "https://openclaw.io/mcp-servers",
  });

  const sidebarAd = ads?.find((a) => a.placement === "sidebar");
  const headerAd = ads?.find((a) => a.placement === "header");

  const filtered = useMemo(() => {
    let items = [...(mcpServers || [])];
    if (search) items = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") items = items.filter((s) => s.category === category);

    const sponsored = items.filter((s) => s.is_sponsored);
    const rest = items.filter((s) => !s.is_sponsored);

    if (sort === "Popular") rest.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "Newest") rest.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else rest.sort((a, b) => b.views - a.views);

    return [...sponsored, ...rest];
  }, [search, category, sort, mcpServers]);

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
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MCP Servers</h1>
              <p className="text-muted-foreground text-sm">Model Context Protocol servers for Claude</p>
            </div>
          </div>
          {isLoading && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading…
            </span>
          )}
        </div>

        <p className="text-muted-foreground mb-6 mt-4 max-w-2xl text-sm leading-relaxed">
          MCP (Model Context Protocol) servers extend Claude's capabilities by connecting it to external tools and data sources. Browse and discover the best MCP servers built by Anthropic and the community.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400">
            Failed to load MCP servers. Please try refreshing.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search MCP servers…"
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
          {MCP_CATEGORIES.map((cat) => (
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
              ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : filtered.map((server, i) => <ListingCard key={server.id} listing={server} index={i} />)}
            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p className="mb-4">No MCP servers found matching your criteria.</p>
                {(search || category !== "All") && (
                  <button
                    onClick={() => { setSearch(""); setCategory("All"); }}
                    className="text-[13px] text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          {sidebarAd && (
            <div className="hidden lg:block w-[200px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
              <SidebarAd ad={{ ...sidebarAd, id: "ad-mcp-2", label: "🔌 Submit your MCP server — Free listing" }} />
            </div>
          )}
        </div>

        <div className="mt-16 rounded-xl border border-white/[0.07] bg-white/[0.02] p-8">
          <div className="flex items-start gap-3 mb-4">
            <Github className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold">What is MCP?</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
                The Model Context Protocol (MCP) is an open standard by Anthropic that lets Claude connect to external data sources and tools through a standardized interface. MCP servers are lightweight programs that expose capabilities — file access, database queries, API calls — that Claude can use during conversations.
              </p>
              <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline">
                Learn more about MCP →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
