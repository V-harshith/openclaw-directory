import { Listing } from "@/data/mockData";

const GITHUB_API = "https://api.github.com";

const CATEGORY_MAP: Record<string, string> = {
  "mcp": "Automation",
  "mcp-server": "Automation",
  "claude": "Automation",
  "chatgpt": "Integration",
  "openai": "Integration",
  "browser": "Browser",
  "devops": "DevOps",
  "data": "Data",
  "analytics": "Data",
  "writing": "Writing",
  "design": "Design",
  "code": "Code",
  "coding": "Code",
  "research": "Research",
  "productivity": "Productivity",
  "api": "API",
  "security": "Security",
  "storage": "Storage",
  "voice": "Voice",
  "ui": "UI",
};

function mapTopicsToCategory(topics: string[]): string {
  for (const topic of topics) {
    const lower = topic.toLowerCase();
    for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return cat;
    }
  }
  return "Tools";
}

function mapTopicsToTags(topics: string[]): string[] {
  return topics.slice(0, 5);
}

interface GithubRepo {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  owner: { login: string; avatar_url: string };
  license: { name: string } | null;
}

function repoToListing(repo: GithubRepo, type: "skill" | "plugin"): Listing {
  return {
    id: `gh-${repo.id}`,
    name: repo.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    type,
    description: repo.description || "No description provided.",
    category: mapTopicsToCategory(repo.topics || []),
    logo_url: repo.owner.avatar_url,
    website_url: repo.html_url,
    views: repo.watchers_count + repo.forks_count * 3,
    upvotes: repo.stargazers_count,
    status: "approved",
    is_sponsored: false,
    is_featured: repo.stargazers_count > 500,
    tags: mapTopicsToTags(repo.topics || []),
    created_at: repo.created_at.split("T")[0],
    author: repo.owner.login,
    github_url: repo.html_url,
    stars: repo.stargazers_count,
  } as Listing & { github_url: string; stars: number };
}

async function fetchGithubRepos(query: string, perPage = 30): Promise<GithubRepo[]> {
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Try again later.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = await res.json();
  return data.items || [];
}

export async function fetchSkillsFromGitHub(): Promise<Listing[]> {
  const queries = [
    "topic:mcp-server",
    "topic:claude-skill",
    "topic:ai-skill",
    "topic:openai-plugin",
  ];

  const results = await Promise.allSettled(queries.map((q) => fetchGithubRepos(q, 15)));
  const all: GithubRepo[] = [];
  const seen = new Set<number>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const repo of result.value) {
        if (!seen.has(repo.id)) {
          seen.add(repo.id);
          all.push(repo);
        }
      }
    }
  }

  return all.map((r) => repoToListing(r, "skill")).sort((a, b) => b.upvotes - a.upvotes);
}

export async function fetchPluginsFromGitHub(): Promise<Listing[]> {
  const queries = [
    "topic:chatgpt-plugin",
    "topic:gpt-plugin",
    "topic:ai-plugin",
    "topic:llm-plugin",
  ];

  const results = await Promise.allSettled(queries.map((q) => fetchGithubRepos(q, 15)));
  const all: GithubRepo[] = [];
  const seen = new Set<number>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const repo of result.value) {
        if (!seen.has(repo.id)) {
          seen.add(repo.id);
          all.push(repo);
        }
      }
    }
  }

  return all.map((r) => repoToListing(r, "plugin")).sort((a, b) => b.upvotes - a.upvotes);
}

export async function fetchJobsFromGitHub(): Promise<Listing[]> {
  const repos = await fetchGithubRepos("AI engineer jobs remote LLM", 10).catch(() => []);
  return repos.map((r) => ({
    ...repoToListing(r, "skill"),
    id: `ghj-${r.id}`,
    type: "job" as const,
    company: r.owner.login,
    location: "Remote",
    job_type: "Full-time",
    salary_range: "",
  }));
}
