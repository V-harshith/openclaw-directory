import express from "express";
import cors from "cors";
import { router } from "./routes";
import { db } from "./db";
import { pool } from "./db";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/health", (_req, res) => res.json({ ok: true, service: "openclaw-api" }));

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
  if (parseInt(rows[0].count) === 0) {
    await seedData();
  }

  const { rows: adRows } = await pool.query("SELECT COUNT(*) FROM ads");
  if (parseInt(adRows[0].count) === 0) {
    await seedAds();
  }

  console.log("✅ Database migrated and ready");
}

async function seedData() {
  const seeds = [
    { name: "MCP Filesystem", type: "mcp_server", description: "Read and write files on your local filesystem through Claude. Full directory traversal and file operations.", category: "File System", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem", views: 8400, upvotes: 1230, stars: 1230, status: "approved", is_sponsored: false, is_featured: true, tags: ["filesystem", "mcp", "claude"], author: "Anthropic", is_sponsored_val: false },
    { name: "MCP GitHub", type: "mcp_server", description: "Interact with GitHub repositories, issues, pull requests, and files directly through Claude.", category: "Developer Tools", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github", views: 9200, upvotes: 1540, stars: 1540, status: "approved", is_sponsored: false, is_featured: true, tags: ["github", "mcp", "git"], author: "Anthropic" },
    { name: "MCP PostgreSQL", type: "mcp_server", description: "Query and explore PostgreSQL databases through natural language. Full CRUD operations via Claude.", category: "Database", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres", views: 7100, upvotes: 980, stars: 980, status: "approved", is_sponsored: false, is_featured: false, tags: ["postgres", "database", "mcp"], author: "Anthropic" },
    { name: "MCP Brave Search", type: "mcp_server", description: "Give Claude real-time web search capabilities using the Brave Search API.", category: "Search", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search", views: 11200, upvotes: 1830, stars: 1830, status: "approved", is_sponsored: false, is_featured: true, tags: ["search", "brave", "web", "mcp"], author: "Anthropic" },
    { name: "MCP Puppeteer", type: "mcp_server", description: "Browser automation for Claude. Navigate pages, take screenshots, fill forms, and extract content.", category: "Browser", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer", views: 6800, upvotes: 890, stars: 890, status: "approved", is_sponsored: false, is_featured: false, tags: ["browser", "puppeteer", "automation", "mcp"], author: "Anthropic" },
    { name: "MCP Slack", type: "mcp_server", description: "Read and send Slack messages, manage channels, and search workspace content through Claude.", category: "Communication", logo_url: "", website_url: "https://github.com/modelcontextprotocol/servers", github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack", views: 5400, upvotes: 720, stars: 720, status: "approved", is_sponsored: false, is_featured: false, tags: ["slack", "messaging", "mcp"], author: "Anthropic" },
    { name: "Claude Code Runner", type: "skill", description: "Execute Python, JavaScript, Bash and other code directly from Claude conversations with full output capture.", category: "Code Execution", logo_url: "", website_url: "#", github_url: "", views: 13400, upvotes: 2100, stars: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["code", "execution", "python", "javascript"], author: "Community" },
    { name: "Agent Memory", type: "skill", description: "Persistent memory for AI agents across sessions. Store, retrieve, and search long-term context.", category: "Memory", logo_url: "", website_url: "#", github_url: "", views: 8900, upvotes: 1450, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["memory", "agent", "persistence"], author: "Community" },
    { name: "Research Agent", type: "template", description: "Full research agent template — web search, source validation, synthesis, and citation generation.", category: "Research", logo_url: "", website_url: "#", github_url: "", views: 7200, upvotes: 1100, stars: 0, status: "approved", is_sponsored: false, is_featured: true, tags: ["research", "template", "agent"], author: "OpenClaw" },
    { name: "Code Review Agent", type: "template", description: "Automated code review agent with security analysis, performance recommendations, and PR comments.", category: "Developer Tools", logo_url: "", website_url: "#", github_url: "", views: 6100, upvotes: 890, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["code-review", "template", "security"], author: "OpenClaw" },
    { name: "Data Analysis Plugin", type: "plugin", description: "Connect Claude to your data sources. Analyze CSVs, databases, and APIs with natural language queries.", category: "Analytics", logo_url: "", website_url: "#", github_url: "", views: 9800, upvotes: 1560, stars: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["data", "analytics", "csv"], author: "DataCo" },
    { name: "MCP Calendar", type: "mcp_server", description: "Google Calendar integration — read events, create meetings, and manage your schedule through Claude.", category: "Productivity", logo_url: "", website_url: "#", github_url: "", views: 4800, upvotes: 630, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["calendar", "google", "schedule", "mcp"], author: "Community" },
    { name: "Senior AI Agent Engineer", type: "job", description: "Build and ship AI agents using Claude, MCP, and LangChain. You will own the full agent stack from prompt design to production deployment.", category: "Engineering", logo_url: "", website_url: "#", github_url: "", views: 4200, upvotes: 0, stars: 0, status: "approved", is_sponsored: true, is_featured: false, tags: ["agent", "claude", "engineering"], author: "AgentCorp", company: "AgentCorp", location: "Remote", job_type: "Full-time", salary_range: "$180k – $260k" },
    { name: "Prompt Engineer – Agents", type: "job", description: "Craft and optimize prompts for production AI agents. Deep understanding of Claude and chain-of-thought prompting required.", category: "Engineering", logo_url: "", website_url: "#", github_url: "", views: 3100, upvotes: 0, stars: 0, status: "approved", is_sponsored: false, is_featured: false, tags: ["prompt", "claude", "agent"], author: "PromptLabs", company: "PromptLabs", location: "Remote", job_type: "Contract", salary_range: "$120k – $160k" },
  ];

  for (const seed of seeds) {
    await pool.query(
      `INSERT INTO listings (name, type, description, category, logo_url, website_url, github_url, views, upvotes, stars, status, is_sponsored, is_featured, tags, author, company, location, job_type, salary_range)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [seed.name, seed.type, seed.description, seed.category, seed.logo_url || "", seed.website_url || "", seed.github_url || "", seed.views, seed.upvotes, seed.stars || 0, seed.status, seed.is_sponsored, seed.is_featured, seed.tags || [], seed.author, seed.company || null, seed.location || null, seed.job_type || null, seed.salary_range || null]
    );
  }
  console.log("✅ Seed data inserted");
}

async function seedAds() {
  const defaultAds = [
    { placement: "header", label: "🚀 Ship your AI agent faster — Try OpenClaw Cloud Free", target_url: "#", image_url: "", active: true },
    { placement: "footer", label: "⚡ Sponsor this directory — Reach 50k+ AI developers monthly", target_url: "#", image_url: "", active: true },
    { placement: "sidebar", label: "📊 OpenClaw Analytics — Free Trial", target_url: "#", image_url: "", active: true },
    { placement: "in-content", label: "🎯 List your MCP server here — Free submission", target_url: "#", image_url: "", active: true },
  ];
  for (const ad of defaultAds) {
    await pool.query(
      "INSERT INTO ads (placement, label, target_url, image_url, active) VALUES ($1,$2,$3,$4,$5)",
      [ad.placement, ad.label, ad.target_url, ad.image_url, ad.active]
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
