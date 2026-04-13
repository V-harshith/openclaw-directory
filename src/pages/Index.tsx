import { Link } from "react-router-dom";
import { Search, Zap, Puzzle, Briefcase, Users, ArrowRight, Star, Github } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { mockAds } from "@/data/mockData";
import { useSkills, usePlugins } from "@/hooks/useListings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: plugins, isLoading: pluginsLoading } = usePlugins();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/skills?q=${encodeURIComponent(search)}`);
  };

  const headerAd = mockAds.find((a) => a.placement === "header");
  const footerAd = mockAds.find((a) => a.placement === "footer");
  const inContentAd = mockAds.find((a) => a.placement === "in-content");

  const popularSkills = [...(skills || [])].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);
  const featuredPlugins = (plugins || []).filter((p) => p.is_featured || p.is_sponsored).slice(0, 6);

  const totalListings = (skills?.length || 0) + (plugins?.length || 0);

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

          {/* Pill badge */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-all mb-8 animate-fade-up"
          >
            <Github className="h-3.5 w-3.5" />
            Live data from GitHub public API
            <ArrowRight className="h-3 w-3 text-primary" />
          </a>

          <h1 className="animate-fade-up animate-delay-100 text-balance text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] font-bold tracking-tight leading-[1.08] text-foreground">
            Discover AI Skills
            <br />
            <span className="gradient-text">&amp; Plugins</span>
          </h1>

          <p className="animate-fade-up animate-delay-200 mt-5 text-[15px] md:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The open directory of AI assistant capabilities.
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
                placeholder="Search MCP servers, plugins, skills…"
                className="w-full bg-transparent pl-9 pr-4 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                data-testid="input-search-hero"
              />
              <button
                type="submit"
                className="btn-primary shrink-0 h-9 px-4 text-[13px]"
                data-testid="button-search-submit"
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats row */}
          <div className="animate-fade-up animate-delay-300 mt-10 flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Zap, label: "Skills", value: skillsLoading ? "…" : `${skills?.length || 0}+` },
              { icon: Puzzle, label: "Plugins", value: pluginsLoading ? "…" : `${plugins?.length || 0}+` },
              { icon: Briefcase, label: "Jobs", value: "85+" },
              { icon: Users, label: "Contributors", value: "12k+" },
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

      {/* Popular Skills */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[19px] font-semibold tracking-tight">Popular Skills</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Top-ranked by GitHub stars</p>
          </div>
          <Link to="/skills" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skillsLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[148px] rounded-xl bg-white/[0.04]" />)
            : popularSkills.map((skill, i) => <ListingCard key={skill.id} listing={skill} index={i} />)}
        </div>
      </section>

      {inContentAd && (
        <div className="container mx-auto px-4 max-w-6xl">
          <AdBanner ad={inContentAd} />
        </div>
      )}

      {/* Featured Plugins */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[19px] font-semibold tracking-tight">Featured Plugins</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Sponsored &amp; editor picks</p>
          </div>
          <Link to="/plugins" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pluginsLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[148px] rounded-xl bg-white/[0.04]" />)
            : featuredPlugins.map((plugin, i) => <ListingCard key={plugin.id} listing={plugin} index={i + 5} />)}
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
              Submit your skill, plugin, or job listing to reach thousands of AI developers and enthusiasts.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/submit">
                <button className="btn-primary h-10 px-6 text-[14px] flex items-center gap-2">
                  Submit a Listing <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/skills">
                <button className="btn-ghost h-10 px-6 text-[14px]">
                  Browse directory
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
