import { Link } from "react-router-dom";
import { Search, Zap, Puzzle, Briefcase, ArrowRight, Server, FileCode } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { useSkills, usePlugins, useMcpServers, useAds } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: plugins, isLoading: pluginsLoading } = usePlugins();
  const { data: mcpServers, isLoading: mcpLoading } = useMcpServers();
  const { data: ads } = useAds();

  useSEO({
    title: "OpenClaw — #1 MCP Servers, AI Skills & Plugins Directory",
    description: "Discover the best MCP servers, AI agent skills, plugins, templates and jobs. The open directory trusted by AI developers. Find and share tools for Claude and more.",
    canonical: "https://openclaw.io/",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/mcp-servers?q=${encodeURIComponent(search)}`);
  };

  const headerAd = ads?.find((a) => a.placement === "header");
  const footerAd = ads?.find((a) => a.placement === "footer");
  const inContentAd = ads?.find((a) => a.placement === "in-content");

  const popularMcp = [...(mcpServers || [])].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);
  const popularSkills = [...(skills || [])].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  const featuredPlugins = (plugins || []).filter((p) => p.is_featured || p.is_sponsored).slice(0, 3);

  return (
    <Layout>

      {headerAd && (
        <div className="container mx-auto px-4 max-w-6xl pt-3">
          <AdBanner ad={headerAd} />
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />

        <div className="relative container mx-auto px-4 max-w-6xl pt-20 pb-16 text-center">

          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-all mb-8 animate-fade-up"
          >
            <Server className="h-3.5 w-3.5" />
            The #1 directory for MCP servers & AI tools
            <ArrowRight className="h-3 w-3 text-primary" />
          </a>

          <h1 className="animate-fade-up animate-delay-100 text-balance text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] font-bold tracking-tight leading-[1.08] text-foreground">
            Discover MCP Servers
            <br />
            <span className="gradient-text">&amp; AI Tools</span>
          </h1>

          <p className="animate-fade-up animate-delay-200 mt-5 text-[15px] md:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The open directory for AI MCP servers, agent skills, plugins, templates and jobs.
            Find, share, and build with the best tools in the ecosystem.
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-up animate-delay-300 mt-9 max-w-lg mx-auto"
          >
            <div className="relative flex items-center rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur p-1.5 focus-within:border-white/[0.18] transition-colors">
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search MCP servers, skills, plugins…"
                className="w-full bg-transparent pl-9 pr-4 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                aria-label="Search AI tools"
              />
              <button
                type="submit"
                className="btn-primary shrink-0 h-9 px-4 text-[13px]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats row */}
          <div className="animate-fade-up animate-delay-300 mt-10 flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Server, label: "MCP Servers", value: mcpLoading ? "…" : `${mcpServers?.length || 0}+` },
              { icon: Zap, label: "Skills", value: skillsLoading ? "…" : `${skills?.length || 0}+` },
              { icon: Puzzle, label: "Plugins", value: pluginsLoading ? "…" : `${plugins?.length || 0}+` },
              { icon: FileCode, label: "Templates", value: "30+" },
              { icon: Briefcase, label: "AI Jobs", value: "200+" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <stat.icon className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-semibold text-foreground/80">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Category Nav */}
      <section className="container mx-auto px-4 max-w-6xl pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: "MCP Servers", to: "/mcp-servers", icon: Server },
            { label: "Agent Skills", to: "/skills", icon: Zap },
            { label: "Plugins", to: "/plugins", icon: Puzzle },
            { label: "Templates", to: "/templates", icon: FileCode },
            { label: "AI Jobs", to: "/jobs", icon: Briefcase },
          ].map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.03] text-[13px] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-all"
            >
              <cat.icon className="h-3.5 w-3.5 text-primary/60" />
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular MCP Servers */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[19px] font-semibold tracking-tight">Top MCP Servers</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Most popular Model Context Protocol servers</p>
          </div>
          <Link to="/mcp-servers" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mcpLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[148px] rounded-xl bg-white/[0.04]" />)
            : popularMcp.map((server, i) => <ListingCard key={server.id} listing={server} index={i} />)}
        </div>
      </section>

      {inContentAd && (
        <div className="container mx-auto px-4 max-w-6xl">
          <AdBanner ad={inContentAd} />
        </div>
      )}

      {/* Skills + Plugins split */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[17px] font-semibold">Popular Skills</h2>
                <p className="text-[12px] text-muted-foreground">AI agent capabilities</p>
              </div>
              <Link to="/skills" className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors">
                All skills <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {skillsLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[110px] rounded-xl" />)
                : popularSkills.map((skill, i) => <ListingCard key={skill.id} listing={skill} index={i} />)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[17px] font-semibold">Featured Plugins</h2>
                <p className="text-[12px] text-muted-foreground">Integrations & extensions</p>
              </div>
              <Link to="/plugins" className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors">
                All plugins <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {pluginsLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[110px] rounded-xl" />)
                : featuredPlugins.map((plugin, i) => <ListingCard key={plugin.id} listing={plugin} index={i + 5} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-6xl py-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
          <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
          <div className="relative">
            <h2 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">
              Built an AI tool? List it for free.
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-md mx-auto mb-7">
              Submit your MCP server, skill, plugin or job listing to reach thousands of AI developers and builders daily.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/submit">
                <button className="btn-primary h-10 px-6 text-[14px] flex items-center gap-2">
                  Submit a Listing <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/about">
                <button className="btn-ghost h-10 px-6 text-[14px]">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {footerAd && (
        <div className="container mx-auto px-4 max-w-6xl pb-8">
          <AdBanner ad={footerAd} />
        </div>
      )}
    </Layout>
  );
};

export default Index;
