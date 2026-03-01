"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-t border-gray-200 md:hidden">
      <div className="grid h-full grid-cols-4 mx-auto max-w-lg">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 group hover:bg-gray-50",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6 mb-1 transition-colors duration-200",
                    isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
