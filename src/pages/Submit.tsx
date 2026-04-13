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
import { addSubmission } from "@/lib/adminStore";

export default function SubmitPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"skill" | "plugin" | "job">("skill");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [tags, setTags] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  const categories = type === "skill"
    ? SKILL_CATEGORIES.filter((c) => c !== "All")
    : type === "plugin"
    ? PLUGIN_CATEGORIES.filter((c) => c !== "All")
    : ["Engineering", "Product", "Design", "Research", "Marketing"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    addSubmission({
      id: `sub-${Date.now()}`,
      name,
      type,
      description,
      category,
      logo_url: "",
      website_url: website || "#",
      views: 0,
      upvotes: 0,
      status: "pending",
      is_sponsored: false,
      is_featured: false,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      created_at: new Date().toISOString().split("T")[0],
      author: email.split("@")[0] || "Anonymous",
      submitted_at: new Date().toISOString(),
      submitter_email: email,
      ...(type === "job" ? { company, location, job_type: jobType, salary_range: salary } : {}),
    });

    toast.success("Listing submitted for review!", {
      description: "An admin will approve it shortly. You can track your submission in the admin dashboard.",
    });
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Submit a Listing</h1>
        <p className="text-muted-foreground mb-8">Share an AI skill, plugin, or job with the community. Submissions require admin approval.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(["skill", "plugin", "job"] as const).map((t) => (
                <button key={t} type="button" onClick={() => { setType(t); setCategory(""); }}
                  className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
                  data-testid={`button-type-${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card border-border" data-testid="input-email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input id="name" placeholder={`Enter ${type} name`} value={name} onChange={(e) => setName(e.target.value)} className="bg-card border-border" required data-testid="input-name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea id="description" placeholder="Describe what this does..." value={description} onChange={(e) => setDescription(e.target.value)} className="bg-card border-border min-h-[120px]" required data-testid="input-description" />
          </div>

          <div className="space-y-2">
            <Label>Category <span className="text-destructive">*</span></Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-card border-border" data-testid="select-category">
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
            <Input id="website" type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-card border-border" data-testid="input-website" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="e.g. automation, workflow, api" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-card border-border" data-testid="input-tags" />
          </div>

          {type === "job" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. Remote, San Francisco" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Input id="jobType" placeholder="e.g. Full-time" value={jobType} onChange={(e) => setJobType(e.target.value)} className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" placeholder="e.g. $120k - $160k" value={salary} onChange={(e) => setSalary(e.target.value)} className="bg-card border-border" />
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base" data-testid="button-submit">
            Submit for Review
          </Button>
        </form>
      </div>
    </Layout>
  );
}
