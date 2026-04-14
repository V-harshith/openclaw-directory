import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Server, Zap, Puzzle, FileCode, Briefcase } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-2xl py-32 text-center">
        <div className="text-[80px] font-bold text-primary/10 leading-none mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">Page not found</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-sm mx-auto leading-relaxed">
          This page doesn't exist. Try browsing one of the directories below.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            { to: "/mcp-servers", icon: Server, label: "MCP Servers" },
            { to: "/skills", icon: Zap, label: "Skills" },
            { to: "/plugins", icon: Puzzle, label: "Plugins" },
            { to: "/templates", icon: FileCode, label: "Templates" },
            { to: "/jobs", icon: Briefcase, label: "AI Jobs" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.03] text-[13px] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-all"
            >
              <item.icon className="h-3.5 w-3.5 text-primary/60" />
              {item.label}
            </Link>
          ))}
        </div>
        <Link to="/" className="btn-primary inline-flex h-10 items-center px-6 text-[13px] rounded-lg">
          Back to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
