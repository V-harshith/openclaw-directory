import { Link } from "react-router-dom";
import { Search, Zap, Puzzle, Briefcase, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { mockAds } from "@/data/mockData";
import { useSkills, usePlugins } from "@/hooks/useListings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  { label: "Skills", value: "240+", icon: Zap },
  { label: "Plugins", value: "180+", icon: Puzzle },
  { label: "Jobs", value: "85+", icon: Briefcase },
  { label: "Contributors", value: "12k+", icon: TrendingUp },
];

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

  const popularSkills = [...(skills || [])].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);
  const featuredPlugins = (plugins || []).filter((p) => p.is_featured || p.is_sponsored).slice(0, 6);

  return (
    <Layout>
      {headerAd && <AdBanner ad={headerAd} />}

      <section className="container mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Discover AI <span className="gradient-text">Skills & Plugins</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          The largest open directory of AI assistant capabilities. Find, share, and build with the best AI tools.
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, plugins, and tools..."
            className="pl-12 pr-28 h-14 text-base bg-card border-border rounded-xl focus-visible:ring-primary"
            data-testid="input-search-hero"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            data-testid="button-search-submit"
          >
            Search
          </Button>
        </form>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Skills</h2>
          <Link to="/skills" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
            : popularSkills.map((skill, i) => <ListingCard key={skill.id} listing={skill} index={i} />)}
        </div>
      </section>

      <div className="container mx-auto px-4">
        {mockAds.find((a) => a.placement === "in-content") && (
          <AdBanner ad={mockAds.find((a) => a.placement === "in-content")!} />
        )}
      </div>

      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Plugins</h2>
          <Link to="/plugins" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginsLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
            : featuredPlugins.map((plugin, i) => <ListingCard key={plugin.id} listing={plugin} index={i + 5} />)}
        </div>
      </section>

      {footerAd && (
        <div className="container mx-auto px-4 pb-8">
          <AdBanner ad={footerAd} />
        </div>
      )}
    </Layout>
  );
};

export default Index;
