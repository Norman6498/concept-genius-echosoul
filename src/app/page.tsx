import React from "react";
import { Navbar, HeroPage } from "@/components/landing/LandingHero";
import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-[#050B10] min-h-screen overflow-x-clip">
      <Navbar />
      <main id="main-content">
        <HeroPage />
      </main>

      {/* ── Global Footer ────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-[#F2D78A]/15 bg-[#050B10]/95 py-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-ui text-[#CFC5B5]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="hidden sm:flex items-center gap-5 text-[#9AA8B0]" aria-label="Footer navigation">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">Home</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
              <Link href="/stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-[#9AA8B0]">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
            <span>© 2026 Solenne. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
