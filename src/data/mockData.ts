export interface Listing {
  id: string;
  name: string;
  type: "skill" | "plugin" | "job";
  description: string;
  category: string;
  logo_url: string;
  website_url: string;
  views: number;
  upvotes: number;
  status: "approved" | "pending" | "rejected";
  is_sponsored: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  author: string;
  // Job-specific
  company?: string;
  location?: string;
  job_type?: string;
  salary_range?: string;
}

export interface Ad {
  id: string;
  placement: "header" | "footer" | "sidebar" | "in-content";
  image_url: string;
  target_url: string;
  label: string;
  active: boolean;
}

export const SKILL_CATEGORIES = [
  "All", "Automation", "Productivity", "Browser", "DevOps", "Data", "Writing", "Design", "Code", "Research"
];

export const PLUGIN_CATEGORIES = [
  "All", "Tools", "Channels", "Integration", "Voice", "Analytics", "Security", "Storage", "API", "UI"
];

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

const skillEmojis = ["⚡", "🔧", "🌐", "🚀", "📊", "✍️", "🎨", "💻", "🔍", "🤖"];

export const mockSkills: Listing[] = [
  {
    id: "s1", name: "AutoFlow", type: "skill", description: "Automate complex workflows with natural language. Connect APIs, databases, and services effortlessly.", category: "Automation", logo_url: "", website_url: "#", views: 12400, upvotes: 892, status: "approved", is_sponsored: true, is_featured: false, tags: ["workflow", "automation", "api"], created_at: "2025-12-01", author: "FlowLabs"
  },
  {
    id: "s2", name: "BrowserPilot", type: "skill", description: "Control web browsers programmatically. Navigate, scrape, and interact with any website.", category: "Browser", logo_url: "", website_url: "#", views: 8900, upvotes: 654, status: "approved", is_sponsored: false, is_featured: true, tags: ["browser", "scraping", "web"], created_at: "2025-11-15", author: "WebAI Inc"
  },
  {
    id: "s3", name: "DataForge", type: "skill", description: "Transform, analyze, and visualize data using conversational commands.", category: "Data", logo_url: "", website_url: "#", views: 15200, upvotes: 1103, status: "approved", is_sponsored: false, is_featured: true, tags: ["data", "analytics", "visualization"], created_at: "2025-10-20", author: "DataMinds"
  },
  {
    id: "s4", name: "CodeReview Pro", type: "skill", description: "AI-powered code review with security analysis, performance tips, and best practices.", category: "Code", logo_url: "", website_url: "#", views: 9800, upvotes: 732, status: "approved", is_sponsored: false, is_featured: false, tags: ["code", "review", "security"], created_at: "2025-11-01", author: "DevTools Co"
  },
  {
    id: "s5", name: "WriteMaster", type: "skill", description: "Generate, edit, and refine professional content. Blog posts, emails, reports, and more.", category: "Writing", logo_url: "", website_url: "#", views: 11300, upvotes: 845, status: "approved", is_sponsored: false, is_featured: false, tags: ["writing", "content", "editing"], created_at: "2025-09-28", author: "ContentAI"
  },
  {
    id: "s6", name: "DeployBot", type: "skill", description: "One-click deployments to any cloud provider. Manage infrastructure with plain English.", category: "DevOps", logo_url: "", website_url: "#", views: 7600, upvotes: 521, status: "approved", is_sponsored: true, is_featured: false, tags: ["deploy", "cloud", "infrastructure"], created_at: "2025-10-15", author: "CloudOps"
  },
  {
    id: "s7", name: "ResearchBot", type: "skill", description: "Deep research assistant that finds, summarizes, and cites academic papers and articles.", category: "Research", logo_url: "", website_url: "#", views: 6400, upvotes: 478, status: "approved", is_sponsored: false, is_featured: false, tags: ["research", "academic", "summary"], created_at: "2025-11-20", author: "ScholarAI"
  },
  {
    id: "s8", name: "DesignSync", type: "skill", description: "Convert Figma designs to production-ready code. Supports React, Vue, and Svelte.", category: "Design", logo_url: "", website_url: "#", views: 13100, upvotes: 967, status: "approved", is_sponsored: false, is_featured: true, tags: ["design", "figma", "code-gen"], created_at: "2025-10-05", author: "PixelForge"
  },
];

