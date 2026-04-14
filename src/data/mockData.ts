// OpenClaw Directory — AI Agents & MCP Servers
// Type definitions, constants, and seed data for localStorage-based operation.

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
  return EMOJIS[Math.abs(Number(index)) % EMOJIS.length];
}

export function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}

// ── Seed Data ──────────────────────────────────────────────

export const seedMcpServers: Listing[] = [
  { id: 1, name: "Filesystem MCP", type: "mcp_server", description: "Read, write, and manage local files and directories through Claude. Supports watching for changes and recursive operations.", category: "File System", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 14200, upvotes: 892, stars: 892, status: "approved", is_sponsored: false, is_featured: true, tags: ["filesystem", "local", "read-write"], created_at: "2025-11-15", author: "Anthropic" },
  { id: 2, name: "GitHub MCP Server", type: "mcp_server", description: "Interact with GitHub repos, issues, PRs, and actions directly from Claude. Search code, create branches, and review diffs.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 11800, upvotes: 764, stars: 764, status: "approved", is_sponsored: true, is_featured: true, tags: ["github", "git", "code-review"], created_at: "2025-11-20", author: "Anthropic" },
  { id: 3, name: "PostgreSQL MCP", type: "mcp_server", description: "Query and manage PostgreSQL databases with natural language. Execute SQL, inspect schemas, and visualize results.", category: "Database", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 9400, upvotes: 621, stars: 621, status: "approved", is_sponsored: false, is_featured: false, tags: ["postgres", "sql", "database"], created_at: "2025-12-01", author: "Anthropic" },
  { id: 4, name: "Brave Search MCP", type: "mcp_server", description: "Search the web using Brave Search API. Get real-time results, news, and summaries without leaving your conversation.", category: "Search", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 8700, upvotes: 543, stars: 543, status: "approved", is_sponsored: false, is_featured: false, tags: ["search", "web", "brave"], created_at: "2025-12-10", author: "Anthropic" },
  { id: 5, name: "Puppeteer MCP", type: "mcp_server", description: "Control a headless browser from Claude. Navigate pages, take screenshots, fill forms, and scrape structured data.", category: "Browser", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 7600, upvotes: 489, stars: 489, status: "approved", is_sponsored: false, is_featured: true, tags: ["browser", "puppeteer", "scraping"], created_at: "2025-12-15", author: "Anthropic" },
  { id: 6, name: "Slack MCP Server", type: "mcp_server", description: "Send messages, read channels, search history, and manage Slack workspaces through Claude.", category: "Communication", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 6800, upvotes: 412, stars: 412, status: "approved", is_sponsored: false, is_featured: false, tags: ["slack", "messaging", "team"], created_at: "2026-01-05", author: "Anthropic" },
  { id: 7, name: "Notion MCP", type: "mcp_server", description: "Read and write Notion pages, databases, and blocks. Sync your knowledge base with Claude for contextual assistance.", category: "Productivity", logo_url: "", website_url: "#", github_url: "https://github.com/makenotion/notion-mcp", views: 5900, upvotes: 387, stars: 387, status: "approved", is_sponsored: false, is_featured: false, tags: ["notion", "docs", "wiki"], created_at: "2026-01-12", author: "Notion Labs" },
  { id: 8, name: "Sentry MCP Server", type: "mcp_server", description: "Query error logs, stack traces, and performance data from Sentry. Debug production issues with AI-powered analysis.", category: "Analytics", logo_url: "", website_url: "#", github_url: "https://github.com/getsentry/sentry-mcp", views: 4200, upvotes: 298, stars: 298, status: "approved", is_sponsored: true, is_featured: false, tags: ["sentry", "errors", "monitoring"], created_at: "2026-01-20", author: "Sentry" },
  { id: 9, name: "Memory MCP", type: "mcp_server", description: "Give Claude persistent memory across conversations. Store and retrieve facts, preferences, and context that persists.", category: "Memory", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 6100, upvotes: 445, stars: 445, status: "approved", is_sponsored: false, is_featured: true, tags: ["memory", "context", "persistent"], created_at: "2026-01-25", author: "Anthropic" },
  { id: 10, name: "Linear MCP", type: "mcp_server", description: "Manage Linear issues, projects, and cycles from Claude. Create tickets, update statuses, and plan sprints conversationally.", category: "Productivity", logo_url: "", website_url: "#", github_url: "https://github.com/linear/linear-mcp", views: 3800, upvotes: 267, stars: 267, status: "approved", is_sponsored: false, is_featured: false, tags: ["linear", "project-management", "issues"], created_at: "2026-02-01", author: "Linear" },
  { id: 11, name: "Stripe MCP Server", type: "mcp_server", description: "Query payments, subscriptions, invoices, and customer data from Stripe. Analyze revenue and debug webhooks.", category: "API", logo_url: "", website_url: "#", github_url: "https://github.com/stripe/stripe-mcp", views: 4500, upvotes: 312, stars: 312, status: "approved", is_sponsored: false, is_featured: false, tags: ["stripe", "payments", "billing"], created_at: "2026-02-10", author: "Stripe" },
  { id: 12, name: "Docker MCP", type: "mcp_server", description: "Manage Docker containers, images, and compose stacks through Claude. Start, stop, inspect logs, and debug containers.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/docker/docker-mcp", views: 3200, upvotes: 234, stars: 234, status: "approved", is_sponsored: false, is_featured: false, tags: ["docker", "containers", "devops"], created_at: "2026-02-18", author: "Docker" },
  { id: 13, name: "Supabase MCP", type: "mcp_server", description: "Interact with your Supabase project — query tables, manage auth users, inspect storage buckets, and run edge functions.", category: "Database", logo_url: "", website_url: "#", github_url: "https://github.com/supabase/supabase-mcp", views: 5100, upvotes: 378, stars: 378, status: "approved", is_sponsored: false, is_featured: true, tags: ["supabase", "postgres", "auth"], created_at: "2026-02-25", author: "Supabase" },
  { id: 14, name: "Vercel MCP", type: "mcp_server", description: "Deploy, manage, and inspect Vercel projects from Claude. Check build logs, environment variables, and domain settings.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/vercel/vercel-mcp", views: 2800, upvotes: 198, stars: 198, status: "approved", is_sponsored: false, is_featured: false, tags: ["vercel", "deploy", "hosting"], created_at: "2026-03-01", author: "Vercel" },
  { id: 15, name: "Google Drive MCP", type: "mcp_server", description: "Search, read, and organize files in Google Drive. Extract text from docs, sheets, and presentations for analysis.", category: "File System", logo_url: "", website_url: "#", github_url: "https://github.com/anthropics/google-drive-mcp", views: 4000, upvotes: 289, stars: 289, status: "approved", is_sponsored: false, is_featured: false, tags: ["google-drive", "docs", "cloud-storage"], created_at: "2026-03-05", author: "Community" },
];

export const seedSkills: Listing[] = [
  { id: 101, name: "Code Interpreter", type: "skill", description: "Execute Python code in a sandboxed environment. Run data analysis, create visualizations, process files, and prototype algorithms in real-time.", category: "Code Execution", logo_url: "", website_url: "#", views: 18500, upvotes: 1240, status: "approved", is_sponsored: false, is_featured: true, tags: ["python", "sandbox", "data-analysis"], created_at: "2025-10-01", author: "OpenAI" },
  { id: 102, name: "Web Research Agent", type: "skill", description: "Autonomously search the web, read articles, and synthesize findings. Handles multi-step research with source citations.", category: "Research", logo_url: "", website_url: "#", views: 12300, upvotes: 876, status: "approved", is_sponsored: true, is_featured: true, tags: ["research", "web", "citations"], created_at: "2025-10-15", author: "Perplexity" },
  { id: 103, name: "Long-Term Memory", type: "skill", description: "Persistent knowledge storage across sessions. The agent remembers user preferences, past conversations, and learned facts.", category: "Memory", logo_url: "", website_url: "#", views: 9800, upvotes: 654, status: "approved", is_sponsored: false, is_featured: false, tags: ["memory", "context", "personalization"], created_at: "2025-11-01", author: "MemoryAI" },
  { id: 104, name: "Browser Automation", type: "skill", description: "Navigate websites, fill forms, click buttons, and extract data. Full browser control for workflow automation.", category: "Browser", logo_url: "", website_url: "#", views: 8400, upvotes: 567, status: "approved", is_sponsored: false, is_featured: false, tags: ["browser", "automation", "scraping"], created_at: "2025-11-10", author: "BrowserBase" },
  { id: 105, name: "Document Analysis", type: "skill", description: "Extract and analyze content from PDFs, Word docs, spreadsheets, and images. Summarize, compare, and answer questions about documents.", category: "Data", logo_url: "", website_url: "#", views: 7200, upvotes: 498, status: "approved", is_sponsored: false, is_featured: true, tags: ["pdf", "documents", "extraction"], created_at: "2025-11-20", author: "DocuMind" },
  { id: 106, name: "SEO Content Writer", type: "skill", description: "Generate SEO-optimized blog posts, meta descriptions, and content strategies. Includes keyword research and competitor analysis.", category: "Writing", logo_url: "", website_url: "#", views: 6100, upvotes: 432, status: "approved", is_sponsored: false, is_featured: false, tags: ["seo", "content", "marketing"], created_at: "2025-12-01", author: "ContentAI" },
  { id: 107, name: "CI/CD Pipeline Manager", type: "skill", description: "Monitor, trigger, and debug CI/CD pipelines. Works with GitHub Actions, GitLab CI, and Jenkins.", category: "DevOps", logo_url: "", website_url: "#", views: 4300, upvotes: 312, status: "approved", is_sponsored: false, is_featured: false, tags: ["ci-cd", "devops", "pipelines"], created_at: "2025-12-15", author: "DevOpsAI" },
  { id: 108, name: "Task Planner", type: "skill", description: "Break complex goals into actionable tasks with dependencies, estimates, and priority ordering. Integrates with project management tools.", category: "Automation", logo_url: "", website_url: "#", views: 5500, upvotes: 389, status: "approved", is_sponsored: false, is_featured: false, tags: ["planning", "tasks", "project-management"], created_at: "2026-01-01", author: "PlannerBot" },
  { id: 109, name: "SQL Query Builder", type: "skill", description: "Generate optimized SQL queries from natural language. Supports PostgreSQL, MySQL, SQLite with schema-aware suggestions.", category: "Data", logo_url: "", website_url: "#", views: 6800, upvotes: 478, status: "approved", is_sponsored: false, is_featured: false, tags: ["sql", "database", "query"], created_at: "2026-01-10", author: "QueryMaster" },
  { id: 110, name: "API Tester", type: "skill", description: "Test REST and GraphQL APIs interactively. Send requests, inspect responses, validate schemas, and generate documentation.", category: "DevOps", logo_url: "", website_url: "#", views: 3900, upvotes: 267, status: "approved", is_sponsored: false, is_featured: false, tags: ["api", "testing", "rest"], created_at: "2026-02-01", author: "APITools" },
];

export const seedPlugins: Listing[] = [
  { id: 201, name: "Mixpanel Analytics", type: "plugin", description: "Track events, funnels, and user behavior with Mixpanel. Get AI-powered insights on product metrics and retention.", category: "Analytics", logo_url: "", website_url: "#", views: 5400, upvotes: 345, status: "approved", is_sponsored: true, is_featured: true, tags: ["analytics", "mixpanel", "product"], created_at: "2025-11-01", author: "Mixpanel" },
  { id: 202, name: "Zapier Connector", type: "plugin", description: "Connect to 5000+ apps through Zapier. Trigger automations, sync data, and build multi-step workflows from your AI agent.", category: "Integration", logo_url: "", website_url: "#", views: 8900, upvotes: 567, status: "approved", is_sponsored: false, is_featured: true, tags: ["zapier", "automation", "integration"], created_at: "2025-11-15", author: "Zapier" },
  { id: 203, name: "Twilio SMS/Voice", type: "plugin", description: "Send SMS, make calls, and handle voice interactions through Twilio. Build conversational phone bots with your AI agent.", category: "Communication", logo_url: "", website_url: "#", views: 4200, upvotes: 289, status: "approved", is_sponsored: false, is_featured: false, tags: ["twilio", "sms", "voice"], created_at: "2025-12-01", author: "Twilio" },
  { id: 204, name: "AWS S3 Storage", type: "plugin", description: "Upload, download, and manage files in AWS S3 buckets. Handle presigned URLs, versioning, and lifecycle policies.", category: "Storage", logo_url: "", website_url: "#", views: 3800, upvotes: 234, status: "approved", is_sponsored: false, is_featured: false, tags: ["aws", "s3", "storage"], created_at: "2025-12-15", author: "AWS Community" },
  { id: 205, name: "Auth0 Identity", type: "plugin", description: "Manage user authentication and authorization with Auth0. Handle SSO, MFA, and role-based access control.", category: "Security", logo_url: "", website_url: "#", views: 3200, upvotes: 198, status: "approved", is_sponsored: false, is_featured: false, tags: ["auth0", "authentication", "security"], created_at: "2026-01-01", author: "Auth0" },
  { id: 206, name: "Resend Email", type: "plugin", description: "Send transactional and marketing emails through Resend. React email templates, deliverability tracking, and analytics.", category: "Communication", logo_url: "", website_url: "#", views: 4600, upvotes: 312, status: "approved", is_sponsored: true, is_featured: false, tags: ["email", "resend", "transactional"], created_at: "2026-01-10", author: "Resend" },
  { id: 207, name: "Cloudflare Workers", type: "plugin", description: "Deploy and manage edge functions on Cloudflare Workers. Run serverless code at the edge with AI-powered debugging.", category: "API", logo_url: "", website_url: "#", views: 2900, upvotes: 187, status: "approved", is_sponsored: false, is_featured: false, tags: ["cloudflare", "edge", "serverless"], created_at: "2026-01-20", author: "Cloudflare" },
  { id: 208, name: "Figma Design Sync", type: "plugin", description: "Extract design tokens, components, and layouts from Figma files. Generate code from designs and keep implementations in sync.", category: "UI", logo_url: "", website_url: "#", views: 5100, upvotes: 398, status: "approved", is_sponsored: false, is_featured: true, tags: ["figma", "design", "code-gen"], created_at: "2026-02-01", author: "FigmaConnect" },
  { id: 209, name: "n8n Workflows", type: "plugin", description: "Build and trigger n8n automation workflows. 400+ integrations for data pipelines, notifications, and business logic.", category: "Workflow", logo_url: "", website_url: "#", views: 3400, upvotes: 223, status: "approved", is_sponsored: false, is_featured: false, tags: ["n8n", "workflow", "automation"], created_at: "2026-02-10", author: "n8n" },
];

export const seedTemplates: Listing[] = [
  { id: 301, name: "Research Assistant", type: "template", description: "End-to-end research agent that searches the web, reads papers, and produces structured reports with citations. Configurable depth and source preferences.", category: "Research", logo_url: "", website_url: "#", github_url: "https://github.com/ai-templates/research-assistant", views: 7200, upvotes: 489, status: "approved", is_sponsored: false, is_featured: true, tags: ["research", "papers", "citations"], created_at: "2025-12-01", author: "AI Templates" },
  { id: 302, name: "Code Review Bot", type: "template", description: "Automated code reviewer that analyzes PRs for bugs, security issues, and style violations. Supports 15+ languages with custom rule sets.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/ai-templates/code-review-bot", views: 6100, upvotes: 412, status: "approved", is_sponsored: true, is_featured: true, tags: ["code-review", "pr", "quality"], created_at: "2025-12-15", author: "DevBot Labs" },
  { id: 303, name: "Customer Support Agent", type: "template", description: "AI-powered support agent with knowledge base integration, ticket routing, escalation rules, and satisfaction tracking.", category: "Customer Support", logo_url: "", website_url: "#", views: 5400, upvotes: 345, status: "approved", is_sponsored: false, is_featured: false, tags: ["support", "helpdesk", "tickets"], created_at: "2026-01-01", author: "SupportAI" },
  { id: 304, name: "Data Pipeline Orchestrator", type: "template", description: "Orchestrate ETL pipelines with natural language. Define sources, transforms, and destinations. Monitor data quality and freshness.", category: "Data Analysis", logo_url: "", website_url: "#", views: 3800, upvotes: 267, status: "approved", is_sponsored: false, is_featured: false, tags: ["etl", "data-pipeline", "orchestration"], created_at: "2026-01-15", author: "DataFlow" },
  { id: 305, name: "Blog Content Generator", type: "template", description: "Full content creation pipeline: keyword research → outline → draft → SEO optimization → social snippets. Multi-language support.", category: "Content", logo_url: "", website_url: "#", views: 4500, upvotes: 312, status: "approved", is_sponsored: false, is_featured: true, tags: ["blog", "content", "seo"], created_at: "2026-02-01", author: "ContentMill" },
  { id: 306, name: "Meeting Summarizer", type: "template", description: "Process meeting transcripts into structured summaries with action items, decisions, and follow-ups. Integrates with calendar and task tools.", category: "Productivity", logo_url: "", website_url: "#", views: 3200, upvotes: 234, status: "approved", is_sponsored: false, is_featured: false, tags: ["meetings", "summary", "action-items"], created_at: "2026-02-15", author: "MeetBot" },
  { id: 307, name: "Slack Triage Bot", type: "template", description: "Monitors Slack channels and automatically triages messages: categorizes, assigns priority, routes to the right team, and summarizes threads.", category: "Automation", logo_url: "", website_url: "#", views: 2800, upvotes: 198, status: "approved", is_sponsored: false, is_featured: false, tags: ["slack", "triage", "automation"], created_at: "2026-03-01", author: "SlackOps" },
];

export const seedJobs: Listing[] = [
  { id: 401, name: "Senior AI Agent Engineer", type: "job", description: "Build and scale autonomous AI agents for enterprise workflows. Design agent architectures, implement tool-use pipelines, and optimize for reliability.", category: "Engineering", logo_url: "", website_url: "#", views: 3200, upvotes: 0, status: "approved", is_sponsored: true, is_featured: true, tags: ["ai-agents", "python", "llm"], created_at: "2026-03-15", author: "Anthropic", company: "Anthropic", location: "San Francisco, CA", job_type: "Full-time", salary_range: "$250k – $350k" },
  { id: 402, name: "MCP Server Developer", type: "job", description: "Develop and maintain Model Context Protocol servers. Build integrations for popular developer tools and services.", category: "Engineering", logo_url: "", website_url: "#", views: 2400, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["mcp", "typescript", "integrations"], created_at: "2026-03-20", author: "Cursor", company: "Cursor", location: "Remote", job_type: "Full-time", salary_range: "$180k – $250k" },
  { id: 403, name: "AI Research Scientist", type: "job", description: "Conduct research on agent reasoning, tool use, and planning capabilities. Publish papers and prototype new agent architectures.", category: "Research", logo_url: "", website_url: "#", views: 1800, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["research", "ml", "reasoning"], created_at: "2026-03-25", author: "DeepMind", company: "Google DeepMind", location: "London, UK", job_type: "Full-time", salary_range: "$200k – $300k" },
  { id: 404, name: "Product Manager — AI Developer Tools", type: "job", description: "Own the roadmap for AI-powered developer tools. Work with engineering and design to ship features that developers love.", category: "Product", logo_url: "", website_url: "#", views: 1500, upvotes: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["product", "devtools", "strategy"], created_at: "2026-04-01", author: "Vercel", company: "Vercel", location: "Remote (US)", job_type: "Full-time", salary_range: "$190k – $260k" },
  { id: 405, name: "AI UX Designer", type: "job", description: "Design intuitive interfaces for AI-native applications. Craft conversational UX patterns, agent dashboards, and tool-use visualizations.", category: "Design", logo_url: "", website_url: "#", views: 1200, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["ux", "ai-native", "figma"], created_at: "2026-04-05", author: "Replit", company: "Replit", location: "Remote", job_type: "Full-time", salary_range: "$150k – $200k" },
  { id: 406, name: "Developer Relations — AI Platform", type: "job", description: "Build community, create tutorials, and represent the platform at conferences. Help developers build amazing AI-powered applications.", category: "Marketing", logo_url: "", website_url: "#", views: 980, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["devrel", "community", "content"], created_at: "2026-04-08", author: "Hugging Face", company: "Hugging Face", location: "Remote (Global)", job_type: "Full-time", salary_range: "$140k – $190k" },
  { id: 407, name: "ML Ops Engineer (Contract)", type: "job", description: "Set up and maintain ML infrastructure: model serving, A/B testing, monitoring, and data pipelines. 6-month contract with extension option.", category: "Engineering", logo_url: "", website_url: "#", views: 890, upvotes: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["mlops", "infrastructure", "kubernetes"], created_at: "2026-04-10", author: "Scale AI", company: "Scale AI", location: "San Francisco, CA", job_type: "Contract", salary_range: "$160k – $220k" },
];

export const seedAds: Ad[] = [
  { id: "ad-1", placement: "header", image_url: "", target_url: "https://anthropic.com", label: "🚀 Build AI agents with Claude — Try the API free for 30 days", active: true },
  { id: "ad-2", placement: "footer", image_url: "", target_url: "https://cursor.com", label: "⚡ Cursor — The AI-first code editor trusted by 500k+ developers", active: true },
  { id: "ad-3", placement: "sidebar", image_url: "", target_url: "https://supabase.com", label: "🗄️ Supabase — Build in a weekend, scale to millions", active: true },
  { id: "ad-4", placement: "in-content", image_url: "", target_url: "https://vercel.com", label: "▲ Deploy your AI app in seconds — Vercel makes it easy", active: true },
];
