import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { Server, Zap, Puzzle, FileCode, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import { useSkills, usePlugins, useMcpServers, useTemplates, useJobs } from "@/hooks/useListings";

const features = [
  "Curated and community-submitted AI tools",
  "MCP servers tested with Claude and compatible LLMs",
  "Free listing for open-source projects",
  "Regular updates as new tools are published",
  "Admin-reviewed submissions for quality control",
  "Upvoting and view tracking for community ranking",
];

export default function AboutPage() {
  const { data: mcpServers } = useMcpServers();
  const { data: skills } = useSkills();
  const { data: plugins } = usePlugins();
  const { data: templates } = useTemplates();
  const { data: jobs } = useJobs();

  useSEO({
    title: "About OpenClaw — The AI Tools Directory",
    description: "OpenClaw is the open directory for AI MCP servers, agent skills, plugins, templates and jobs. Learn about our mission to make AI tools discoverable.",
    canonical: "https://openclaw.io/about",
  });

  const stats = [
    { label: "MCP Servers", value: `${mcpServers?.length || 0}`, icon: Server },
    { label: "Agent Skills", value: `${skills?.length || 0}`, icon: Zap },
    { label: "Plugins", value: `${plugins?.length || 0}`, icon: Puzzle },
    { label: "Templates", value: `${templates?.length || 0}`, icon: FileCode },
    { label: "AI Jobs", value: `${jobs?.length || 0}`, icon: Briefcase },
  ];

  return (
    <Layout>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-6">
            <span className="text-2xl font-bold">OC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About OpenClaw
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            OpenClaw is the open directory for AI tools — MCP servers, agent skills, plugins, templates and jobs — curated by and for the AI developer community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center">
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The AI tooling ecosystem is growing fast. Every week, hundreds of new MCP servers, agent skills, and plugins are published to GitHub and the broader community. Finding the right tool — and knowing which ones are actually worth using — has become a real problem.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              OpenClaw exists to solve that. We aggregate, curate, and rank AI tools so developers can spend less time searching and more time building. We're community-driven: anyone can submit a tool, and the community votes on what rises to the top.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Server, title: "MCP Servers", desc: "Model Context Protocol servers that extend Claude's capabilities with file systems, APIs, databases, browsers, and more." },
                { icon: Zap, title: "Agent Skills", desc: "Reusable capabilities — code execution, memory, web browsing, and more — that you can drop into any AI agent." },
                { icon: Puzzle, title: "Plugins", desc: "Drop-in integrations that connect your AI workflows to third-party services and data sources." },
                { icon: FileCode, title: "Templates", desc: "Ready-to-deploy agent blueprints for research, code review, customer support, and other common use cases." },
                { icon: Briefcase, title: "AI Jobs", desc: "The best AI engineering and research roles from companies building the next generation of AI products." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Why OpenClaw?</h2>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get Your Tool Listed</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Built something useful for the AI community? Submit it for free. Our team reviews all submissions and lists approved tools in the relevant category. Open-source tools are always listed for free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/submit">
                <button className="btn-primary h-10 px-6 text-[14px] flex items-center gap-2">
                  Submit a Tool <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/mcp-servers">
                <button className="btn-ghost h-10 px-6 text-[14px]">
                  Browse MCP Servers
                </button>
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-primary/20 bg-primary/[0.03] p-8">
            <h2 className="text-xl font-bold mb-2">Advertise on OpenClaw</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Reach thousands of AI developers and builders daily. We offer header, footer, sidebar and in-content placements. Contact us for rates and availability.
            </p>
            <a href="mailto:hello@openclaw.io" className="text-primary hover:underline text-sm font-medium">
              hello@openclaw.io →
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}
