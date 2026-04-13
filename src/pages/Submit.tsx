import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SKILL_CATEGORIES, PLUGIN_CATEGORIES } from "@/data/mockData";
import { toast } from "sonner";

export default function SubmitPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"skill" | "plugin" | "job">("skill");

  const categories = type === "skill" ? SKILL_CATEGORIES.filter((c) => c !== "All") : type === "plugin" ? PLUGIN_CATEGORIES.filter((c) => c !== "All") : ["Engineering", "Product", "Design", "Research", "Marketing"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Listing submitted for review!", { description: "An admin will approve it shortly." });
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Submit a Listing</h1>
        <p className="text-muted-foreground mb-8">Share an AI skill, plugin, or job with the community. Submissions require approval.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(["skill", "plugin", "job"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder={`Enter ${type} name`} className="bg-card border-border" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe what this does..." className="bg-card border-border min-h-[120px]" required />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" type="url" placeholder="https://..." className="bg-card border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="e.g. automation, workflow, api" className="bg-card border-border" />
          </div>

          {type === "job" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. Remote, San Francisco" className="bg-card border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Input id="jobType" placeholder="e.g. Full-time" className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" placeholder="e.g. $120k - $160k" className="bg-card border-border" />
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base">
            Submit for Review
          </Button>
        </form>
      </div>
    </Layout>
  );
}
