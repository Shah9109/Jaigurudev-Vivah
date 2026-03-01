"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r h-screen fixed left-0 top-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
           <span className="text-xl font-bold text-primary">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                  <Link 
                    key={href} 
                    href={href}
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors",
                        isActive ? "bg-pink-50 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                  </Link>
              )
           })}
        </nav>
        <div className="p-4 border-t">
            <Link
              href="/api/auth/logout"
              onClick={(e) => {
                 e.preventDefault();
                 fetch("/api/auth/logout", { method: "POST" }).then(() => {
                    window.location.href = "/login";
                 });
              }}
              className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
