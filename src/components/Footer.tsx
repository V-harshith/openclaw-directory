import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-24">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
                AI
              </div>
              <span className="text-[15px] font-semibold tracking-tight">AIDir</span>
            </Link>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              The open directory for AI skills, plugins, and opportunities. Curated from GitHub and the community.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/[0.07] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/[0.07] text-muted-foreground hover:text-foreground hover:border-white/[0.14] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-foreground/60 uppercase tracking-wider mb-4">Directory</h4>
            <div className="space-y-2.5">
              <Link to="/skills" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Skills</Link>
              <Link to="/plugins" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Plugins</Link>
              <Link to="/jobs" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Jobs</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-foreground/60 uppercase tracking-wider mb-4">Community</h4>
            <div className="space-y-2.5">
              <Link to="/submit" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Submit a Tool</Link>
              <a href="#" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Advertise</a>
              <a href="#" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Newsletter</a>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-foreground/60 uppercase tracking-wider mb-4">Legal</h4>
            <div className="space-y-2.5">
              <a href="#" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <Link to="/admin" className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-muted-foreground/60">© 2026 AIDir. Open source. Built for the AI community.</p>
          <p className="text-[12px] text-muted-foreground/40">Data sourced from GitHub public API</p>
        </div>
      </div>
    </footer>
  );
}
