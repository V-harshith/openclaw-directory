import express from "express";
import cors from "cors";
import { router } from "./routes";
import { pool } from "./db";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use("/api", router);

app.get("/health", (_req, res) => res.json({ ok: true, service: "openclaw-api" }));

app.get("/sitemap.xml", async (_req, res) => {
  try {
    const { rows: items } = await pool.query(
      "SELECT id, type, name, created_at FROM listings WHERE status = 'approved'"
    );
    const base = process.env.SITE_URL || "https://openclaw.io";
    const typeToPath: Record<string, string> = {
      mcp_server: "mcp-servers",
      skill: "skills",
      plugin: "plugins",
      template: "templates",
      job: "jobs",
    };
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/mcp-servers", priority: "0.9", changefreq: "daily" },
      { url: "/skills", priority: "0.9", changefreq: "daily" },
      { url: "/plugins", priority: "0.9", changefreq: "daily" },
      { url: "/templates", priority: "0.8", changefreq: "weekly" },
      { url: "/jobs", priority: "0.9", changefreq: "daily" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/submit", priority: "0.7", changefreq: "monthly" },
    ];
    const now = new Date().toISOString().split("T")[0];
    const urls = [
      ...staticPages.map(p => `<url><loc>${base}${p.url}</loc><lastmod>${now}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`),
      ...items.map((item: any) => {
        const path = typeToPath[item.type] || `${item.type}s`;
        const lastmod = item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : now;
        return `<url><loc>${base}/${path}/${item.id}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
      }),
    ];
    res.set("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`);
  } catch {
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
  }
});

async function migrate() {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE listing_type AS ENUM ('skill', 'plugin', 'mcp_server', 'template', 'job');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE listing_status AS ENUM ('approved', 'pending', 'rejected');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE ad_placement AS ENUM ('header', 'footer', 'sidebar', 'in-content');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type listing_type NOT NULL DEFAULT 'skill',
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      logo_url TEXT DEFAULT '',
      website_url TEXT DEFAULT '',
      github_url TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      upvotes INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      status listing_status DEFAULT 'pending',
      is_sponsored BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      tags TEXT[] DEFAULT '{}',
      author TEXT NOT NULL,
      company TEXT,
      location TEXT,
      job_type TEXT,
      salary_range TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type listing_type NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      website_url TEXT DEFAULT '',
      github_url TEXT DEFAULT '',
      tags TEXT[] DEFAULT '{}',
      author TEXT NOT NULL,
      submitter_email TEXT DEFAULT '',
      status listing_status DEFAULT 'pending',
      company TEXT,
      location TEXT,
      job_type TEXT,
      salary_range TEXT,
      submitted_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ads (
      id SERIAL PRIMARY KEY,
      placement ad_placement NOT NULL DEFAULT 'header',
      label TEXT NOT NULL,
      target_url TEXT DEFAULT '#',
      image_url TEXT DEFAULT '',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM listings");
  if (parseInt(rows[0].count) === 0) await seedData();

  const { rows: adRows } = await pool.query("SELECT COUNT(*) FROM ads");
  if (parseInt(adRows[0].count) === 0) await seedAds();

  console.log("✅ Database migrated and ready");
}

async function seedData() {
  const seeds = [
    { name: "Filesystem MCP", type: "mcp_server", description: "Read, write, and manage local files and directories through Claude. Supports watching for changes and recursive operations.", category: "File System", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 14200, upvotes: 892, stars: 892, status: "approved", is_sponsored: false, is_featured: true, tags: ["filesystem", "local", "read-write"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "GitHub MCP Server", type: "mcp_server", description: "Interact with GitHub repos, issues, PRs, and actions directly from Claude. Search code, create branches, and review diffs.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 11800, upvotes: 764, stars: 764, status: "approved", is_sponsored: true, is_featured: true, tags: ["github", "git", "code-review"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "PostgreSQL MCP", type: "mcp_server", description: "Query and manage PostgreSQL databases with natural language. Execute SQL, inspect schemas, and visualize results.", category: "Database", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 9400, upvotes: 621, stars: 621, status: "approved", is_sponsored: false, is_featured: false, tags: ["postgres", "sql", "database"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "Brave Search MCP", type: "mcp_server", description: "Search the web using Brave Search API. Get real-time results, news, and summaries without leaving your conversation.", category: "Search", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 8700, upvotes: 543, stars: 543, status: "approved", is_sponsored: false, is_featured: false, tags: ["search", "web", "brave"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "Puppeteer MCP", type: "mcp_server", description: "Control a headless browser from Claude. Navigate pages, take screenshots, fill forms, and scrape structured data.", category: "Browser", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 7600, upvotes: 489, stars: 489, status: "approved", is_sponsored: false, is_featured: true, tags: ["browser", "puppeteer", "scraping"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "Slack MCP Server", type: "mcp_server", description: "Send messages, read channels, search history, and manage Slack workspaces through Claude.", category: "Communication", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 6800, upvotes: 412, stars: 412, status: "approved", is_sponsored: false, is_featured: false, tags: ["slack", "messaging", "team"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "Notion MCP", type: "mcp_server", description: "Read and write Notion pages, databases, and blocks. Sync your knowledge base with Claude for contextual assistance.", category: "Productivity", logo_url: "", website_url: "#", github_url: "https://github.com/makenotion/notion-mcp", views: 5900, upvotes: 387, stars: 387, status: "approved", is_sponsored: false, is_featured: false, tags: ["notion", "docs", "wiki"], author: "Notion Labs", company: null, location: null, job_type: null, salary_range: null },
    { name: "Memory MCP", type: "mcp_server", description: "Give Claude persistent memory across conversations. Store and retrieve facts, preferences, and context that persists.", category: "Memory", logo_url: "", website_url: "#", github_url: "https://github.com/modelcontextprotocol/servers", views: 6100, upvotes: 445, stars: 445, status: "approved", is_sponsored: false, is_featured: true, tags: ["memory", "context", "persistent"], author: "Anthropic", company: null, location: null, job_type: null, salary_range: null },
    { name: "Supabase MCP", type: "mcp_server", description: "Interact with your Supabase project — query tables, manage auth users, inspect storage buckets, and run edge functions.", category: "Database", logo_url: "", website_url: "#", github_url: "https://github.com/supabase/supabase-mcp", views: 5100, upvotes: 378, stars: 378, status: "approved", is_sponsored: false, is_featured: true, tags: ["supabase", "postgres", "auth"], author: "Supabase", company: null, location: null, job_type: null, salary_range: null },
    { name: "Stripe MCP Server", type: "mcp_server", description: "Query payments, subscriptions, invoices, and customer data from Stripe. Analyze revenue and debug webhooks.", category: "API", logo_url: "", website_url: "#", github_url: "https://github.com/stripe/stripe-mcp", views: 4500, upvotes: 312, stars: 312, status: "approved", is_sponsored: false, is_featured: false, tags: ["stripe", "payments", "billing"], author: "Stripe", company: null, location: null, job_type: null, salary_range: null },
    { name: "Code Interpreter", type: "skill", description: "Execute Python code in a sandboxed environment. Run data analysis, create visualizations, process files, and prototype algorithms in real-time.", category: "Code Execution", logo_url: "", website_url: "#", github_url: "", views: 18500, upvotes: 1240, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["python", "sandbox", "data-analysis"], author: "OpenAI", company: null, location: null, job_type: null, salary_range: null },
    { name: "Web Research Agent", type: "skill", description: "Autonomously search the web, read articles, and synthesize findings. Handles multi-step research with source citations.", category: "Research", logo_url: "", website_url: "#", github_url: "", views: 12300, upvotes: 876, stars: 0, status: "approved", is_sponsored: true, is_featured: true, tags: ["research", "web", "citations"], author: "Perplexity", company: null, location: null, job_type: null, salary_range: null },
    { name: "Long-Term Memory", type: "skill", description: "Persistent knowledge storage across sessions. The agent remembers user preferences, past conversations, and learned facts.", category: "Memory", logo_url: "", website_url: "#", github_url: "", views: 9800, upvotes: 654, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["memory", "context", "personalization"], author: "MemoryAI", company: null, location: null, job_type: null, salary_range: null },
    { name: "Browser Automation", type: "skill", description: "Navigate websites, fill forms, click buttons, and extract data. Full browser control for workflow automation.", category: "Browser", logo_url: "", website_url: "#", github_url: "", views: 8400, upvotes: 567, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["browser", "automation", "scraping"], author: "BrowserBase", company: null, location: null, job_type: null, salary_range: null },
    { name: "Mixpanel Analytics", type: "plugin", description: "Track events, funnels, and user behavior with Mixpanel. Get AI-powered insights on product metrics and retention.", category: "Analytics", logo_url: "", website_url: "#", github_url: "", views: 5400, upvotes: 345, stars: 0, status: "approved", is_sponsored: true, is_featured: true, tags: ["analytics", "mixpanel", "product"], author: "Mixpanel", company: null, location: null, job_type: null, salary_range: null },
    { name: "Zapier Connector", type: "plugin", description: "Connect to 5000+ apps through Zapier. Trigger automations, sync data, and build multi-step workflows from your AI agent.", category: "Integration", logo_url: "", website_url: "#", github_url: "", views: 8900, upvotes: 567, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["zapier", "automation", "integration"], author: "Zapier", company: null, location: null, job_type: null, salary_range: null },
    { name: "Resend Email", type: "plugin", description: "Send transactional and marketing emails through Resend. React email templates, deliverability tracking, and analytics.", category: "Communication", logo_url: "", website_url: "#", github_url: "", views: 4600, upvotes: 312, stars: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["email", "resend", "transactional"], author: "Resend", company: null, location: null, job_type: null, salary_range: null },
    { name: "Figma Design Sync", type: "plugin", description: "Extract design tokens, components, and layouts from Figma files. Generate code from designs and keep implementations in sync.", category: "UI", logo_url: "", website_url: "#", github_url: "", views: 5100, upvotes: 398, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["figma", "design", "code-gen"], author: "FigmaConnect", company: null, location: null, job_type: null, salary_range: null },
    { name: "Research Assistant", type: "template", description: "End-to-end research agent that searches the web, reads papers, and produces structured reports with citations. Configurable depth and source preferences.", category: "Research", logo_url: "", website_url: "#", github_url: "https://github.com/ai-templates/research-assistant", views: 7200, upvotes: 489, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["research", "papers", "citations"], author: "AI Templates", company: null, location: null, job_type: null, salary_range: null },
    { name: "Code Review Bot", type: "template", description: "Automated code reviewer that analyzes PRs for bugs, security issues, and style violations. Supports 15+ languages with custom rule sets.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "https://github.com/ai-templates/code-review-bot", views: 6100, upvotes: 412, stars: 0, status: "approved", is_sponsored: true, is_featured: true, tags: ["code-review", "pr", "quality"], author: "DevBot Labs", company: null, location: null, job_type: null, salary_range: null },
    { name: "Customer Support Agent", type: "template", description: "AI-powered support agent with knowledge base integration, ticket routing, escalation rules, and satisfaction tracking.", category: "Customer Support", logo_url: "", website_url: "#", github_url: "", views: 5400, upvotes: 345, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["support", "helpdesk", "tickets"], author: "SupportAI", company: null, location: null, job_type: null, salary_range: null },
    { name: "Blog Content Generator", type: "template", description: "Full content creation pipeline: keyword research → outline → draft → SEO optimization → social snippets. Multi-language support.", category: "Content", logo_url: "", website_url: "#", github_url: "", views: 4500, upvotes: 312, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["blog", "content", "seo"], author: "ContentMill", company: null, location: null, job_type: null, salary_range: null },
    { name: "Senior AI Agent Engineer", type: "job", description: "Build and scale autonomous AI agents for enterprise workflows. Design agent architectures, implement tool-use pipelines, and optimize for reliability.", category: "Engineering", logo_url: "", website_url: "#", github_url: "", views: 3200, upvotes: 0, stars: 0, status: "approved", is_sponsored: true, is_featured: true, tags: ["ai-agents", "python", "llm"], author: "Anthropic", company: "Anthropic", location: "San Francisco, CA", job_type: "Full-time", salary_range: "$250k – $350k" },
    { name: "MCP Server Developer", type: "job", description: "Develop and maintain Model Context Protocol servers. Build integrations for popular developer tools and services.", category: "Engineering", logo_url: "", website_url: "#", github_url: "", views: 2400, upvotes: 0, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["mcp", "typescript", "integrations"], author: "Cursor", company: "Cursor", location: "Remote", job_type: "Full-time", salary_range: "$180k – $250k" },
    { name: "AI Research Scientist", type: "job", description: "Conduct research on agent reasoning, tool use, and planning capabilities. Publish papers and prototype new agent architectures.", category: "Research", logo_url: "", website_url: "#", github_url: "", views: 1800, upvotes: 0, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["research", "ml", "reasoning"], author: "Google DeepMind", company: "Google DeepMind", location: "London, UK", job_type: "Full-time", salary_range: "$200k – $300k" },
    { name: "AI UX Designer", type: "job", description: "Design intuitive interfaces for AI-native applications. Craft conversational UX patterns, agent dashboards, and tool-use visualizations.", category: "Design", logo_url: "", website_url: "#", github_url: "", views: 1200, upvotes: 0, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["ux", "ai-native", "figma"], author: "Replit", company: "Replit", location: "Remote", job_type: "Full-time", salary_range: "$150k – $200k" },
  ];

  for (const seed of seeds) {
    await pool.query(
      `INSERT INTO listings (name, type, description, category, logo_url, website_url, github_url, views, upvotes, stars, status, is_sponsored, is_featured, tags, author, company, location, job_type, salary_range)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [seed.name, seed.type, seed.description, seed.category, seed.logo_url, seed.website_url, seed.github_url, seed.views, seed.upvotes, seed.stars, seed.status, seed.is_sponsored, seed.is_featured, seed.tags, seed.author, seed.company, seed.location, seed.job_type, seed.salary_range]
    );
  }
  console.log("✅ Seed data inserted");
}

async function seedAds() {
  const defaultAds = [
    { placement: "header", label: "🚀 Build AI agents with Claude — Try the API free for 30 days", target_url: "https://anthropic.com", active: true },
    { placement: "footer", label: "⚡ Cursor — The AI-first code editor trusted by 500k+ developers", target_url: "https://cursor.com", active: true },
    { placement: "sidebar", label: "🗄️ Supabase — Build in a weekend, scale to millions", target_url: "https://supabase.com", active: true },
    { placement: "in-content", label: "▲ Deploy your AI app in seconds — Vercel makes it easy", target_url: "https://vercel.com", active: true },
  ];
  for (const ad of defaultAds) {
    await pool.query(
      "INSERT INTO ads (placement, label, target_url, image_url, active) VALUES ($1,$2,$3,$4,$5)",
      [ad.placement, ad.label, ad.target_url, "", ad.active]
    );
  }
  console.log("✅ Default ads inserted");
}

migrate().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 OpenClaw API running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
