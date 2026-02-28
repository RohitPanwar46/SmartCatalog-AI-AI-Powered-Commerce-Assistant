"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center text-white">
        {/* Brand */}
        <Link href="/" className="group flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            SmartCatalog AI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-sm font-medium">
          <Link
            href="/"
            className="relative px-1 py-2 transition-colors hover:text-white/80 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
          >
            Generator
          </Link>
          <Link
            href="/chat"
            className="relative px-1 py-2 transition-colors hover:text-white/80 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
          >
            Support Bot
          </Link>
        </div>
      </div>
    </nav>
  );
}