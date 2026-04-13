import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                AI
              </div>
              <span className="text-lg font-bold tracking-tight">
                AI<span className="text-primary">Dir</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The largest directory of AI skills, plugins, and tools. Discover, share, and build with AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Directory</h4>
            <div className="space-y-2">
              <Link to="/skills" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Skills</Link>
              <Link to="/plugins" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Plugins</Link>
              <Link to="/jobs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Jobs</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Community</h4>
            <div className="space-y-2">
              <Link to="/submit" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Submit a Listing</Link>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Advertise</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 AIDir. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for the AI community 🤖</p>
        </div>
      </div>
    </footer>
  );
}
