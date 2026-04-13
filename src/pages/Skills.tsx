import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { AdBanner, SidebarAd } from "@/components/AdBanner";
import { ListingCard } from "@/components/ListingCard";
import { mockSkills, mockAds, SKILL_CATEGORIES } from "@/data/mockData";
import { useSearchParams } from "react-router-dom";

const SORT_OPTIONS = ["Popular", "Newest", "Most Viewed"];

export default function SkillsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  const sidebarAd = mockAds.find((a) => a.placement === "sidebar");
  const headerAd = mockAds.find((a) => a.placement === "header");

  const filtered = useMemo(() => {
    let items = [...mockSkills];
    if (search) items = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") items = items.filter((s) => s.category === category);
    
    // Sponsored first
    const sponsored = items.filter((s) => s.is_sponsored);
    const rest = items.filter((s) => !s.is_sponsored);
    
    if (sort === "Popular") rest.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "Newest") rest.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else rest.sort((a, b) => b.views - a.views);
    
    return [...sponsored, ...rest];
  }, [search, category, sort]);

  return (
    <Layout>
      {headerAd && <AdBanner ad={headerAd} />}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">AI Skills</h1>
        <p className="text-muted-foreground mb-6">Browse and discover AI assistant capabilities</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
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
          {SKILL_CATEGORIES.map((cat) => (
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
            {filtered.map((skill, i) => (
              <ListingCard key={skill.id} listing={skill} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No skills found matching your criteria.
              </div>
            )}
          </div>
          {sidebarAd && (
            <div className="hidden lg:block w-[200px] shrink-0 space-y-4">
              <SidebarAd ad={sidebarAd} />
              <SidebarAd ad={{ ...sidebarAd, id: "ad-extra", label: "🔥 Promote Your AI Tool — Get Featured" }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
