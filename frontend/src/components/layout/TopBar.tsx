"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b flex items-center justify-between px-4 md:pl-72 md:pr-8 lg:pl-80 lg:pr-12">
      <div className="md:hidden flex items-center">
        <span className="text-xl font-bold text-primary">Jaigurudev Vivah</span>
      </div>
      <div className="flex-1 text-center md:text-left md:pl-4 hidden md:block">
        <h1 className="text-xl font-semibold text-gray-800 capitalize">
          {pathname === "/" ? "Home" : pathname?.split("/")[1]}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
      </div>
    </div>
  );
}
