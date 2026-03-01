"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, MessageCircle, User, LogOut, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="hidden md:flex w-full h-16 bg-white border-b fixed left-0 top-0 z-50 items-center justify-between px-8 shadow-sm">
      <div className="flex items-center h-16">
        <span className="text-xl font-bold text-primary">Jaigurudev Vivah</span>
      </div>
      
      <nav className="flex items-center space-x-6">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors relative text-sm font-medium",
                isActive
                  ? "text-primary bg-pink-50"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center">
        <Link
          href="/api/auth/logout"
          onClick={(e) => {
             e.preventDefault();
             fetch("/api/auth/logout", { method: "POST" }).then(() => {
                window.location.href = "/login";
             });
          }}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Link>
      </div>
    </div>
  );
}
