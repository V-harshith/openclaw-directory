import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { LISTING_TYPES, MCP_CATEGORIES, SKILL_CATEGORIES, PLUGIN_CATEGORIES, TEMPLATE_CATEGORIES } from "@/data/mockData";
import { useSEO } from "@/hooks/useSEO";

export default function SubmitPage() {
  const navigate = useNavigate();
  useSEO({
    title: "Submit a Listing — OpenClaw AI Directory",
    description: "Submit your MCP server, AI agent skill, plugin, template, or job to OpenClaw. Reach thousands of AI builders and Claude users.",
    canonical: "https://openclaw.io/submit",
  });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"mcp_server" | "skill" | "plugin" | "template" | "job">("mcp_server");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [tags, setTags] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  const categories = type === "mcp_server" ? MCP_CATEGORIES.filter((c) => c !== "All")
    : type === "skill" ? SKILL_CATEGORIES.filter((c) => c !== "All")
    : type === "plugin" ? PLUGIN_CATEGORIES.filter((c) => c !== "All")
    : type === "template" ? TEMPLATE_CATEGORIES.filter((c) => c !== "All")
    : ["Engineering", "Product", "Design", "Research", "Marketing"];

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (website && !isValidUrl(website)) {
      toast.error("Invalid website URL. Must start with http:// or https://");
      return;
    }
    if (github && !isValidUrl(github)) {
      toast.error("Invalid GitHub URL. Must start with https://github.com/...");
      return;
    }
    setLoading(true);
    try {
      await api.createSubmission({
        name,
        type,
        description,
        category,
        website_url: website || "#",
        github_url: github || "",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author: email.split("@")[0] || "Anonymous",
        submitter_email: email,
        status: "pending",
        ...(type === "job" ? { company, location, job_type: jobType, salary_range: salary } : {}),
      });
      toast.success("Submitted for review!", {
        description: "An admin will approve your listing shortly.",
      });
      navigate("/");
    } catch (err: any) {
      toast.error("Submission failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-6xl py-14">
        <div className="max-w-xl mx-auto">
          <h1 className="text-[26px] font-bold tracking-tight mb-1.5">Submit a Listing</h1>
          <p className="text-[14px] text-muted-foreground mb-8">
            Share an MCP server, agent skill, plugin, template, or job. All submissions require admin approval before going live.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[12px] text-muted-foreground uppercase tracking-wider">Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {LISTING_TYPES.map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => { setType(t.value as any); setCategory(""); }}
                    className={`px-3.5 py-1.5 text-[13px] rounded-lg transition-colors ${type === t.value ? "bg-primary text-primary-foreground" : "surface text-muted-foreground hover:text-foreground"}`}
                    data-testid={`button-type-${t.value}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] text-muted-foreground">Your Email <span className="opacity-50">(optional, for updates)</span></Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.03] border-white/[0.09] h-10" data-testid="input-email" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[12px] text-muted-foreground">Name <span className="text-primary">*</span></Label>
              <Input id="name" placeholder={`${type === "mcp_server" ? "MCP server" : type} name`}
                value={name} onChange={(e) => setName(e.target.value)}
                className="bg-white/[0.03] border-white/[0.09] h-10" required data-testid="input-name" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[12px] text-muted-foreground">Description <span className="text-primary">*</span></Label>
              <Textarea id="description" placeholder="Describe what it does, what problems it solves..."
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="bg-white/[0.03] border-white/[0.09] min-h-[110px]" required data-testid="input-description" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Category <span className="text-primary">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/[0.03] border-white/[0.09] h-10" data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-[12px] text-muted-foreground">Website URL</Label>
                <Input id="website" type="url" placeholder="https://..." value={website}
                  onChange={(e) => setWebsite(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-[12px] text-muted-foreground">GitHub URL</Label>
                <Input id="github" type="url" placeholder="https://github.com/..." value={github}
                  onChange={(e) => setGithub(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-[12px] text-muted-foreground">Tags <span className="opacity-50">(comma separated)</span></Label>
              <Input id="tags" placeholder="e.g. mcp, claude, filesystem" value={tags}
                onChange={(e) => setTags(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
            </div>

            {type === "job" && (
              <div className="space-y-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Job Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-muted-foreground">Company</Label>
                    <Input placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-muted-foreground">Location</Label>
                    <Input placeholder="Remote, San Francisco…" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-muted-foreground">Job Type</Label>
                    <Input placeholder="Full-time, Contract…" value={jobType} onChange={(e) => setJobType(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-muted-foreground">Salary Range</Label>
                    <Input placeholder="$120k – $160k" value={salary} onChange={(e) => setSalary(e.target.value)} className="bg-white/[0.03] border-white/[0.09] h-10" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full h-11 text-[14px] font-medium disabled:opacity-50 mt-2"
              data-testid="button-submit">
              {loading ? "Submitting…" : "Submit for Review"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
