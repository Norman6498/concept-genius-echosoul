import React from "react";
import { RouteGuard } from "@/lib/auth/guard";
import { Sidebar } from "@/components/shell/Sidebar";
import { BottomNav } from "@/components/shell/BottomNav";
import { TopBar } from "@/components/shell/TopBar";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-[#080c14] text-slate-100">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:px-8 pb-24 lg:pb-12">
            {children}
          </main>
          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </div>
      </div>
    </RouteGuard>
  );
}