export const mockPlugins: Listing[] = [
  {
    id: "p1", name: "Slack Bridge", type: "plugin", description: "Connect your AI assistant directly to Slack channels. Send, receive, and manage messages.", category: "Channels", logo_url: "", website_url: "#", views: 18200, upvotes: 1340, status: "approved", is_sponsored: false, is_featured: true, tags: ["slack", "messaging", "integration"], created_at: "2025-11-10", author: "IntegrateHQ"
  },
  {
    id: "p2", name: "Stripe Toolkit", type: "plugin", description: "Manage payments, subscriptions, and invoices through your AI assistant.", category: "Tools", logo_url: "", website_url: "#", views: 14500, upvotes: 1089, status: "approved", is_sponsored: true, is_featured: false, tags: ["stripe", "payments", "billing"], created_at: "2025-10-25", author: "FinAI"
  },
  {
    id: "p3", name: "VoiceFlow", type: "plugin", description: "Add voice interaction to your AI assistant. Speech-to-text and text-to-speech.", category: "Voice", logo_url: "", website_url: "#", views: 9700, upvotes: 723, status: "approved", is_sponsored: false, is_featured: false, tags: ["voice", "speech", "audio"], created_at: "2025-09-30", author: "VoiceLabs"
  },
  {
    id: "p4", name: "S3 Vault", type: "plugin", description: "Seamless file storage and retrieval with AWS S3. Upload, organize, and share files.", category: "Storage", logo_url: "", website_url: "#", views: 8300, upvotes: 612, status: "approved", is_sponsored: false, is_featured: true, tags: ["storage", "aws", "files"], created_at: "2025-11-05", author: "CloudFiles"
  },
  {
    id: "p5", name: "GraphQL Hub", type: "plugin", description: "Auto-generate GraphQL schemas and resolvers from natural language descriptions.", category: "API", logo_url: "", website_url: "#", views: 7100, upvotes: 534, status: "approved", is_sponsored: false, is_featured: false, tags: ["graphql", "api", "schema"], created_at: "2025-10-18", author: "APIForge"
  },
  {
    id: "p6", name: "SecurityShield", type: "plugin", description: "Real-time threat detection and vulnerability scanning for your applications.", category: "Security", logo_url: "", website_url: "#", views: 11800, upvotes: 876, status: "approved", is_sponsored: true, is_featured: false, tags: ["security", "scanning", "threats"], created_at: "2025-10-10", author: "SecureAI"
  },
];

export const mockJobs: Listing[] = [
  {
    id: "j1", name: "Senior AI Engineer", type: "job", description: "Build and deploy production AI systems. Experience with LLMs, RAG, and fine-tuning required.", category: "Engineering", logo_url: "", website_url: "#", views: 3200, upvotes: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["ai", "ml", "engineering"], created_at: "2025-12-01", author: "TechCorp", company: "TechCorp AI", location: "San Francisco, CA", job_type: "Full-time", salary_range: "$180k - $250k"
  },
  {
    id: "j2", name: "AI Product Manager", type: "job", description: "Lead product strategy for AI-powered tools. Strong technical background preferred.", category: "Product", logo_url: "", website_url: "#", views: 2100, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["product", "ai", "strategy"], created_at: "2025-11-28", author: "InnovateCo", company: "InnovateCo", location: "Remote", job_type: "Full-time", salary_range: "$150k - $200k"
  },
  {
    id: "j3", name: "ML Ops Engineer", type: "job", description: "Design and maintain ML infrastructure. Kubernetes, Docker, and CI/CD experience required.", category: "Engineering", logo_url: "", website_url: "#", views: 1800, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["mlops", "infrastructure", "devops"], created_at: "2025-11-25", author: "ScaleAI", company: "ScaleAI Labs", location: "New York, NY", job_type: "Full-time", salary_range: "$160k - $220k"
  },
  {
    id: "j4", name: "AI Research Intern", type: "job", description: "Join our research team exploring novel architectures for language understanding.", category: "Research", logo_url: "", website_url: "#", views: 4500, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["research", "intern", "nlp"], created_at: "2025-11-20", author: "DeepMind", company: "DeepThought AI", location: "London, UK", job_type: "Internship", salary_range: "$50k - $70k"
  },
  {
    id: "j5", name: "Prompt Engineer", type: "job", description: "Craft and optimize prompts for enterprise AI applications. Creative and technical role.", category: "Engineering", logo_url: "", website_url: "#", views: 5600, upvotes: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["prompt", "llm", "engineering"], created_at: "2025-12-03", author: "PromptLabs", company: "PromptLabs Inc", location: "Remote", job_type: "Contract", salary_range: "$120k - $160k"
  },
];

export const mockAds: Ad[] = [
  { id: "ad1", placement: "header", image_url: "", target_url: "#", label: "🚀 Build AI Apps 10x Faster — Try FlowEngine Free", active: true },
  { id: "ad2", placement: "footer", image_url: "", target_url: "#", label: "⚡ Sponsor this space — Reach 50k+ AI developers monthly", active: true },
  { id: "ad3", placement: "sidebar", image_url: "", target_url: "#", label: "📊 AI Analytics Suite — Free Trial", active: true },
  { id: "ad4", placement: "in-content", image_url: "", target_url: "#", label: "🎯 Advertise Here — Contact us for rates", active: true },
];

export function getEmoji(index: number): string {
  return skillEmojis[index % skillEmojis.length];
}

export function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}
