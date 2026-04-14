import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Server, Zap, Puzzle, FileCode, Briefcase } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ListingCard } from "@/components/ListingCard";
import { useSearch } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_FILTERS = [
  { value: "", label: "All", icon: Search },
  { value: "mcp_server", label: "MCP Servers", icon: Server },
  { value: "skill", label: "Skills", icon: Zap },
  { value: "plugin", label: "Plugins", icon: Puzzle },
  { value: "template", label: "Templates", icon: FileCode },
  { value: "job", label: "Jobs", icon: Briefcase },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");

  const q = searchParams.get("q") || "";

  useSEO({
    title: q ? `"${q}" — Search Results | OpenClaw` : "Search AI Tools — OpenClaw",
    description: `Search across MCP servers, agent skills, plugins, templates and jobs on OpenClaw.`,
  });

  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
    setTypeFilter(searchParams.get("type") || "");
  }, [searchParams]);

  const { data: results, isLoading } = useSearch(q, typeFilter || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const params: Record<string, string> = { q: inputValue.trim() };
      if (typeFilter) params.type = typeFilter;
      setSearchParams(params);
    }
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
    if (q) {
      const params: Record<string, string> = { q };
      if (type) params.type = type;
      setSearchParams(params);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Search OpenClaw</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex items-center rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur p-1.5 focus-within:border-white/[0.18] transition-colors">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search MCP servers, skills, plugins, jobs..."
              className="w-full bg-transparent pl-9 pr-4 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            <button type="submit" className="btn-primary shrink-0 h-9 px-4 text-[13px]">
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeChange(f.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full transition-colors ${
                typeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-white/[0.07] bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-white/[0.14]"
              }`}
            >
              <f.icon className="h-3 w-3" />
              {f.label}
            </button>
          ))}
        </div>

        {!q && (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="text-[15px]">Type something to search across all AI tools</p>
            <p className="text-[13px] mt-2 opacity-60">MCP servers, skills, plugins, templates and jobs</p>
          </div>
        )}

        {q && isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        )}

        {q && !isLoading && results && results.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="text-[15px]">No results found for <span className="text-foreground font-medium">"{q}"</span></p>
            <p className="text-[13px] mt-2 opacity-60">Try different keywords or browse a category</p>
            <div className="flex gap-3 justify-center mt-6">
              <Link to="/mcp-servers" className="text-[13px] text-primary hover:underline">Browse MCP Servers</Link>
              <Link to="/jobs" className="text-[13px] text-primary hover:underline">Browse Jobs</Link>
              <Link to="/submit" className="text-[13px] text-primary hover:underline">Submit a Tool</Link>
            </div>
          </div>
        )}

        {q && !isLoading && results && results.length > 0 && (
          <>
            <p className="text-[13px] text-muted-foreground mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for <span className="text-foreground font-medium">"{q}"</span>
              {typeFilter && <span className="ml-1">in {TYPE_FILTERS.find(f => f.value === typeFilter)?.label}</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item, i) => <ListingCard key={item.id} listing={item} index={i} />)}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
