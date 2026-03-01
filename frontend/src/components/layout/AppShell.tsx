"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Public routes that don't need the shell layout
  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/join";

  if (isPublicRoute) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation for Desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pt-16 transition-all duration-300">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-16 flex items-center justify-between md:hidden">
            <span className="text-xl font-bold text-primary">Jaigurudev Vivah</span>
             {/* Notification Icon */}
             <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bell"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Link>
        </div>
        
        {/* Desktop Top Bar (optional, sidebar handles nav) */}
        {/* Removed redundant top bar as Sidebar is now Top Nav */}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
        
        {/* Bottom Nav for Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}
