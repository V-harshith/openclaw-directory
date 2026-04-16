import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, Server, Zap, Puzzle, FileCode, Briefcase } from "lucide-react";
import { useState } from "react";
import { isAdminLoggedIn } from "@/lib/adminStore";

const navLinks = [
  { label: "MCP Servers", to: "/mcp-servers", icon: Server },
  { label: "Skills", to: "/skills", icon: Zap },
  { label: "Plugins", to: "/plugins", icon: Puzzle },
  { label: "Templates", to: "/templates", icon: FileCode },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminLoggedIn = isAdminLoggedIn();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-6xl">

        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground tracking-tight">
            OC
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            OpenClaw
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                location.pathname.startsWith(link.to)
                  ? "text-foreground bg-white/[0.06]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {adminLoggedIn && (
            <Link to="/admin">
              <button className="btn-ghost flex items-center gap-1.5 h-8 px-3 text-xs">
                <Shield className="h-3.5 w-3.5" /> Admin
              </button>
            </Link>
          )}
          <Link to="/submit">
            <button className="btn-ghost h-8 px-3 text-[13px]">
              Submit
            </button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-background px-4 py-4 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                location.pathname.startsWith(link.to)
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3">
            <Link to="/submit" className="flex-1" onClick={() => setMobileOpen(false)}>
              <button className="btn-ghost w-full h-9 text-sm">Submit</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
