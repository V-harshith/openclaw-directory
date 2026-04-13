import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isAdminLoggedIn } from "@/lib/adminStore";

const navLinks = [
  { label: "Skills", to: "/skills" },
  { label: "Plugins", to: "/plugins" },
  { label: "Jobs", to: "/jobs" },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminLoggedIn = isAdminLoggedIn();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            AI
          </div>
          <span className="text-lg font-bold tracking-tight">
            AI<span className="text-primary">Dir</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {adminLoggedIn && (
            <Link to="/admin">
              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Admin
              </Button>
            </Link>
          )}
          <Link to="/submit">
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              Submit Listing
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/submit" className="flex-1" onClick={() => setMobileOpen(false)}>
              <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary">Submit</Button>
            </Link>
            <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-primary text-primary-foreground">Sign In</Button>
            </Link>
          </div>
          {adminLoggedIn && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary gap-1.5 mt-1">
                <Shield className="h-3.5 w-3.5" /> Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
