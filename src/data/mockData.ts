// OpenClaw Directory — AI Agents & MCP Servers
// Type definitions and constants. All actual data comes from the real API.

export interface Listing {
  id: number | string;
  name: string;
  type: "skill" | "plugin" | "mcp_server" | "template" | "job";
  description: string;
  category: string;
  logo_url: string;
  website_url: string;
  github_url?: string;
  views: number;
  upvotes: number;
  stars?: number;
  status: "approved" | "pending" | "rejected";
  is_sponsored: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  author: string;
  company?: string;
  location?: string;
  job_type?: string;
  salary_range?: string;
}

export interface Ad {
  id: number | string;
  placement: "header" | "footer" | "sidebar" | "in-content";
  image_url: string;
  target_url: string;
  label: string;
  active: boolean;
}

export const LISTING_TYPES = [
  { value: "mcp_server", label: "MCP Server" },
  { value: "skill", label: "Agent Skill" },
  { value: "plugin", label: "Plugin" },
  { value: "template", label: "Template" },
  { value: "job", label: "Job" },
];

export const MCP_CATEGORIES = [
  "All", "File System", "Developer Tools", "Database", "Search",
  "Browser", "Communication", "Productivity", "Analytics", "Memory", "API",
];

export const SKILL_CATEGORIES = [
  "All", "Code Execution", "Memory", "Search", "Research",
  "Automation", "Writing", "Data", "Browser", "DevOps",
];

export const PLUGIN_CATEGORIES = [
  "All", "Analytics", "Integration", "Communication", "Storage",
  "Security", "API", "UI", "Voice", "Workflow",
];

export const TEMPLATE_CATEGORIES = [
  "All", "Research", "Developer Tools", "Customer Support",
  "Data Analysis", "Content", "Automation", "Productivity",
];

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
export const JOB_CATEGORIES = ["All", "Engineering", "Research", "Product", "Design", "Marketing"];

const EMOJIS = ["⚡", "🔧", "🌐", "🚀", "📊", "✍️", "🤖", "💻", "🔍", "🧠", "🛠️", "🗄️"];

export function getEmoji(index: number): string {
  return EMOJIS[index % EMOJIS.length];
}

export function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}

export const mockSkills: Listing[] = [];
export const mockPlugins: Listing[] = [];
export const mockJobs: Listing[] = [];
export const mockAds: Ad[] = [];
